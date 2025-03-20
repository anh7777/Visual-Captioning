from sqlalchemy import Column, ForeignKey, Text, Integer, String
from app.models.base import Base
from app.utils.identifier import generate_id

class Caption(Base):
    __tablename__ = 'caption'

    caption_id = Column(String, primary_key=True, nullable=False, default=generate_id)
    media_url = Column(String, nullable=False)
    original_caption = Column(Text, nullable=False)
    rate = Column(Integer)
    suggested_caption = Column(Text)