import jwt
from jwt import PyJWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from app.core.config import config
from fastapi import HTTPException, status


def create_token(data: dict, typ: str='access') -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc)
    if typ == 'access':
        expire += timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    elif typ == 'refresh':
        expire += timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    else: 
        raise ValueError('Type token invalid')
    to_encode['exp'] = expire
    token = jwt.encode(to_encode, config.JWT_SECRET_KEY, config.JWT_ALGORITHM)
    return token


def verify_token(token)-> dict:
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
