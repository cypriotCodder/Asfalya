from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
import pandas as pd
import io
from database import engine, Base, get_db
from models import Mechanic, User
from auth_utils import verify_password, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
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

class UserRegister(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str

@app.post("/register", response_model=Token)
async def register_user(user: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where((User.email == user.email) | (User.phone == user.phone)))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or phone already registered"
        )

    # Create new user
    new_user = User(
        email=user.email,
        phone=user.phone,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        is_active=True,
        is_admin=False
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

origins = [
    "http://localhost:3000",
    "https://asfalya-delta.vercel.app",  # No trailing slash!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
async def get_mechanics(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Mechanic))
    mechanics = result.scalars().all()
    return mechanics
class UserResponse(BaseModel):
    id: int
    email: str | None
    phone: str | None
    full_name: str | None
    premium: float | None
    is_active: bool
    is_admin: bool
    policy_type: str | None
    policy_number: str | None
    policy_expiry: datetime | None
    vehicle_plate: str | None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: str | None = None
    phone: str | None = None
    full_name: str | None = None
    premium: float | None = None
    policy_type: str | None = None
    policy_number: str | None = None
    policy_expiry: datetime | None = None
    vehicle_plate: str | None = None

@app.get("/api/customers", response_model=list[UserResponse])
async def get_customers(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(select(User).where(User.is_admin == False))
    return result.scalars().all()

class UserCreate(BaseModel):
    email: str | None = None
    phone: str | None = None
    full_name: str | None = None
    premium: float | None = None
    policy_type: str | None = None
    policy_number: str | None = None
    policy_expiry: datetime | None = None
    vehicle_plate: str | None = None

@app.post("/api/customers", response_model=UserResponse)
async def create_customer(user_create: UserCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if user already exists
    if user_create.email:
        existing_email = await db.execute(select(User).where(User.email == user_create.email))
        if existing_email.scalars().first():
             raise HTTPException(status_code=400, detail="Email already registered")
             
    if user_create.phone:
        existing_phone = await db.execute(select(User).where(User.phone == user_create.phone))
        if existing_phone.scalars().first():
             raise HTTPException(status_code=400, detail="Phone already registered")

    new_user = User(
        email=user_create.email,
        phone=user_create.phone,
        hashed_password=get_password_hash("123456"), # Default password
        is_active=True,
        is_admin=False,
        full_name=user_create.full_name,
        premium=user_create.premium or 0,
        policy_type=user_create.policy_type,
        policy_number=user_create.policy_number,
        policy_expiry=user_create.policy_expiry,
        vehicle_plate=user_create.vehicle_plate
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.put("/api/customers/{user_id}", response_model=UserResponse)
async def update_customer(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.premium is not None:
        user.premium = user_update.premium
    if user_update.policy_type is not None:
        user.policy_type = user_update.policy_type
    if user_update.policy_number is not None:
        user.policy_number = user_update.policy_number
    if user_update.policy_expiry is not None:
        user.policy_expiry = user_update.policy_expiry
    if user_update.vehicle_plate is not None:
        user.vehicle_plate = user_update.vehicle_plate
        
    await db.commit()
    await db.refresh(user)
    return user

class NotificationRequest(BaseModel):
    message: str
    target_audience: str = "all" # 'all', 'active', 'renewal_1week'

@app.post("/api/notifications/broadcast")
async def broadcast_notification(
    request: NotificationRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = select(User).where(User.is_admin == False)
    if request.target_audience == 'active':
        query = query.where(User.is_active == True)
    elif request.target_audience == 'renewal_1week':
        now = datetime.now()
        next_week = now + timedelta(days=7)
        # Check if expiry is in the future AND within next 7 days
        query = query.where(User.policy_expiry >= now).where(User.policy_expiry <= next_week)
        
    result = await db.execute(query)
    users = result.scalars().all()
    
    count = 0
    print(f"--- START BROADCAST: {request.message} ---")
    for user in users:
        if user.phone:
            # Mock sending
            print(f"[Mock WhatsApp] Sending to {user.phone}: {request.message}")
            count += 1
    print(f"--- END BROADCAST: Sent {count} messages ---")
            
    return {"status": "success", "sent_count": count}

@app.delete("/api/customers/{user_id}")
async def delete_customer(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}

# Analytics Endpoints
from collections import Counter, defaultdict

@app.get("/api/analytics/policy-distribution")
async def get_policy_distribution(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(select(User.policy_type))
    policies = result.scalars().all()
    
    # Filter out None and count
    counts = Counter([p for p in policies if p])
    return [{"name": k, "value": v} for k, v in counts.items()]

@app.get("/api/analytics/expiry-timeline")
async def get_expiry_timeline(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    now = datetime.now()
    six_months_later = now + timedelta(days=180)
    
    result = await db.execute(select(User.policy_expiry).where(User.policy_expiry >= now).where(User.policy_expiry <= six_months_later))
    expiries = result.scalars().all()
    
    # Aggregate by Month-Year
    monthly_counts = defaultdict(int)
    for date in expiries:
        if date:
            key = date.strftime("%Y-%m") # e.g., 2024-01
            monthly_counts[key] += 1
            
    # Sort and format
    sorted_keys = sorted(monthly_counts.keys())
    return [{"month": k, "count": monthly_counts[k]} for k in sorted_keys]

@app.get("/api/analytics/customer-growth")
async def get_customer_growth(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get all creation dates
    result = await db.execute(select(User.created_at))
    dates = result.scalars().all()
    
    monthly_counts = defaultdict(int)
    for date in dates:
        if date:
            key = date.strftime("%Y-%m")
            monthly_counts[key] += 1
            
    sorted_keys = sorted(monthly_counts.keys())
    
    # Calculate cumulative growth
    growth_data = []
    cumulative = 0
    for key in sorted_keys:
        cumulative += monthly_counts[key]
        growth_data.append({"month": key, "users": cumulative})
        
    return growth_data

@app.get("/api/analytics/financial-summary")
async def get_financial_summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Calculate Total Revenue
    result = await db.execute(select(func.sum(User.premium)).where(User.is_admin == False))
    total_revenue = result.scalar() or 0
    
    # Revenue by Policy Type
    result = await db.execute(select(User.policy_type, func.sum(User.premium)).where(User.is_admin == False).group_by(User.policy_type))
    revenue_by_type_raw = result.all()
    revenue_by_type = [{"name": r[0] or "Unknown", "value": r[1] or 0} for r in revenue_by_type_raw]
    
    # Revenue Trend
    result = await db.execute(select(User.created_at, User.premium).where(User.is_admin == False))
    sales = result.all()
    
    monthly_sales = defaultdict(float)
    for date, amount in sales:
        if date and amount:
            key = date.strftime("%Y-%m")
            monthly_sales[key] += amount
            
    sorted_keys = sorted(monthly_sales.keys())
    revenue_trend = [{"month": k, "amount": monthly_sales[k]} for k in sorted_keys]
    
    return {
        "total_revenue": total_revenue,
        "revenue_by_type": revenue_by_type,
        "revenue_trend": revenue_trend
    }

@app.get("/api/analytics/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Total Customers
    result_total = await db.execute(select(User).where(User.is_admin == False))
    total_customers = len(result_total.scalars().all())

    # Active Policies
    result_active = await db.execute(select(User).where(User.is_active == True).where(User.is_admin == False))
    active_policies = len(result_active.scalars().all())

    # Expiring Soon (Next 30 days)
    now = datetime.now()
    next_month = now + timedelta(days=30)
    result_expiring = await db.execute(
        select(User)
        .where(User.policy_expiry >= now)
        .where(User.policy_expiry <= next_month)
        .where(User.is_admin == False)
    )
    expiring_soon = len(result_expiring.scalars().all())

    return {
        "total_customers": total_customers,
        "active_policies": active_policies,
        "expiring_soon": expiring_soon
    }
