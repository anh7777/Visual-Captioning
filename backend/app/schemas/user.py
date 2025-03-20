from pydantic import BaseModel


class UserInfo(BaseModel):
    role: str
    full_name: str

    class Config:
        from_attributes = True