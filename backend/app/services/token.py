from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.auth import RefreshToken


async def get_refresh_token(jti: str, db: AsyncSession) -> RefreshToken:
    query = await db.execute(select(RefreshToken).filter(RefreshToken.jti == jti))
    exis_rt = query.scalar_one_or_none()

    if not exis_rt:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or does not exist"
        )

    return exis_rt


async def revoke_refresh_token(jti: str, db: AsyncSession):
    """Thu hồi refresh token cụ thể"""
    rt = await get_refresh_token(jti, db)

    rt.revoked = True
    await db.commit()


async def check_revoked_refresh_token(jti: str, db: AsyncSession) -> bool:
    rt = await get_refresh_token(jti, db)
    return rt.revoked



async def revoke_all_refresh_tokens(sub: str, db: AsyncSession):
    query = await db.execute(select(RefreshToken).filter(RefreshToken.sub == sub))
    exis_rts = query.scalars().all()

    if not exis_rts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No refresh tokens found for the user"
        )

    for t in exis_rts:
        if not t.revoked:
            t.revoked = True

    await db.commit()


async def add_refresh_token_to_db(json_token_id: str, user_id: str, db: AsyncSession):
    new_rt = RefreshToken(
        jti=json_token_id,
        sub=user_id,
    )
    
    db.add(new_rt)
    await db.commit()
    await db.refresh(new_rt)
