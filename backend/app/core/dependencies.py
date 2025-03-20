from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.database import async_session
from app.utils.jwt import verify_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')


async def get_db():
    """Lấy session kết nối cơ sở dữ liệu"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(access_token: str = Depends(oauth2_scheme)):
    payload = verify_token(access_token)
    user_id = payload.get("sub")
    return user_id

