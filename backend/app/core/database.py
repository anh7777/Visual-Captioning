from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import config

# Tạo engine kết nối cơ sở dữ liệu
engine = create_async_engine(
    config.get_db_url(),
    echo=config.DEBUG,
)

# Tạo session factory
async_session = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession
)
