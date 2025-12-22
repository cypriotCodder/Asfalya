from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from database import Base

##
# @brief Represents a user in the system.
# @details This class maps to the 'users' table in the database.
#
class User(Base):
    __tablename__ = "users"

    ## Unique identifier for the user.
    id = Column(Integer, primary_key=True, index=True)
    ## User's email address (unique).
    email = Column(String, unique=True, index=True, nullable=True)
    ## User's phone number (unique).
    phone = Column(String, unique=True, index=True, nullable=False)
    ## Hashed password for authentication.
    hashed_password = Column(String, nullable=False)
    ## Status of the user account.
    is_active = Column(Boolean, default=True)
    ## Indicates if the user has administrative privileges.
    is_admin = Column(Boolean, default=False)
    ## Timestamp of when the user was created.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Activation / OTP
    ## Hashed One-Time Password for activation/recovery.
    otp_code = Column(String, nullable=True)
    ## Expiration timestamp for the OTP.
    otp_expiry = Column(DateTime(timezone=True), nullable=True)
    
    # Policy Details
    ## Full name of the user/policy holder.
    full_name = Column(String, nullable=True)
    ## Insurance premium amount.
    premium = Column(Float, default=0.0, nullable=True) # Changed to Float to match DB schema
    ## Type of insurance policy (e.g., Comprehensive).
    policy_type = Column(String, nullable=True)
    ## Unique policy number.
    policy_number = Column(String, nullable=True)
    ## Expiration date of the policy.
    policy_expiry = Column(DateTime, nullable=True)
    ## License plate number associated with the policy.
    vehicle_plate = Column(String, nullable=True)

##
# @brief Represents a mechanic in the system.
# @details This class maps to the 'mechanics' table in the database.
#
class Mechanic(Base):
    __tablename__ = "mechanics"

    ## Unique identifier for the mechanic.
    id = Column(Integer, primary_key=True, index=True)
    ## Name of the mechanic or shop.
    name = Column(String, index=True, nullable=False)
    ## Physical address of the mechanic.
    address = Column(String, nullable=False)
    ## Latitude coordinate for map positioning.
    latitude = Column(String, nullable=False) # Store as string or Float
    ## Longitude coordinate for map positioning.
    longitude = Column(String, nullable=False)
    ## Contact phone number.
    phone = Column(String, nullable=True)
    ## Timestamp of when the mechanic record was created.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
