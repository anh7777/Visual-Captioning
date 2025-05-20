from fastapi import APIRouter, Depends, UploadFile, File
from app.core.dependencies import get_current_user
from app.models import generate_caption, classify_image, inverse_cooking
from app.schemas.model import RecipeResponse


router = APIRouter()


@router.post('/label')
async def classify(file: UploadFile=File(...), user_id = Depends(get_current_user)):
    image_bytes = await file.read()
    result = classify_image(image_bytes)
    return {'label': result}


@router.post('/caption')
async def get_caption(file: UploadFile=File(...), user_id = Depends(get_current_user)):
    image_bytes = await file.read()
    caption = generate_caption(image_bytes)
    return {"caption": caption.capitalize()}


@router.post('/recipe', response_model = RecipeResponse)
async def inverse(file: UploadFile=File(...), user_id = Depends(get_current_user)):
    image_bytes = await file.read()
    name, ingrs, instrs = inverse_cooking(image_bytes)
    ingrs = [ingr.capitalize().replace('_', ' ') for ingr in ingrs]
    return RecipeResponse(
        name=name,
        ingredients=ingrs,
        instructions=instrs
    )



    
