import asyncio
from sqlalchemy import text
from database import engine

async def add_columns():
    async with engine.begin() as conn:
        print("Adding otp_code column...")
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN otp_code VARCHAR"))
            print("Added otp_code.")
        except Exception as e:
            print(f"otp_code might already exist: {e}")

        print("Adding otp_expiry column...")
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN otp_expiry TIMESTAMP WITH TIME ZONE"))
            print("Added otp_expiry.")
        except Exception as e:
            print(f"otp_expiry might already exist: {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_columns())
