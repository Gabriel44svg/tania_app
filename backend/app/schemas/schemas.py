# backend/app/schemas/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

# --- Esquemas para Fotos ---
class PhotoCreate(BaseModel):
    description: Optional[str] = None
    # No pedimos image_url aquí porque esa la generará Cloudinary en el backend

class PhotoResponse(BaseModel):
    id: uuid.UUID
    image_url: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- Esquemas para Recordatorios ---
class ReminderCreate(BaseModel):
    title: str
    event_date: datetime

class ReminderResponse(BaseModel):
    id: uuid.UUID
    title: str
    event_date: datetime
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True