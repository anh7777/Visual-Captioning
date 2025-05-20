from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from botocore.client import BaseClient
from app.core.dependencies import get_s3_client
from app.core.config import config
from app.core.dependencies import get_current_user, get_mongo_db
from app.schemas.album import AlbumCreate, AlbumResponse, AlbumUpdate, AlbumDelete, AlbumCount
from app.utils.s3 import generate_presigned_url
from uuid import uuid4
from datetime import datetime


router = APIRouter()


@router.post('/create')
async def create_album(
    album: AlbumCreate, 
    user_id: str = Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    existing = await db['albums'].find_one({
        'user_id': user_id,
        'album_name': album.album_name
    })

    if existing:
        raise HTTPException(status_code=400, detail='Album name already exists.')

    new_album = {
        'album_id': str(uuid4()),
        'album_name': album.album_name,
        'user_id': user_id,
        'created_at': datetime.now()
    }

    await db['albums'].insert_one(new_album)
    return {'message': 'Album created successfully'}


@router.get('/read', response_model=list[AlbumResponse])
async def read_all_albums(
    user_id: str=Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    albums_cursor = db['albums'].find({'user_id': user_id})
    albums = []
    async for album in albums_cursor:
        new_album = {            
            'album_id': album['album_id'],
            'album_name': album['album_name'],
            'created_at': album['created_at']
        }

        if album.get('thumbnail_id') is not None:
            media = await db['medias'].find_one({'media_id': album['thumbnail_id']})
            if media:
                new_album['thumbnail_url'] = generate_presigned_url(media['media_url'], s3_client) 
            else: 
                await db['albums'].update_one(
                    {'album_id': album['album_id'], 'user_id': user_id},
                    {'$unset': {'thumbnail_url': 1}}
                )           
        albums.append(new_album)
            
    return albums


@router.patch('/update')
async def update_album(
    request: AlbumUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    update_fields = request.model_dump(exclude_none=True, exclude_unset=True)
    if 'thumbnail_id' in update_fields:
        update_fields['thumbnail_id'] = update_fields['thumbnail_id']

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    result = await db['albums'].update_one(
        {'album_id': request.album_id, 'user_id': user_id},
        {'$set': update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")

    return {"message": "Album updated successfully"}


@router.delete('/delete')
async def delete_album(
    request: list[AlbumDelete], 
    user_id: str = Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    album_ids = [item.album_id for item in request]

    result = await db['albums'].delete_many({
        'album_id': {'$in': album_ids},
        'user_id': user_id
    })

    media_cursor = db['medias'].find({
        'album_id': {'$in': album_ids},
        'user_id': user_id
    })
    obj_keys = []
    async for media in media_cursor:
        obj_keys.append(media['media_url'])
    for obj_key in obj_keys:
        try:
            s3_client.delete_object(Bucket=config.BUCKET_NAME, Key=obj_key)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while deleting '{obj_key}' from S3 storage."
        )

    await db['medias'].delete_many({
        'album_id': {'$in': album_ids},
        'user_id': user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No albums found to delete")

    return {"message": f"Successfully deleted {result.deleted_count} album(s)"}


@router.get('/count', response_model=list[AlbumCount])
async def count_media_album(
    user_id: str = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$lookup": {
                "from": "medias",
                "localField": "album_id",
                "foreignField": "album_id",
                "as": "media_docs"
            }
        },
        {
            "$project": {
                "album_id": 1,
                "album_name": 1,
                "count": {"$size": "$media_docs"}
            }
        }
    ]

    albums = await db['albums'].aggregate(pipeline).to_list(length=None)
    return [AlbumCount(**album) for album in albums]


