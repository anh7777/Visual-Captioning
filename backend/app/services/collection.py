from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.collection import Collection
from app.schemas.collection import CollectionRequest
from fastapi import HTTPException, status

async def get_all_collections_by_user_id(user_id: str, db: AsyncSession):
    result = await db.execute(
        select(Collection).filter(Collection.user_id == user_id)
    )
    return result.scalars().all()

async def check_and_create_collection(request: CollectionRequest, user_id: str, db: AsyncSession):
    collection_name = request.collection_name
    exists_collection = await db.execute(
        select(Collection).filter(Collection.collection_name == collection_name, Collection.user_id == user_id)
    )
    collection = exists_collection.scalars().first()
    
    if collection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collection already exists"
        )

    new_collection = Collection(collection_name=collection_name, user_id=user_id)
    
    db.add(new_collection)
    await db.commit()