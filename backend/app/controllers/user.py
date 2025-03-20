from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.services.user import get_info_by_user_id
from app.schemas.user import UserInfo

router = APIRouter()

@router.get('/info', response_model=UserInfo)
async def get_user_info(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    info = await get_info_by_user_id(user_id, db)
    return info