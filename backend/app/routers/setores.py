from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List
import csv
import threading
import os

router = APIRouter()
lock = threading.Lock()

CSV_FILE = "app/data/setor_destinado.csv"

class Setor(BaseModel):
    id: int = 0
    total: int = 0
    item: str
    financeiro: int = 0
    fiscal: int = 0
    ti: int = 0
    comercial: int = 0
    rh: int = 0
    dp: int = 0
    suprimentos: int = 0
    juridico: int = 0

class SetorResponse(Setor):
    pass  # já está igual ao Setor

# ---------- FUNÇÕES AUXILIARES ---------- #
def read_setor_from_csv() -> List[SetorResponse]:
    setores = []
    if not os.path.exists(CSV_FILE):
        return []

    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            setores.append(SetorResponse(
                id=int(row["id"]),
                total=int(row["total"]),
                item=row["item"],
                financeiro=int(row["financeiro"]),
                fiscal=int(row["fiscal"]),
                ti=int(row["ti"]),
                comercial=int(row["comercial"]),
                rh=int(row["rh"]),
                dp=int(row["dp"]),
                suprimentos=int(row["suprimentos"]),
                juridico=int(row["juridico"])
            ))
    return setores

def write_setores_to_csv(setores: List[SetorResponse]):
    with lock:
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id","total","item","financeiro","fiscal","ti",
                          "comercial","rh","dp","suprimentos","juridico"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for s in setores:
                writer.writerow({
                    "id": s.id,
                    "total": s.total,
                    "item": s.item,
                    "financeiro": s.financeiro,
                    "fiscal": s.fiscal,
                    "ti": s.ti,
                    "comercial": s.comercial,
                    "rh": s.rh,
                    "dp": s.dp,
                    "suprimentos": s.suprimentos,
                    "juridico": s.juridico
                })

# ---------- ENDPOINTS ---------- #
@router.get("/setores", response_model=List[SetorResponse])
def listar_setores():
    """Retorna a lista completa de setores e seus quantitativos."""
    return read_setor_from_csv()

@router.post("/setores", response_model=SetorResponse)
def adicionar_setor(novo: Setor):
    """Adiciona um novo item/setor no CSV."""
    setores = read_setor_from_csv()
    new_id = max([s.id for s in setores], default=0) + 1
    novo.id = new_id
    # opcional: calcular total automaticamente
    novo.total = novo.financeiro + novo.fiscal + novo.ti + novo.comercial + novo.rh + novo.dp + novo.suprimentos + novo.juridico
    setores.append(novo)
    write_setores_to_csv(setores)
    return novo

@router.put("/setores/{setor_id}", response_model=SetorResponse)
def atualizar_setor(setor_id: int, dados: Setor):
    """Atualiza as quantidades de um setor existente."""
    setores = read_setor_from_csv()
    for i, s in enumerate(setores):
        if s.id == setor_id:
            # atualiza os dados e recalcula total
            dados.total = dados.financeiro + dados.fiscal + dados.ti + dados.comercial + dados.rh + dados.dp + dados.suprimentos + dados.juridico
            setores[i] = dados
            write_setores_to_csv(setores)
            return dados
    raise HTTPException(status_code=404, detail="Setor não encontrado")
