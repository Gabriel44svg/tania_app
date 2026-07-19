# backend/app/services/cloudinary_service.py
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configurar Cloudinary con las variables de tu .env
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_image(file_bytes: bytes, folder_name: str = "tania_app") -> str:
    """
    Sube una imagen a Cloudinary y devuelve la URL segura.
    """
    try:
        response = cloudinary.uploader.upload(
            file_bytes, 
            folder=folder_name,
            resource_type="image"
        )
        return response.get("secure_url")
    except Exception as e:
        print(f"Error subiendo a Cloudinary: {e}")
        return None