from fastapi import APIRouter, HTTPException, Depends, Response, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import RegisterRequest
from app.services.user import add_user_to_db, authenticate_user
from app.services.token import add_refresh_token_to_db, check_revoked_refresh_token, revoke_refresh_token, revoke_all_refresh_tokens
from app.core.dependencies import get_db
from app.utils.jwt import verify_token, create_access_token, create_refresh_token
from app.schemas.auth import AccessToken

router = APIRouter()

@router.post("/signup")
async def register(form: RegisterRequest, db: AsyncSession = Depends(get_db)):
    await add_user_to_db(form, db)
    return {"message": "Register successfully."}
 
@router.post("/login", response_model=AccessToken)
async def login(res: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    sub = await authenticate_user(form_data.username, form_data.password, db)
    rt = create_refresh_token(sub)
    jti = verify_token(rt).get('jti')
    await add_refresh_token_to_db(jti, sub, db)
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    res.set_cookie(
        key="refresh_token",
        value=rt,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )

    at = create_access_token(sub)

    return AccessToken(access_token=at, token_type='bearer')

@router.post("/logout")
async def logout(res: Response, req: Request, db: AsyncSession = Depends(get_db)):
    rt = req.cookies.get('refresh_token')
    if rt:
        jti = verify_token(rt).get('jti')
        await revoke_refresh_token(jti, db) 
    res.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logout successfully."}


@router.post("/logout-all")
async def logout_all(req: Request, res: Response, db: AsyncSession = Depends(get_db)):
    rt = req.cookies.get('refresh_token')
    sub = verify_token(rt).get('sub')
    await revoke_all_refresh_tokens(sub, db)
    res.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logout all successfully."}


@router.post("/refresh", response_model=AccessToken)
async def refresh(req: Request, res: Response, db: AsyncSession = Depends(get_db)):
    cur_rt = req.cookies.get('refresh_token')
    cur_pay = verify_token(cur_rt)
    sub, cur_jti = cur_pay.get('sub'), cur_pay.get('jti')
    res.delete_cookie(key="refresh_token", path="/")

    is_revoked = await check_revoked_refresh_token(cur_jti, db)
    if is_revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has already been revoked"
        )
    
    await revoke_refresh_token(cur_jti, db)
    new_rt = create_refresh_token(sub)
    new_pay = verify_token(new_rt)
    new_jti = new_pay.get('jti')
    await add_refresh_token_to_db(new_jti, sub, db)

    res.set_cookie(
        key="refresh_token",
        value=new_rt,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )

    new_at = create_access_token(sub)

    return AccessToken(access_token=new_at, token_type='bearer')