# backend/app/create_db.py
from .db.database import Base, engine

def create_database():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_database()