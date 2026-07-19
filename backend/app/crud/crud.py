# backend/app/crud/crud.py
from sqlalchemy.orm import Session
from app.models.models import Photo, Reminder
from app.schemas.schemas import PhotoCreate, ReminderCreate

# --- CRUD para Fotos ---
def get_photos(db: Session, skip: int = 0, limit: int = 100):
    # Devuelve las fotos ordenadas de la más reciente a la más antigua
    return db.query(Photo).order_by(Photo.created_at.desc()).offset(skip).limit(limit).all()

def create_photo(db: Session, image_url: str, description: str = None):
    db_photo = Photo(image_url=image_url, description=description)
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

# --- CRUD para Recordatorios ---
def get_reminders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Reminder).order_by(Reminder.event_date.asc()).offset(skip).limit(limit).all()

def create_reminder(db: Session, reminder: ReminderCreate):
    db_reminder = Reminder(**reminder.model_dump())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

def delete_photo(db: Session, photo_id: str):
    db_photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if db_photo:
        db.delete(db_photo)
        db.commit()
        return True
    return False

def delete_reminder(db: Session, reminder_id: str):
    # Asegúrate de que el modelo se llame 'Reminder' (o como lo hayas nombrado)
    db_reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if db_reminder:
        db.delete(db_reminder)
        db.commit()
        return True
    return False