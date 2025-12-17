from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Policy Details
    full_name = Column(String, nullable=True)
    premium = Column(Float, default=0.0, nullable=True) # Changed to Float to match DB schema
    policy_type = Column(String, nullable=True)
    policy_number = Column(String, nullable=True)
    policy_expiry = Column(DateTime, nullable=True)
    vehicle_plate = Column(String, nullable=True)

class Mechanic(Base):
    __tablename__ = "mechanics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(String, nullable=False) # Store as string or Float
    longitude = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
