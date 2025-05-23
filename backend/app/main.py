from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = "app/db/products.csv"
FIELDNAMES = ['id', 'nome', 'estoque_atual', 'data_entrada', 'data_saida', 'destinatario', 'quantidade_retirada']

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int | None = None
    data_entrada: str | None = None
    data_saida: str | None = None
    destinatario: str | None = None
    quantidade_retirada: int | None = None

@app.get("/products")
def get_products():
    try:
        with open(CSV_PATH, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            products = [dict(row) for row in reader]

            # Converta valores numéricos corretamente
            for p in products:
                p["id"] = int(p["id"])
                p["estoque_atual"] = int(p["estoque_atual"]) if p["estoque_atual"] else None
                p["quantidade_retirada"] = int(p["quantidade_retirada"]) if p["quantidade_retirada"] else None

            return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/products")
def update_products(products: List[Product]):
    try:
        with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
            writer.writeheader()
            for product in products:
                writer.writerow(product.dict())
        return {"message": "Produtos atualizados com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
