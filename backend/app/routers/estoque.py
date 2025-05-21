from fastapi import APIRouter

router = APIRouter()

@router.get("/teste")
def testar():
    return {"mensagem": "API funcionando"}
