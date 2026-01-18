from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Project X Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-insecure-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/project_x"
    
    # Pilot Mode
    PILOT_MODE: bool = True
    PILOT_INVITE_CODE: str = "ProjectX2025"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
