from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.products import router as products_router
from app.routers.setores import router as setores_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(products_router, prefix="")
app.include_router(setores_router, prefix="") 
