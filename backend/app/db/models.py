from sqlalchemy import Column, Integer, String
from app.db.database import Base

class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    estoque_atual = Column(Integer)
    estoque_4andar = Column(Integer, default=0)
    estoque_5andar = Column(Integer, default=0)
