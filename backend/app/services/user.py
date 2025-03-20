from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.utils.hashing import hash_string, verify_string

async def add_user_to_db(form: RegisterRequest, db: AsyncSession) -> None:
    user_info = await db.execute(select(User).filter(User.username == form.username))
    exis_user = user_info.scalar_one_or_none()
    if exis_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username has already been taken."
        )

    new_user = User(
        username=form.username,
        password=hash_string(form.password),
        full_name=form.full_name
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)


async def authenticate_user(username: str, password: str, db: AsyncSession) -> int:
    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_string(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return user.user_id

async def get_info_by_user_id(user_id: str, db: AsyncSession) -> dict:
    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

    


