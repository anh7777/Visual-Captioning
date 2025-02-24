from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterResponse(BaseModel):
    user_id: str
    username: str
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        from_attributes = True