from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Default to localhost, but this WON'T work in Railway
DEFAULT_DB_URL = "postgresql+asyncpg://user:password@localhost/asfalya"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# Railway provides postgresql:// or postgres:// but we need postgresql+asyncpg:// for async SQLAlchemy
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

# Ensure the URL has the correct async driver
if "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://")

# Create engine - disable SSL for Railway internal connections
engine = create_async_engine(
    DATABASE_URL, 
    echo=False, # Set to False to reduce noise in logs
    connect_args={"ssl": False}
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
