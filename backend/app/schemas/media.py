from pydantic import BaseModel
from typing import Optional
from enum import Enum


class Media(BaseModel):
    media_id: str
    media_name: str
    url: str
    media_type: str

    class Config:
        from_attributes = True  

class MediaRequest(BaseModel):
    media_name: Optional[str] = None
    collection_id: str
    media_type: str
    caption: str
    base_url: str