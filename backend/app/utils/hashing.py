from passlib.context import CryptContext
from cryptography.fernet import Fernet
from app.core.config import config

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
cipher = Fernet(config.FERNET_SECRET_KEY)

def hash_string(password: str) -> str:
    return pwd_context.hash(password)

def verify_string(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def encrypt_string(data: str) -> str:
    return cipher.encrypt(data.encode()).decode()

def decrypt_string(encrypted_data: str) -> str:
    return cipher.decrypt(encrypted_data.encode()).decode()


