from sqlalchemy import Column, ForeignKey, String, Enum, DateTime, func, Text
from app.models.base import Base
from enum import Enum as PyEnum
from app.utils.identifier import generate_id

class MediaType(PyEnum):
    image = 'image'
    video = 'video'

class Media(Base):
    __tablename__ = 'media'

    media_id = Column(String, primary_key=True, nullable=False, index=True, default=generate_id)
    user_id = Column(String, ForeignKey('users.user_id'),  nullable=False, index=True)
    collection_id = Column(String, ForeignKey('collection.collection_id'), nullable=False, index=True)
    media_name = Column(String, nullable=False, default='Untitled')
    url = Column(String, nullable=False)
    media_type = Column(Enum(MediaType), nullable=False)
    caption = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=func.now())
