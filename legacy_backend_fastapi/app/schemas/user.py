from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.models import UserRole

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    role: UserRole = UserRole.TRAVELER

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    invite_code: Optional[str] = None # Required for Pilot

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None
