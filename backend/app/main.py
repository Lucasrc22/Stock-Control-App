# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Liberar CORS para qualquer origem (para dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = "app/db/products.csv"
FIELDNAMES = ['id', 'nome', 'estoque_atual', 'data_entrada', 'data_saida', 'destinatario', 'quantidade_retirada']

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: Optional[int] = None
    data_entrada: Optional[str] = None
    data_saida: Optional[str] = None
    destinatario: Optional[str] = None
    quantidade_retirada: Optional[int] = None

@app.put("/products")
def update_products(products: List[Product]):
    try:
        # Abre o CSV em modo escrita e grava o cabeçalho e dados
        with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
            writer.writeheader()
            for product in products:
                writer.writerow(product.dict())
        return {"message": "Produtos atualizados com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar produtos: {e}")
