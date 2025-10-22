from pydantic import BaseModel
from typing import Optional

class Setor(BaseModel):
    item: str
    financeiro: Optional[int] = None
    fiscal: Optional[int] = None
    ti: Optional[int] = None
    comercial: Optional[int] = None
    rh: Optional[int] = None
    dp: Optional[int] = None
    suprimentos: Optional[int] = None
    juridico: Optional[int] = None