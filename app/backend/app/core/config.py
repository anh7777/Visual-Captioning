from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
import boto3


load_dotenv()


class Config():
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRE_DAYS'))
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')


    MONGO_CLIENT = AsyncIOMotorClient(os.getenv('MONGO_URI'))
    MONGO_DATABASE = MONGO_CLIENT[os.getenv('MONGO_DB_NAME')]

    S3_CLIENT = boto3.client(
        service_name='s3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
    )
    BUCKET_NAME = os.getenv('BUCKET_NAME')


config = Config()