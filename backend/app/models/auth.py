from sqlalchemy import Column, String, Enum, Boolean, ForeignKey
from app.models.base import Base
from enum import Enum as PyEnum

class Role(PyEnum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = 'users'

    user_id = Column(String, primary_key=True, index=True, nullable=False, unique=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.user)


class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'

    jti = Column(String, primary_key=True, index=True, nullable=False)
    sub = Column(String, ForeignKey('users.user_id'), index=True, nullable=False)
    revoked = Column(Boolean, nullable=False, default=False)