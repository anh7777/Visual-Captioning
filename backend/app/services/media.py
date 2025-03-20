from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.media import Media
from app.schemas.media import MediaRequest

async def get_media_by_collection_id(collection_id: str, db: AsyncSession):
    result = await db.execute(
        select(Media).filter(Media.collection_id == collection_id)
    )
    return result.scalars().all()


async def add_media_metadata_to_db(request: MediaRequest, user_id: str, db: AsyncSession):
    new_media = Media(
        collection_id=request.collection_id,
        user_id=user_id,
        media_name=request.media_name,
        url=request.base_url,
        media_type=request.media_type,
        caption=request.caption
    )

    db.add(new_media)
    await db.commit()
    await db.refresh(new_media)

async def add_media_file_to_db(file: UploadFile, file_path: str):
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())


async def get_caption_by_media_id(media_id: str, db: AsyncSession):
    result = await db.execute(select(Media.caption).where(Media.media_id == media_id))
    return result.scalar_one_or_none()