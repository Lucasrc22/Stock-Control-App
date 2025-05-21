from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def listar_pedidos():
    return [{"pedido_id": 1, "produto": "Caneta"}, {"pedido_id": 2, "produto": "Caderno"}]

@router.post("/")
async def criar_pedido(pedido: dict):
   
    return {"msg": "Pedido criado", "pedido": pedido}
