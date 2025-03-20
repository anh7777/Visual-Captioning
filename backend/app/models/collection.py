from sqlalchemy import Column, ForeignKey, String, DateTime, func
from app.models.base import Base
from enum import Enum as PyEnum
from app.utils.identifier import generate_id


class Collection(Base):
    __tablename__ = 'collection'

    collection_id = Column(String, primary_key=True, nullable=False, index=True, default=generate_id)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False, index=True)
    collection_name = Column(String, nullable=False)
    thumbnail_url = Column(String, default='/web-application/static/placeholder.jpg')
    created_at = Column(DateTime, nullable=False, default=func.now())