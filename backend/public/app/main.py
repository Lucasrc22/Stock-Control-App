from fastapi import FastAPI
from app.routers import pedidos  
app = FastAPI()

app.include_router(pedidos.router, prefix="/pedidos", tags=["Pedidos"])

@app.get("/")
async def root():
    return {"message": "API funcionando"}
