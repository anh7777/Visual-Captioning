from fastapi import HTTPException, status
import jwt
from jwt.exceptions import PyJWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from app.core.config import config
from uuid import uuid4

def create_refresh_token(sub) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    jti = str(uuid4())
    data = {'sub': sub, 'exp': exp, 'jti': jti}
    refresh_token = jwt.encode(data, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)
    return refresh_token

def create_access_token(sub: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {'sub': sub, 'exp': exp}
    access_token = jwt.encode(data, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)
    return access_token

def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])
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

