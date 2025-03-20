from sqlalchemy import Column, String, Boolean, ForeignKey
from app.models.base import Base


class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'

    jti = Column(String, primary_key=True, index=True, nullable=False)
    sub = Column(String, ForeignKey('users.user_id'), index=True, nullable=False)
    revoked = Column(Boolean, nullable=False, default=False)