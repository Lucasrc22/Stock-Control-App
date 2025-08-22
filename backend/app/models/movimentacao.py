from datetime import datetime
from pydantic import BaseModel
class Movimentacao(BaseModel):
    id_produto: int
    tipo: str  # 'retirada' ou 'consumo'
    quantidade: int
    andar: str
    timestamp: str  # ISO format string
