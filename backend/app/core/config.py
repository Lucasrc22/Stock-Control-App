from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USER: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: str
    EMAIL_TLS: bool = True
    EMAIL_SSL: bool = False

    class Config:
        env_file = BASE_DIR / ".env"

settings = Settings()
