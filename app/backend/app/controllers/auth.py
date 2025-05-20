from fastapi import APIRouter, HTTPException, Response, Request, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from botocore.client import BaseClient
from app.schemas.auth import SignupRequest, UserResponse, UserUpdate
from app.core.config import config
from app.core.dependencies import get_mongo_db, get_current_user, get_s3_client
from app.utils.hashing import verify_password, hash_password
from app.utils.token import create_token, verify_token
from datetime import datetime, timedelta, timezone
from uuid import uuid4


router = APIRouter()


@router.post('/login')
async def login(response: Response, form_data: OAuth2PasswordRequestForm=Depends(), db: AsyncIOMotorDatabase=Depends(get_mongo_db)):
    user = await db['users'].find_one({"username": form_data.username})
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_token({'sub': user['user_id']})
    refresh_token = create_token({'sub': user['user_id']}, typ='refresh')
    response.set_cookie(
        key="rt", 
        value=refresh_token,
        httponly=True,
        secure=True,
        expires=datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/signup')
async def signup(form_data: SignupRequest, db: AsyncIOMotorDatabase=Depends(get_mongo_db)):
    existing = await db['users'].find_one({
        "$or": [{"username": form_data.username}]
    })

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_pwd = hash_password(form_data.password)
    user_id = str(uuid4())
    user = {
        "username": form_data.username,
        "password": hashed_pwd,
        'user_id': user_id,
        "email": form_data.email,
        "fullname": form_data.fullname,
        "role": "user",
    }
    await db['users'].insert_one(user)

    return {'message': 'User created successfully'}


@router.get('/info', response_model=UserResponse)
async def get_user(user_id: str = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_mongo_db)):
    user = await db['users'].find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie('rt')
    return {'message': 'Logout successfully'}


@router.post('/refresh')
async def refresh(request: Request, response: Response):
    old_rt = request.cookies.get('rt')
    user_id = verify_token(old_rt).get('sub')
    new_rt = create_token({'sub': user_id}, typ='refresh')
    response.set_cookie(
        key="rt", 
        value=new_rt,
        httponly=True,
        secure=True,
        expires=datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    new_at = create_token({'sub': user_id})
    return {"access_token": new_at, "token_type": "bearer"}


@router.patch('/update')
async def update_user(
    request: UserUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    update_fields = request.model_dump(exclude_unset=True)
    cur_user = await db['users'].find_one({"user_id": user_id})

    errors = {}

    if not verify_password(request.current_password, cur_user['password']):
        errors['password'] = "Current password is incorrect"

    if request.email and cur_user['email'] == request.email:
        errors['email'] = "New email cannot be the same as the current email"

    if errors:
        raise HTTPException(status_code=400, detail=errors)

    if request.new_password:
        update_fields["password"] = hash_password(request.new_password)

    update_fields.pop("current_password", None)
    update_fields.pop("new_password", None)

    await db['users'].update_one(
        {'user_id': user_id},
        {'$set': update_fields}
    )

    return {"message": "User updated successfully"}


@router.delete('/delete')
async def delete_account(
    user_id: str = Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    s3_client: BaseClient = Depends(get_s3_client)
):
    result_user = await db['users'].delete_one({'user_id': user_id})

    media_cursor = db['medias'].find({'user_id': user_id})
    obj_keys = []
    async for media in media_cursor:
        obj_keys.append(media['media_url'])

    for obj_key in obj_keys:
        try:
            s3_client.delete_object(Bucket=config.BUCKET_NAME, Key=obj_key)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while deleting '{obj_key}' from S3 storage."
        )
    
    await db['medias'].delete_many({'user_id': user_id})
    await db['albums'].delete_many({'user_id': user_id})

    if result_user.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Account and related data deleted successfully"}
