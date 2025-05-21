from fastapi import FastAPI
from app.routers import estoque

app = FastAPI(title="Controle de Estoque")

app.include_router(estoque.router)
