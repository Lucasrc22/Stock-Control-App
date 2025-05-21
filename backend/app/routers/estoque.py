from fastapi import APIRouter

router = APIRouter(prefix="/estoque", tags=["Estoque"])

@router.get("/ping")
def ping():
    return {"mensagem": "API funcionando"}
