from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv

from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "db", "products.csv")



FIELDNAMES = ['id', 'nome', 'estoque_atual', 'data_entrada']

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int | None = None
  
@app.get("/products")
def get_products():
    try:
        with open(CSV_PATH, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            products = []
            for row in reader:
                product = {
                    "id": int(row["id"]),
                    "nome": row["nome"],
                    "estoque_atual": int(row["estoque_atual"]) if row["estoque_atual"] else None,
                }
                products.append(product)
            return products
    except Exception as e:
        print("Erro ao ler CSV:", e)  # <<< Adicione isso
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
