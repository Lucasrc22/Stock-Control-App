from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


products = [
    {"id": 1, "name": "Caneta Azul", "quantity": 100, "location": "Estoque A"},
    {"id": 2, "name": "Papel Sulfite", "quantity": 250, "location": "Estoque B"},
    {"id": 3, "name": "Grampeador", "quantity": 50, "location": "Estoque C"},
]

@app.get("/products")
async def get_products():
    return products
