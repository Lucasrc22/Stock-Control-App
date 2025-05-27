from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
from typing import List
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "db", "products.csv")

FIELDNAMES = ['id', 'nome', 'estoque_atual', 'estoque_4andar', 'estoque_5andar']

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int | None = None
    estoque_4andar: int | None = None
    estoque_5andar: int | None = None

class Retirada(BaseModel):
    id: int
    quantidade: int
    andar: str  # '4' ou '5'

@app.post("/products/retirada")
def retirar_produto(data: Retirada):
    try:
        produtos = []
        found = False

        with open(CSV_PATH, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                if int(row["id"]) == data.id:
                    estoque_atual = int(row["estoque_atual"] or 0)
                    if estoque_atual < data.quantidade:
                        raise HTTPException(status_code=400, detail="Estoque insuficiente.")
                    row["estoque_atual"] = str(estoque_atual - data.quantidade)

                    if data.andar == "4":
                        row["estoque_4andar"] = str(int(row.get("estoque_4andar", 0)) + data.quantidade)
                    elif data.andar == "5":
                        row["estoque_5andar"] = str(int(row.get("estoque_5andar", 0)) + data.quantidade)
                    else:
                        raise HTTPException(status_code=400, detail="Andar inválido.")
                    
                    found = True
                produtos.append(row)

        if not found:
            raise HTTPException(status_code=404, detail="Produto não encontrado.")

        with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(produtos)

        return {"message": f"Produto ID {data.id} retirado com sucesso para o {data.andar}º andar."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
                    "estoque_atual": int(row["estoque_atual"]) if row["estoque_atual"] else 0,
                    "estoque_4andar": int(row["estoque_4andar"]) if row.get("estoque_4andar") else 0,
                    "estoque_5andar": int(row["estoque_5andar"]) if row.get("estoque_5andar") else 0,
                }
                products.append(product)
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

@app.post("/products")
def add_product(product: Product):
    try:
        with open(CSV_PATH, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                if int(row["id"]) == product.id:
                    raise HTTPException(status_code=400, detail="Produto com este ID já existe.")

        with open(CSV_PATH, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
            writer.writerow(product.dict())
        return {"message": "Produto adicionado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
