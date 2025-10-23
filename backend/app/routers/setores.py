from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List
import csv
import threading
import os

router = APIRouter()

CSV_FILE = "app/data/setor_destinado.csv"
lock = threading.Lock()


# ==============================
# MODELOS
# ==============================
class Setor(BaseModel):
    item: str
    total: int = 0
    financeiro: int = 0
    fiscal: int = 0
    ti: int = 0
    comercial: int = 0
    rh: int = 0
    dp: int = 0
    suprimentos: int = 0
    juridico: int = 0


class SetorResponse(Setor):
    id: int


# ==============================
# FUNÇÕES AUXILIARES
# ==============================
def read_setores_from_csv() -> List[SetorResponse]:
    setores = []
    if not os.path.exists(CSV_FILE):
        return setores

    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader, start=1):
            setores.append(SetorResponse(
                id=i,
                item=row.get("item", ""),
                total=int(row.get("total", 0)),
                financeiro=int(row.get("financeiro", 0)),
                fiscal=int(row.get("fiscal", 0)),
                ti=int(row.get("ti", 0)),
                comercial=int(row.get("comercial", 0)),
                rh=int(row.get("rh", 0)),
                dp=int(row.get("dp", 0)),
                suprimentos=int(row.get("suprimentos", 0)),
                juridico=int(row.get("juridico", 0))
            ))
    return setores


def write_setores_to_csv(setores: List[SetorResponse]):
    with lock:
        os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = [
                "item", "total", "financeiro", "fiscal", "ti", "comercial",
                "rh", "dp", "suprimentos", "juridico"
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for setor in setores:
                writer.writerow({
                    "item": setor.item,
                    "total": setor.total,
                    "financeiro": setor.financeiro,
                    "fiscal": setor.fiscal,
                    "ti": setor.ti,
                    "comercial": setor.comercial,
                    "rh": setor.rh,
                    "dp": setor.dp,
                    "suprimentos": setor.suprimentos,
                    "juridico": setor.juridico
                })


# ==============================
# ROTAS
# ==============================
@router.get("/setores", response_model=List[SetorResponse])
def listar_setores():
    """Lista todos os produtos/setores"""
    return read_setores_from_csv()


@router.post("/setores", response_model=SetorResponse)
def criar_setor(setor: Setor):
    """Adiciona um novo item de controle por setor"""
    setores = read_setores_from_csv()
    new_id = max([p.id for p in setores], default=0) + 1
    new_setor = SetorResponse(id=new_id, **setor.dict())
    setores.append(new_setor)
    write_setores_to_csv(setores)
    return new_setor


@router.put("/setores/{setor_id}")
def atualizar_setor(
    setor_id: int,
    updates: dict = Body(...)
):
    """Atualiza um setor específico"""
    setores = read_setores_from_csv()
    setor = next((s for s in setores if s.id == setor_id), None)
    if not setor:
        raise HTTPException(status_code=404, detail="Setor não encontrado")

    for key, value in updates.items():
        if hasattr(setor, key):
            setattr(setor, key, value)

    # Recalcular total
    setor.total = (
        setor.financeiro
        + setor.fiscal
        + setor.ti
        + setor.comercial
        + setor.rh
        + setor.dp
        + setor.suprimentos
        + setor.juridico
    )

    for i, s in enumerate(setores):
        if s.id == setor_id:
            setores[i] = setor
            break

    write_setores_to_csv(setores)
    return {"message": "Setor atualizado com sucesso", "setor": setor}


@router.delete("/setores/{setor_id}")
def deletar_setor(setor_id: int):
    """Remove um item da lista de setores"""
    setores = read_setores_from_csv()
    updated = [s for s in setores if s.id != setor_id]

    if len(updated) == len(setores):
        raise HTTPException(status_code=404, detail="Setor não encontrado")

    write_setores_to_csv(updated)
    return {"message": "Setor removido com sucesso"}


# ==============================
# ROTA EXTRA (AJUSTE DE QUANTIDADES)
# ==============================
@router.post("/setores/movimentar")
def movimentar_setor(
    setor_id: int = Body(...),
    quantidade: int = Body(...),
    destino: str = Body(..., description="Nome do setor a ajustar (ex: 'financeiro', 'ti')"),
    tipo: str = Body("entrada")  # entrada ou saida
):
    """Movimenta itens entre setores ou faz entrada/saída"""
    setores = read_setores_from_csv()
    setor = next((s for s in setores if s.id == setor_id), None)
    if not setor:
        raise HTTPException(status_code=404, detail="Setor não encontrado")

    if not hasattr(setor, destino):
        raise HTTPException(status_code=400, detail=f"Setor '{destino}' inválido")

    atual = getattr(setor, destino)

    if tipo == "entrada":
        setattr(setor, destino, atual + quantidade)
        setor.total += quantidade
    elif tipo == "saida":
        if atual < quantidade:
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente em {destino}")
        setattr(setor, destino, atual - quantidade)
        setor.total -= quantidade
    else:
        raise HTTPException(status_code=400, detail="Tipo deve ser 'entrada' ou 'saida'")

    for i, s in enumerate(setores):
        if s.id == setor_id:
            setores[i] = setor
            break

    write_setores_to_csv(setores)
    return {"message": "Movimentação realizada com sucesso", "setor": setor}
