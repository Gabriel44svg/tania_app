# backend/app/main.py
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.schemas import schemas
from app.crud import crud
from app.services.cloudinary_service import upload_image

app = FastAPI(title="Tania App API", description="API para galería y recordatorios")

# Configuración de CORS (Vital para que el frontend en React pueda hacer peticiones)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "¡El backend de la aplicación está funcionando!"}

# --- Rutas para Galería de Fotos ---

@app.post("/photos/", response_model=schemas.PhotoResponse)
async def upload_photo(
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Leer los bytes de la imagen enviada
    file_bytes = await file.read()
    
    # 2. Enviar a Cloudinary
    image_url = upload_image(file_bytes)
    if not image_url:
        raise HTTPException(status_code=400, detail="Error al subir la imagen a Cloudinary")
        
    # 3. Guardar la URL y descripción en Supabase
    photo = crud.create_photo(db=db, image_url=image_url, description=description)
    return photo

@app.get("/photos/", response_model=List[schemas.PhotoResponse])
def read_photos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_photos(db, skip=skip, limit=limit)

# --- Rutas para Recordatorios ---

@app.post("/reminders/", response_model=schemas.ReminderResponse)
def create_reminder(reminder: schemas.ReminderCreate, db: Session = Depends(get_db)):
    return crud.create_reminder(db=db, reminder=reminder)

@app.get("/reminders/", response_model=List[schemas.ReminderResponse])
def read_reminders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reminders(db, skip=skip, limit=limit)

@app.delete("/photos/{photo_id}")
def delete_photo(photo_id: str, db: Session = Depends(get_db)):
    success = crud.delete_photo(db, photo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Foto no encontrada")
    return {"message": "Foto eliminada con éxito"}

@app.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: str, db: Session = Depends(get_db)):
    success = crud.delete_reminder(db, reminder_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recordatorio no encontrado")
    return {"message": "Recordatorio eliminado"}