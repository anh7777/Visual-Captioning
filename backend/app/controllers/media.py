from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.schemas.media import Media as Media, MediaRequest
from app.services.media import get_caption_by_media_id, get_media_by_collection_id, add_media_file_to_db, add_media_metadata_to_db
from app.utils.url import generate_display_url, generate_user_media_url
from app.core.database import s3_client
from app.core.config import config
from shortuuid import uuid
import os

router = APIRouter()


@router.get('/collection', response_model=list[Media])
async def get_media(collection_id: str, db: AsyncSession = Depends(get_db), user_id = Depends(get_current_user)):
    media = await get_media_by_collection_id(collection_id, db)
    if not media:
        return []
    
    return [Media(
        media_id=m.media_id,
        media_name=m.media_name,
        url=generate_display_url(m.url),
        media_type=m.media_type
    ) for m in media]

@router.get('/caption')
async def get_caption(media_id: str, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    caption = await get_caption_by_media_id(media_id, db)
    return {'caption': caption}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    file_extension = os.path.splitext(file.filename)[-1] 
    s3_key = f"{config.BASE_FOLDER}/{user_id}/{uuid()}{file_extension}"
    s3_client.upload_fileobj(file.file, config.BUCKET_NAME, s3_key)
    return {"message": "Upload thành công!", "s3_url": f"https://{config.BUCKET_NAME}.s3.amazonaws.com/{s3_key}"}


@router.post('/save-file')
async def save_file(file: UploadFile = File(...),user_id: str = Depends(get_current_user)):
    extension = os.path.splitext(file.filename)[-1]
    base_url = generate_user_media_url(user_id, extension)
    file_path = os.path.join('/home/marknguyen/VSCodeProjects/vs-cap-app/datalake', base_url)
    await add_media_file_to_db(file, file_path)
    return {'base_url': base_url}


@router.post('/save-metadata')
async def save_metadata(request: MediaRequest, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await add_media_metadata_to_db(request, user_id, db)
    return {'message': 'Metadata saved successfully'}


