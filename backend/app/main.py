from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.db.database import SessionLocal, Base, engine
from app.db.models import ProductDB  

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int
    estoque_4andar: int
    estoque_5andar: int

@app.get("/products", response_model=List[Product])
def get_products():
    db = SessionLocal()
    products = db.query(ProductDB).all()
    db.close()
    return products

@app.post("/products", response_model=Product)
def create_product(product: Product):
    db = SessionLocal()
    db_product = ProductDB(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    db.close()
    return db_product

@app.post("/products/retirada")
def register_withdrawal(id: int, quantidade: int, andar: str):
    db = SessionLocal()
    product = db.query(ProductDB).filter(ProductDB.id == id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if product.estoque_atual < quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")
    
    product.estoque_atual -= quantidade
    
    if andar == "4º andar":
        product.estoque_4andar += quantidade
    elif andar == "5º andar":
        product.estoque_5andar += quantidade
    
    db.commit()
    db.refresh(product)
    db.close()
    return {"message": "Retirada registrada com sucesso"}