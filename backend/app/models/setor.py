from pydantic import BaseModel

class Setor(BaseModel):
    id: int | None = None
    item: str
    total: int
    financeiro: int
    fiscal: int
    ti: int
    comercial: int
    rh: int
    dp: int
    suprimentos: int
    juridico: int
