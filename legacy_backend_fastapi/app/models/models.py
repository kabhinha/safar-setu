from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, Text, Enum, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base_class import Base
from pgvector.sqlalchemy import Vector
import enum
from datetime import datetime

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    HOST = "host"
    TRAVELER = "traveler"

class HotspotStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"

class HostVerificationStatus(str, enum.Enum):
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

# Models

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.TRAVELER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    traveler_profile = relationship("TravelerProfile", back_populates="user", uselist=False)
    host_profile = relationship("HostProfile", back_populates="user", uselist=False)
    interactions = relationship("InteractionEvent", back_populates="user")
    reviews = relationship("Review", back_populates="traveler")
    moderation_logs = relationship("ModerationLog", back_populates="moderator")

class TravelerProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True)
    bio = Column(Text, nullable=True)
    preferences = Column(Text, nullable=True) # JSON or text representation

    user = relationship("User", back_populates="traveler_profile")

class HostProfile(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True)
    business_name = Column(String, nullable=True)
    verification_status = Column(Enum(HostVerificationStatus), default=HostVerificationStatus.UNVERIFIED)
    proof_docs_url = Column(String, nullable=True)

    user = relationship("User", back_populates="host_profile")
    hotspots = relationship("Hotspot", back_populates="host")

class Hotspot(Base):
    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("hostprofile.id"))
    name = Column(String, index=True)
    description = Column(Text)
    district = Column(String, index=True) # Location Abstraction
    # Ensure NO GPS coordinates here
    
    status = Column(Enum(HotspotStatus), default=HotspotStatus.PENDING)
    moderation_notes = Column(Text, nullable=True)
    
    # Vector embedding for recommendations (e.g., 384 dim for all-MiniLM-L6-v2)
    embedding = Column(Vector(384), nullable=True) 

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    host = relationship("HostProfile", back_populates="hotspots")
    media = relationship("Media", back_populates="hotspot")
    reviews = relationship("Review", back_populates="hotspot")
    interactions = relationship("InteractionEvent", back_populates="hotspot")

class Media(Base):
    id = Column(Integer, primary_key=True, index=True)
    hotspot_id = Column(Integer, ForeignKey("hotspot.id"))
    url = Column(String, nullable=False)
    media_type = Column(String) # image, video, etc.

    hotspot = relationship("Hotspot", back_populates="media")

class Review(Base):
    id = Column(Integer, primary_key=True, index=True)
    hotspot_id = Column(Integer, ForeignKey("hotspot.id"))
    traveler_id = Column(Integer, ForeignKey("user.id")) # Link to User directly for simplicity or TravelerProfile
    rating = Column(Integer)
    text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    hotspot = relationship("Hotspot", back_populates="reviews")
    traveler = relationship("User", back_populates="reviews")

class InteractionEvent(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    hotspot_id = Column(Integer, ForeignKey("hotspot.id"), nullable=True)
    interaction_type = Column(String) # view, click, save
    dwell_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="interactions")
    hotspot = relationship("Hotspot", back_populates="interactions")

class ModerationLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    moderator_id = Column(Integer, ForeignKey("user.id"))
    target_type = Column(String) # 'hotspot' or 'host'
    target_id = Column(Integer)
    action = Column(String) # 'approve', 'reject', 'request_changes'
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    moderator = relationship("User", back_populates="moderation_logs")
