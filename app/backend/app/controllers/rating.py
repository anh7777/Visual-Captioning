from fastapi import APIRouter, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from botocore.client import BaseClient
from app.core.dependencies import get_current_user, get_mongo_db, get_s3_client
from app.core.config import config
from app.schemas.rating import Rating
from datetime import datetime
from uuid import uuid4


router = APIRouter()


@router.post('/create')
async def rate_caption(request: Rating, user_id = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_mongo_db)):
    new_rating = {
        'user_id': user_id,
        'media_url': request.media_url,
        'rate': request.rate,
        'feedback': request.feedback,
        'caption': request.caption,
        'name': request.name,
        'ingredients': request.ingredients,
        'instructions': request.instructions,
        'created_at': datetime.now()
    }

    db['ratings'].insert_one(new_rating)
    return {'message': 'Created rating successfully'}


@router.post('/save')
async def save_media(
    file: UploadFile = File(...), 
    user_id = Depends(get_current_user),
    s3_client: BaseClient = Depends(get_s3_client)
):
    extension = file.filename.split('.')[-1]
    file_name = f"{uuid4()}.{extension}"
    media_url = f'feedbacks/{file_name}'
    
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

