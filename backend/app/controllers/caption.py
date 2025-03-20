from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.caption import generate_image_caption
from app.core.dependencies import get_current_user, get_db
from app.schemas.caption import CaptionRequest
from app.services.caption import add_caption_to_db
from app.services.media import add_media_file_to_db
from app.utils.url import generate_analysis_url
import os

router = APIRouter()

@router.post('/generate')
async def generate_caption(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    try:
        image_bytes = await file.read()
        caption = generate_image_caption(image_bytes).capitalize()
        return {'caption': caption}
    except Exception as e:
        return {"error": str(e)}


@router.post('/save-file')
async def save_file(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    extension = os.path.splitext(file.filename)[-1]
    media_url = generate_analysis_url(extension)
    file_path = os.path.join('/home/marknguyen/VSCodeProjects/vs-cap-app/datalake', media_url)
    await add_media_file_to_db(file, file_path)
    return {'media_url': media_url}

    
@router.post('/save-metadata')
async def save_meta_data(request: CaptionRequest, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await add_caption_to_db(request, db)
    return {'message': 'Add caption successfully.'}


