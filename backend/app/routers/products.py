from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import csv
import threading

router = APIRouter()

CSV_FILE = "products.csv"
lock = threading.Lock()

class ProductCreate(BaseModel):
    nome: str
    estoque_atual: int
    estoque_4andar: int = 0
    estoque_5andar: int = 0

class ProductResponse(ProductCreate):
    id: int

def read_products_from_csv() -> List[ProductResponse]:
    products = []
    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            products.append(ProductResponse(
                id=int(row["id"]),
                nome=row["nome"],
                estoque_atual=int(row["estoque_atual"]),
                estoque_4andar=int(row["estoque_4andar"]),
                estoque_5andar=int(row["estoque_5andar"]),
            ))
    return products

def write_products_to_csv(products: List[ProductResponse]):
    with lock:
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id", "nome", "estoque_atual", "estoque_4andar", "estoque_5andar"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for product in products:
                writer.writerow(product.dict())

@router.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate):
    products = read_products_from_csv()
    # gera novo ID incremental
    new_id = max([p.id for p in products], default=0) + 1
    new_product = ProductResponse(id=new_id, **product.dict())
    products.append(new_product)
    write_products_to_csv(products)
    return new_product

@router.get("/products/", response_model=List[ProductResponse])
def list_products():
    return read_products_from_csv()
