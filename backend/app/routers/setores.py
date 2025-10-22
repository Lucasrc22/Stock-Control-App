from fastapi import APIRouter, HTTPException, Path, Body
from pydantic import BaseModel
from typing import List
import csv
import threading



router = APIRouter()

CSV_FILE = "app/data/setor_destinado.csv"
lock = threading.Lock()

class Setor(BaseModel):
    item: str
    financeiro: int = 0
    fiscal: int = 0
    ti: int = 0
    comercial: int = 0
    rh: int = 0
    dp: int = 0
    suprimentos: int = 0
    juridico: int = 0


class ProductResponse(Setor):
    id: int

def read_setor_from_csv() -> List[Setor]:
    setor = []
    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            setor.append(ProductResponse(
                item=str(row["id"]),
                financeiro=row["financeiro"],
                fiscal=int(row["fiscal"]),
                ti=int(row["ti"]),
                comercial=int(row["comercial"]),
                rh=int(row["rh"]),
                dp=int(row["dp"]),
                suprimentos=int(row["suprimentos"]),
                juridico= int(row["juridico"])

            ))
    return setor
