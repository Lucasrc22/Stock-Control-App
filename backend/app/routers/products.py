from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from typing import List
import csv
import threading

router = APIRouter()

CSV_FILE = "app/data/products.csv"
lock = threading.Lock()

class ProductCreate(BaseModel):
    id : int
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
    new_id = max([p.id for p in products], default=0) + 1
    new_product = ProductResponse(id=new_id, **product.dict())
    products.append(new_product)
    write_products_to_csv(products)
    return new_product

@router.get("/products/", response_model=List[ProductResponse])
def list_products():
    return read_products_from_csv()
@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int = Path(..., gt=0),
    updated_product: ProductCreate = None
):
    products = read_products_from_csv()
    
    index = next((i for i, p in enumerate(products) if p.id == product_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    updated_data = updated_product.dict()
    updated_data["id"] = product_id 
    
    products[index] = ProductResponse(**updated_data)
    
    write_products_to_csv(products)
    return products[index]


@router.post("/products/retirada")
def register_withdrawal(id: int, quantidade: int, andar: str):
    products = read_products_from_csv()
    product = next((p for p in products if p.id == id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if product.estoque_atual < quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")
    
    product.estoque_atual -= quantidade
    
    if andar == "4º andar":
        product.estoque_4andar += quantidade
    elif andar == "5º andar":
        product.estoque_5andar += quantidade
    else:
        raise HTTPException(status_code=400, detail="Andar inválido. Use '4º andar' ou '5º andar'")
    
    write_products_to_csv(products)
    return {"message": "Retirada registrada com sucesso"}
