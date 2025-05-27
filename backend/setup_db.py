# backend/setup_db.py
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import init_db

if __name__ == "__main__":
    init_db()
    print("Banco de dados inicializado com sucesso!")