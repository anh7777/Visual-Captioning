from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.schemas.collection import Collection
from app.services.collection import get_all_collections_by_user_id, check_and_create_collection
from app.utils.url import generate_display_url
from app.schemas.collection import CollectionRequest

router = APIRouter()


@router.get('/all', response_model=list[Collection])
async def get_all_collections(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    collections = await get_all_collections_by_user_id(user_id, db)
    if not collections:
        raise HTTPException(status_code=404, detail="No collections found")
    return [Collection(
        collection_id=c.collection_id,
        collection_name=c.collection_name,
        thumbnail_url=generate_display_url(c.thumbnail_url)

    ) for c in collections]

@router.post('/create')
async def create_collection(request: CollectionRequest, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await check_and_create_collection(request, user_id, db)
    return {"message": "Collection created successfully!"}