from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajuste para seu domínio em produção
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

@app.get("/products", response_model=List[Product])
def get_products():
    try:
        products = []
        with open(CSV_PATH, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convertendo campos numéricos e opcionais
                products.append(Product(
                    id=int(row['id']),
                    nome=row['nome'],
                    estoque_atual=int(row['estoque_atual']) if row['estoque_atual'] else None,
                    data_entrada=row['data_entrada'] or None,
                    data_saida=row['data_saida'] or None,
                    destinatario=row['destinatario'] or None,
                    quantidade_retirada=int(row['quantidade_retirada']) if row['quantidade_retirada'] else None,
                ))
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
