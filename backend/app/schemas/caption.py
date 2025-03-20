from pydantic import BaseModel
from typing import Optional

class CaptionRequest(BaseModel):
    media_url: str
    original_caption: str
    rate: int
    suggested_caption: Optional[str] = None
