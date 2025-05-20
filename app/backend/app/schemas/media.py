from pydantic import BaseModel
from typing import Optional

class MediaCreate(BaseModel):
    album_id: str
    media_url: str
    media_name: str
    media_type: str
    caption: str
    name: Optional[str] = ''
    instructions: Optional[list[str]] = []
    ingredients: Optional[list[str]] = []


class MediaUpdate(BaseModel):
    media_id: str
    media_name: str


class MediaDelete(BaseModel):
    media_id: str


class MediaDetailResponse(BaseModel):
    media_id: str
    media_url: str
    media_name: str
    caption: str
    media_type: str
    name: str
    instructions: list[str]
    ingredients: list[str]

    class Config:
        from_attributes = True


class MediaAlbumResponse(BaseModel):
    media_id: str
    media_url: str
    media_name: str
    
    class Config:
        from_attributes = True