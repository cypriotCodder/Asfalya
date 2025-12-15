from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import pandas as pd
import io
from database import engine, Base, get_db
from models import Mechanic, User
from auth_utils import verify_password, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from jose import JWTError, jwt
import os

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

class Token(BaseModel):
    access_token: str
    token_type: str

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    # Try finding by phone if email failed (since we made email nullable)
    # Note: OAuth2 form expects 'username' field, we can treat it as email or phone
    if not user:
         result = await db.execute(select(User).where(User.phone == form_data.username))
         user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email if user.email else user.phone}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

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
async def upload_mechanics(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
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
async def upload_customers(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
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

@app.get("/api/mechanics")
async def get_mechanics(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mechanic))
    mechanics = result.scalars().all()
    return mechanics
