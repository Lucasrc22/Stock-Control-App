from fastapi import APIRouter

router = APIRouter(prefix="/estoque", tags=["Estoque"])

@router.get("/estoque")
def listar_itens():
    return {"mensagem": "Lista de itens de estoque"}
