from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import csv
import threading
from routers.products import router as products_router



app = FastAPI()
app.include_router(products_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE = "products.csv"
lock = threading.Lock()  # Para evitar problemas de concorrência na escrita do CSV

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int
    estoque_4andar: int
    estoque_5andar: int

def read_products_from_csv() -> List[Product]:
    products = []
    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            products.append(Product(
                id=int(row["id"]),
                nome=row["nome"],
                estoque_atual=int(row["estoque_atual"]),
                estoque_4andar=int(row["estoque_4andar"]),
                estoque_5andar=int(row["estoque_5andar"]),
            ))
    return products

def write_products_to_csv(products: List[Product]):
    with lock:  # Trava para escrita segura
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id", "nome", "estoque_atual", "estoque_4andar", "estoque_5andar"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for product in products:
                writer.writerow(product.dict())

@app.get("/products", response_model=List[Product])
def get_products():
    return read_products_from_csv()

@app.post("/products", response_model=Product)
def create_product(product: Product):
    products = read_products_from_csv()
    if any(p.id == product.id for p in products):
        raise HTTPException(status_code=400, detail="Produto com este ID já existe")
    products.append(product)
    write_products_to_csv(products)
    return product

@app.post("/products/retirada")
def register_withdrawal(id: int, quantidade: int, andar: str):
    products = read_products_from_csv()
    product = next((p for p in products if p.id == id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if product.estoque_atual < quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")
