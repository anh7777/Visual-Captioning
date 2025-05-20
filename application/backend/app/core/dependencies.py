from fastapi import Depends
from app.core.config import config
from app.core.security import oauth2_scheme
from app.utils.token import verify_token


async def get_current_user(access_token: str=Depends(oauth2_scheme)):
    payload = verify_token(access_token)
    return payload.get('sub')


async def get_mongo_db():
    return config.MONGO_DATABASE


async def get_s3_client():
    return config.S3_CLIENT



