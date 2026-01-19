from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    nome: str
    estoque_atual: Optional[int] = None
    estoque_4andar: Optional[int] = None
    estoque_5andar: Optional[int] = None
    email_alerta_geral: bool = False
    email_alerta_4andar: bool = False
    email_alerta_5andar: bool = False