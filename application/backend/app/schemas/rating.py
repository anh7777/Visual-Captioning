from pydantic import BaseModel
from typing import Optional


class Rating(BaseModel):
    media_url: str
    rate: int
    feedback: Optional[str] = ''
    caption: str
    name: Optional[str] = ''
    ingredients: Optional[list[str]] = []
    instructions: Optional[list[str]] = []
