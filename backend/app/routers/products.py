from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import models, database
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ProductCreate(BaseModel):
    name: str
    quantity: int
    destination: str

class ProductResponse(ProductCreate):
    id: int
    class Config:
        orm_mode = True

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=List[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()
