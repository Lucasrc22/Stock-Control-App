from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id: int
    nome: str
    estoque_atual: Optional[int] = None
