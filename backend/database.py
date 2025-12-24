from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL must be set in the environment.
# Example for local dev: "postgresql+asyncpg://user:password@localhost/asfalya"
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL environment variable. Please set it in your .env file or environment.")

# Railway provides postgresql:// or postgres:// but we need postgresql+asyncpg:// for async SQLAlchemy
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

# Ensure the URL has the correct async driver
if "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://")

# extract host for debugging
try:
    db_host = DATABASE_URL.split("@")[1].split("/")[0]
except:
    db_host = "unknown"

print(f"[DB] Attempting connection to HOST: {db_host}")
if "localhost" in db_host or "127.0.0.1" in db_host:
    print("!!! WARNING: DATABASE_URL points to localhost. This will FAIL in Railway unless you are running a local database service in the same container. !!!")
    print("!!! Please add DATABASE_URL variable in Railway Backend Service -> Variables !!!")

print(f"[DB] Using DATABASE_URL: {DATABASE_URL[:60]}...") 

# Create engine - disable SSL for Railway internal connections
engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"ssl": False}
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
