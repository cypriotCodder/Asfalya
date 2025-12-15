import asyncio
from backend.database import engine, AsyncSessionLocal, Base
from backend.models import User
from backend.auth_utils import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if admin exists
        result = await session.execute(select(User).where(User.email == "admin@asfalya.com"))
        if result.scalars().first():
            print("Admin user already exists")
            return

        admin_user = User(
            email="admin@asfalya.com",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_admin=True
        )
        session.add(admin_user)
        await session.commit()
        print("Admin user created: admin@asfalya.com / admin123")

if __name__ == "__main__":
    asyncio.run(create_admin())
