from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, UploadFile
from app.schemas.caption import CaptionRequest
from app.models.caption import Caption

async def add_caption_to_db(request: CaptionRequest, db: AsyncSession):
    new_caption = Caption(
        media_url=request.media_url,
        original_caption=request.original_caption,
        rate = request.rate,
        suggested_caption=request.suggested_caption
    )

    db.add(new_caption)
    await db.commit()
    await db.refresh(new_caption)


async def add_media_file_to_db(file: UploadFile, file_path: str):
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())