from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlbumCreate(BaseModel):
    album_name: str


class AlbumUpdate(BaseModel):
    album_id: str
    album_name: Optional[str] = None
    thumbnail_id: Optional[str] = None


class AlbumDelete(BaseModel):
    album_id: str


class AlbumResponse(BaseModel):
    album_id: str
    album_name: str
    created_at: datetime
    thumbnail_url: Optional[str] = None

    class Config:
        from_attributes = True


class AlbumCount(BaseModel):
    album_id: str
    count: int
    album_name: str