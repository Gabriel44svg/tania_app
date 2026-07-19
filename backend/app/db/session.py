from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Crear el motor de conexión
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True, # Verifica que la conexión esté activa antes de usarla
    pool_size=5,        # Límite de conexiones simultáneas
    max_overflow=10
)

# Creador de sesiones para usar en los endpoints
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para definir los modelos
Base = declarative_base()

# Dependencia para inyectar la sesión en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()