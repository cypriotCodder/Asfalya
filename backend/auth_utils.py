from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os

## 
# @brief Secret key for signing JWT tokens.
# @details Loaded from environment variables.
#
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

##
# @brief Algorithm used for JWT encoding.
#
ALGORITHM = "HS256"

##
# @brief Access token expiration time in minutes.
#
ACCESS_TOKEN_EXPIRE_MINUTES = 60

##
# @brief Configuration for password hashing using bcrypt.
#
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

##
# @brief Verifies a plain password against a hashed password.
#
# @param plain_password The plain text password to verify.
# @param hashed_password The hashed password to compare against.
# @return True if the password matches, False otherwise.
#
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

##
# @brief Hashes a plain password using bcrypt.
#
# @param password The plain text password to hash.
# @return The hashed password string.
#
def get_password_hash(password):
    return pwd_context.hash(password)

##
# @brief Creates a JSON Web Token (JWT).
#
# @param data A dictionary containing the payload data (e.g., subject).
# @param expires_delta Optional time delta for token expiration.
# @return The encoded JWT string.
#
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

import random
import string

##
# @brief Generates a numeric One-Time Password (OTP).
#
# @param length The length of the OTP to generate (default is 6).
# @return A string containing key digits.
#
def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))