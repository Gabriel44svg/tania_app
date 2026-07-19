# backend/app/models/models.py
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base

class Photo(Base):
    __tablename__ = "photos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)