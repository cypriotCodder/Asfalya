from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import pandas as pd
import io
from .database import engine, Base, get_db
from .models import Mechanic
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/upload/mechanics")
async def upload_mechanics(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Validation: Check required columns
        required_columns = ['name', 'address', 'latitude', 'longitude']
        if not all(col in df.columns for col in required_columns):
             raise HTTPException(status_code=400, detail=f"Missing required columns: {required_columns}")

        mechanics = []
        for _, row in df.iterrows():
            mechanic = Mechanic(
                name=row['name'],
                address=row['address'],
                latitude=str(row['latitude']),
                longitude=str(row['longitude']),
                phone=str(row.get('phone', ''))
            )
            db.add(mechanic)
        
        await db.commit()
        return {"message": f"Successfully imported {len(df)} mechanics"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/customers")
async def upload_customers(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Validation: Check required columns
        # We need either email or phone, so we check if at least one of these columns exists in the dataframe
        if 'email' not in df.columns and 'phone' not in df.columns:
             raise HTTPException(status_code=400, detail="Missing required columns: must have 'email' or 'phone'")

        users = []
        for _, row in df.iterrows():
            email = row.get('email')
            phone = row.get('phone')
            
            if pd.isna(email) and pd.isna(phone):
                continue # Skip rows without email or phone

            # Handle NaN values explicitly
            email_val = str(email) if not pd.isna(email) else None
            phone_val = str(phone) if not pd.isna(phone) else None

            # Check if user already exists (simplified check)
            # In a real app we'd query DB, but here we'll let unique constraint handle it or do a pre-check
            # For now let's just create and catch integrity errors if needed, or better, skip provided duplicates in this simple implementation
            
            user = User(
                email=email_val,
                phone=phone_val,
                hashed_password="auth123", # Default password
                is_admin=False
            )
            db.add(user)
        
        await db.commit()
        return {"message": f"Successfully imported {len(df)} customers"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
