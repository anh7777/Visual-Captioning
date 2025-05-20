from pydantic import BaseModel
from typing import Optional
from enum import Enum


class Role(str, Enum):
    admin = 'admin'
    user = 'user'


class SignupRequest(BaseModel):
    username: str
    password: str
    email: str
    fullname: str


class UserResponse(BaseModel):
    username: str
    user_id: str
    email: str
    fullname: str
    role: Role


class UserUpdate(BaseModel):
    current_password: Optional[str] = None
    new_password: Optional[str] = None
    fullname: Optional[str] = None
    email: Optional[str] = None
