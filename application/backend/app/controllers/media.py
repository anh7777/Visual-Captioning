from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import config
from app.core.dependencies import get_current_user, get_mongo_db, get_s3_client
from app.schemas.media import \
    MediaCreate, \
    MediaUpdate, \
    MediaDelete, \
    MediaDetailResponse, \
    MediaAlbumResponse
from app.utils.s3 import generate_presigned_url
from datetime import datetime
from uuid import uuid4
import os
from botocore.client import BaseClient


router = APIRouter()


@router.get('/read', response_model=MediaDetailResponse)
async def get_media(
    media_id: str, 
    user_id: str=Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    media = await db['medias'].find_one({
        'media_id': media_id,
        'user_id': user_id
    })

    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    
    return {
        'media_id': media['media_id'],
        'media_url': generate_presigned_url(media['media_url'], s3_client),
        'media_name': media['media_name'],
        'media_type': media['media_type'],
        'caption': media['caption'],
        'name': media['name'],
        'instructions': media['instructions'],
        'ingredients': media['ingredients']
    }


@router.get('/read-album', response_model=list[MediaAlbumResponse])
async def get_media_album(
    album_id: str, 
    user_id: str=Depends(get_current_user), 
    db: AsyncIOMotorDatabase=Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    medias_cursor = db['medias'].find({
        'album_id': album_id,
        'user_id': user_id
    })
    
    medias = []
    async for media in medias_cursor:
        medias.append({
            'media_id': media['media_id'],
            'media_url': generate_presigned_url(media['media_url'], s3_client),
            'media_name': media['media_name'],
        })
    
    return medias


@router.post('/add')
async def add_media(file: UploadFile = File(...), user_id: str=Depends(get_current_user), s3_client: BaseClient = Depends(get_s3_client) ):
    extension = file.filename.split('.')[-1]
    file_name = f"{uuid4()}.{extension}"
    media_url = f'users/{file_name}'
    s3_client.upload_fileobj(
        file.file,
        config.BUCKET_NAME,
        media_url,
        ExtraArgs={
            'ContentType': file.content_type,
            'ContentDisposition': 'inline'
        }
    )
    return {'media_url': media_url}


@router.post('/create')
async def create_media(request: MediaCreate, user_id: str=Depends(get_current_user), db: AsyncIOMotorDatabase=Depends(get_mongo_db)):
    album = await db['albums'].find_one({
        'album_id': request.album_id,
        'user_id': user_id
    })


    if album is None:
        raise HTTPException(status_code=404, detail="Album not found")
    
    media_id = os.path.splitext(request.media_url.split('/')[-1])[0]
    
    if album.get('thumbnail_id') is None:
        await db['albums'].update_one(
            {'album_id': request.album_id, 'user_id': user_id},
            {'$set': {'thumbnail_id': media_id}}
        )

    media = {
        'media_id': media_id,
        'user_id': user_id,
        'album_id': request.album_id,
        'media_url': request.media_url,
        'media_name': request.media_name,
        'media_type': request.media_type,
        'caption': request.caption,
        'name': request.name,
        'ingredients': request.ingredients,
        'instructions': request.instructions,
        'created_at': datetime.now()
    }

    await db['medias'].insert_one(media)
    return {'message': 'Create media successfully'}


@router.patch('/update')
async def update_media(
    request: MediaUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    update_fields = request.model_dump(exclude_none=True, exclude_unset=True)

    result = await db['medias'].update_one(
        {'media_id': request.media_id, 'user_id': user_id},
        {'$set': update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    
    return {"message": "Media updated successfully"}



@router.delete('/delete')
async def delete_media(
    request: list[MediaDelete], 
    user_id: str = Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    media_ids = [item.media_id for item in request]

    obj_keys = [doc['media_url'] async for doc in db['medias'].find({'media_id': {'$in': media_ids}})]
    for obj_key in obj_keys:
        try:
            s3_client.delete_object(Bucket=config.BUCKET_NAME, Key=obj_key)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while deleting '{obj_key}' from S3 storage."
        )

    result = await db['medias'].delete_many(
        {
            'media_id': {'$in': media_ids},
            'user_id': user_id
        })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No media found to delete")
    
    await db['albums'].update_many(
        {'thumbnail_id': {'$in': media_ids}},
        {'$set': {'thumbnail_id': None}}
    )

    return {"message": f"Successfully deleted {result.deleted_count} media"}



@router.delete('/delete-album')
async def delete_media_album(album_id: str, user_id: str=Depends(get_current_user), db: AsyncIOMotorDatabase=Depends(get_mongo_db)):
    result = await db['medias'].delete_many(
        {
            'album_id': album_id,
            'user_id': user_id
        }
    )
    return {"message": f"{result.deleted_count} media deleted successfully"} 

