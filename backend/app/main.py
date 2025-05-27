# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .db.database import SessionLocal, ProductDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # URL do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic
class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: int
    estoque_4andar: int
    estoque_5andar: int

    class Config:
        orm_mode = True

# Dependência para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/products", response_model=Product)
async def create_product(product: Product, db: Session = Depends(get_db)):
    db_product = ProductDB(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products", response_model=List[Product])
async def get_products(db: Session = Depends(get_db)):
    return db.query(ProductDB).all()

@app.put("/products", response_model=List[Product])
async def update_products(products: List[Product], db: Session = Depends(get_db)):
    updated_products = []
    for product in products:
        db_product = db.query(ProductDB).filter(ProductDB.id == product.id).first()
        if db_product:
            for key, value in product.dict().items():
                setattr(db_product, key, value)
            db.commit()
            db.refresh(db_product)
            updated_products.append(db_product)
    return updated_products

@app.post("/products/retirada", response_model=Product)
async def registrar_retirada(request: dict, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == request["id"]).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if product.estoque_atual < request["quantidade"]:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")
    
    product.estoque_atual -= request["quantidade"]
    
    if request["andar"] == "4º andar":
        product.estoque_4andar += request["quantidade"]
    elif request["andar"] == "5º andar":
        product.estoque_5andar += request["quantidade"]
    else:
        raise HTTPException(status_code=400, detail="Andar inválido")
    
    db.commit()
    db.refresh(product)
    return product