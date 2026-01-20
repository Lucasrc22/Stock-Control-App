from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import csv
import threading
import os
from datetime import datetime

router = APIRouter()

lock = threading.Lock()

CSV_SETOR = "app/data/setor_destinado.csv"
CSV_HISTORICO = "app/data/historico_setores.csv"

# =========================
# MODELOS
# =========================

class Historico(BaseModel):
    id_produto: int
    tipo: str              # "entrada" | "saida"
    quantidade: int
    setor: str
    timestamp: str


class SetorBase(BaseModel):
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


class SetorResponse(SetorBase):
    id: int


# =========================
# CSV HELPERS — SETORES
# =========================

def read_setor_from_csv() -> List[SetorResponse]:
    if not os.path.exists(CSV_SETOR):
        return []

    setores = []
    with open(CSV_SETOR, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            setores.append(SetorResponse(
                id=int(row["id"]),
                item=row["item"],
                total=int(row["total"]),
                financeiro=int(row["financeiro"]),
                fiscal=int(row["fiscal"]),
                ti=int(row["ti"]),
                comercial=int(row["comercial"]),
                rh=int(row["rh"]),
                dp=int(row["dp"]),
                suprimentos=int(row["suprimentos"]),
                juridico=int(row["juridico"]),
            ))
    return setores


def write_setores_to_csv(setores: List[SetorResponse]):
    with lock:
        with open(CSV_SETOR, "w", newline="", encoding="latin-1") as csvfile:
            fieldnames = [
                "id", "item", "total", "financeiro", "fiscal", "ti",
                "comercial", "rh", "dp", "suprimentos", "juridico"
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for setor in setores:
                writer.writerow(setor.model_dump())


# =========================
# CSV HELPERS — HISTÓRICO
# =========================

def registrar_historico(
    id_produto: int,
    tipo: str,
    quantidade: int,
    setor: str
):
    os.makedirs(os.path.dirname(CSV_HISTORICO), exist_ok=True)

    with lock:
        file_exists = os.path.exists(CSV_HISTORICO)

        with open(CSV_HISTORICO, "a", newline="", encoding="latin-1") as csvfile:
            fieldnames = ["id_produto", "tipo", "quantidade", "setor", "timestamp"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            if not file_exists:
                writer.writeheader()

            writer.writerow({
                "id_produto": id_produto,
                "tipo": tipo,
                "quantidade": quantidade,
                "setor": setor,
                "timestamp": datetime.now().isoformat()
            })


def read_historico() -> List[Historico]:
    if not os.path.exists(CSV_HISTORICO):
        return []

    historico = []
    with open(CSV_HISTORICO, newline="", encoding="latin-1") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            historico.append(Historico(**row))
    return historico


# =========================
# ENDPOINTS — SETORES
# =========================

@router.get("/setores", response_model=List[SetorResponse])
def listar_setores():
    return read_setor_from_csv()


@router.post("/setores", response_model=SetorResponse)
def criar_setor(novo: SetorBase):
    setores = read_setor_from_csv()
    novo_id = max([s.id for s in setores], default=0) + 1

    setor_com_id = SetorResponse(
        id=novo_id,
        **novo.model_dump()
    )

    setores.append(setor_com_id)
    write_setores_to_csv(setores)

    return setor_com_id


@router.put("/setores/{setor_id}", response_model=SetorResponse)
def atualizar_setor(setor_id: int, dados: SetorBase):
    setores = read_setor_from_csv()

    for i, setor in enumerate(setores):
        if setor.id == setor_id:

            # === HISTÓRICO POR CAMPO ===
            for campo in [
                "financeiro", "fiscal", "ti", "comercial",
                "rh", "dp", "suprimentos", "juridico"
            ]:
                diferenca = getattr(dados, campo) - getattr(setor, campo)

                if diferenca != 0:
                    registrar_historico(
                        id_produto=setor_id,
                        tipo="entrada" if diferenca > 0 else "saida",
                        quantidade=abs(diferenca),
                        setor=campo
                    )

            atualizado = SetorResponse(
                id=setor_id,
                **dados.model_dump()
            )

            setores[i] = atualizado
            write_setores_to_csv(setores)
            return atualizado

    raise HTTPException(status_code=404, detail="Setor não encontrado")


# =========================
# ENDPOINT — HISTÓRICO
# =========================

@router.get("/setores/historico", response_model=List[Historico])
def listar_historico():
    return read_historico()
