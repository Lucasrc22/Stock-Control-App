from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import csv
import os

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE_PATH = "./app/db/products.csv"

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int
    estoque_4andar: int
    estoque_5andar: int

products: List[Product] = []


def load_products():
    global products
    if not os.path.exists(CSV_FILE_PATH):
        products = []
        return
    with open(CSV_FILE_PATH, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        products = [Product(
            id=int(row['id']),
            nome=row['nome'],
            estoque_atual=int(row['estoque_atual']),
            estoque_4andar=int(row.get('estoque_4andar', 0)),
            estoque_5andar=int(row.get('estoque_5andar', 0))
        ) for row in reader]


def save_products():
    with open(CSV_FILE_PATH, mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ['id', 'nome', 'estoque_atual', 'estoque_4andar', 'estoque_5andar']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for p in products:
            writer.writerow(p.dict())


@app.get("/products")
def get_products():
    load_products()
    return products


@app.put("/products")
def update_products(updated: List[Product]):
    global products
    products = updated
    save_products()
    return {"message": "Produtos atualizados."}


class RetiradaRequest(BaseModel):
    id: int
    quantidade: int
    andar: str


@app.post("/products/retirada")
def retirada_produto(req: RetiradaRequest):
    load_products()
    for p in products:
        if p.id == req.id:
            if p.estoque_atual < req.quantidade:
                raise HTTPException(status_code=400, detail="Estoque insuficiente.")
            p.estoque_atual -= req.quantidade
            if req.andar == '4':
                p.estoque_4andar += req.quantidade
            elif req.andar == '5':
                p.estoque_5andar += req.quantidade
            else:
                raise HTTPException(status_code=400, detail="Andar inválido.")
            save_products()
            return {"message": f"Retirada registrada no {req.andar}º andar."}
    raise HTTPException(status_code=404, detail="Produto não encontrado.")
