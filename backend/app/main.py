from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.products import router as products_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
    "http://127.0.0.1",
    "http://192.168.0.0/24",   # você pode deixar isso para rede local (se quiser liberar toda a faixa)
    "http://192.168.0.10",     # substitua pelo IP do backend na sua rede local
    # "http://IP_DO_TABLET",   # opcional, se quiser liberar acesso direto do tablet
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
