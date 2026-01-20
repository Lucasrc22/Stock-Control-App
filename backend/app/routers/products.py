from fastapi import APIRouter, HTTPException, Path, Body
from pydantic import BaseModel
from typing import List
import csv
import threading
from datetime import datetime
import pytz

from app.services.email_service import enviar_email_alerta

router = APIRouter()

CSV_FILE = "app/data/products.csv"
MOV_CSV_FILE = "app/data/movimentacoes.csv"

lock = threading.Lock()
mov_lock = threading.Lock()

tz = pytz.timezone("America/Sao_Paulo")


# =========================
# MODELS
# =========================

class ProductBase(BaseModel):
    nome: str
    estoque_atual: int = 0
    estoque_4andar: int = 0
    estoque_5andar: int = 0
    limite_alerta_geral: int = 0
    email_alerta_geral: bool = False
    email_alerta_4andar: bool = False
    email_alerta_5andar: bool = False


class ProductResponse(ProductBase):
    id: int


class ConsumoData(BaseModel):
    id: int
    quantidade: int
    andar: str  # "4" ou "5"


class Movimentacao(BaseModel):
    id_produto: int
    tipo: str
    quantidade: int
    andar: str
    timestamp: str


# =========================
# CSV HELPERS
# =========================

def read_products_from_csv() -> List[ProductResponse]:
    products = []
    try:
        with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                products.append(ProductResponse(
                    id=int(row["id"]),
                    nome=row["nome"],
                    estoque_atual=int(row["estoque_atual"]),
                    estoque_4andar=int(row["estoque_4andar"]),
                    estoque_5andar=int(row["estoque_5andar"]),
                    limite_alerta_geral=int(row["limite_alerta_geral"]),
                    email_alerta_geral=row["email_alerta_geral"] == "True",
                    email_alerta_4andar=row["email_alerta_4andar"] == "True",
                    email_alerta_5andar=row["email_alerta_5andar"] == "True",
                ))
    except FileNotFoundError:
        pass
    return products


def write_products_to_csv(products: List[ProductResponse]):
    with lock:
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = [
                "id", "nome",
                "estoque_atual", "estoque_4andar", "estoque_5andar","limite_alerta_geral",
                "email_alerta_geral", "email_alerta_4andar", "email_alerta_5andar"
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for p in products:
                writer.writerow(p.dict())


def read_movimentacoes() -> List[Movimentacao]:
    movs = []
    try:
        with open(MOV_CSV_FILE, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movs.append(Movimentacao(
                    id_produto=int(row["id_produto"]),
                    tipo=row["tipo"],
                    quantidade=int(row["quantidade"]),
                    andar=row["andar"],
                    timestamp=row["timestamp"]
                ))
    except FileNotFoundError:
        pass
    return movs


def write_movimentacoes(movs: List[Movimentacao]):
    with mov_lock:
        with open(MOV_CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id_produto", "tipo", "quantidade", "andar", "timestamp"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for m in movs:
                writer.writerow(m.dict())


# =========================
# ALERTA DE EMAIL
# =========================

def verificar_e_enviar_alerta(produto: ProductResponse):
    destinatarios = ["lucas.ribeiro@grupogalactus.com.br", "danilo.pontes@grupogalactus.com.br"]

    def alerta(condicao, flag, local):
        if condicao and not flag:
            enviar_email_alerta(destinatarios, produto.nome, local)
            return True
        if not condicao:
            return False
        return flag

    produto.email_alerta_geral = alerta(
        produto.estoque_atual == 0,
        produto.email_alerta_geral,
        "Estoque Geral"
    )

    produto.email_alerta_4andar = alerta(
        produto.estoque_4andar == 0,
        produto.email_alerta_4andar,
        "4º Andar"
    )

    produto.email_alerta_5andar = alerta(
        produto.estoque_5andar == 0,
        produto.email_alerta_5andar,
        "5º Andar"
    )


# =========================
# ENDPOINTS
# =========================

@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductBase):
    products = read_products_from_csv()
    new_id = max([p.id for p in products], default=0) + 1
    new_product = ProductResponse(id=new_id, **product.dict())
    products.append(new_product)
    write_products_to_csv(products)
    return new_product


@router.get("/products", response_model=List[ProductResponse])
def list_products():
    return read_products_from_csv()


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int = Path(...), product: ProductBase = Body(...)):
    products = read_products_from_csv()
    
    produto = next((p for p in products if p.id == product_id), None)
    if not produto:
        raise HTTPException(404, "Produto não encontrado")
    
    produto.nome = product.nome
    produto.estoque_atual = product.estoque_atual
    produto.estoque_4andar = product.estoque_4andar
    produto.estoque_5andar = product.estoque_5andar
    produto.limite_alerta_geral = product.limite_alerta_geral
    produto.email_alerta_geral = product.email_alerta_geral
    produto.email_alerta_4andar = product.email_alerta_4andar
    produto.email_alerta_5andar = product.email_alerta_5andar
    
    write_products_to_csv(products)
    return produto


@router.post("/products/entrada")
def adicionar_estoque(id: int = Body(...), quantidade: int = Body(...)):
    products = read_products_from_csv()
    movs = read_movimentacoes()

    produto = next((p for p in products if p.id == id), None)
    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    produto.estoque_atual += quantidade
    verificar_e_enviar_alerta(produto)
    write_products_to_csv(products)

    movs.append(Movimentacao(
        id_produto=id,
        tipo="entrada",
        quantidade=quantidade,
        andar="geral",
        timestamp=datetime.now(tz).isoformat()
    ))
    write_movimentacoes(movs)

    return {"message": "Entrada registrada", "produto": produto}


@router.post("/products/retirada")
def retirada(id: int = Body(...), quantidade: int = Body(...), andar: str = Body(...)):
    products = read_products_from_csv()
    movs = read_movimentacoes()

    produto = next((p for p in products if p.id == id), None)
    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    if produto.estoque_atual < quantidade:
        raise HTTPException(400, "Estoque geral insuficiente")

    if andar == "4":
        produto.estoque_4andar += quantidade
    elif andar == "5":
        produto.estoque_5andar += quantidade
    else:
        raise HTTPException(400, "Andar inválido")

    produto.estoque_atual -= quantidade
    verificar_e_enviar_alerta(produto)
    write_products_to_csv(products)

    movs.append(Movimentacao(
        id_produto=id,
        tipo="retirada",
        quantidade=quantidade,
        andar=andar,
        timestamp=datetime.now(tz).isoformat()
    ))
    write_movimentacoes(movs)

    return {"message": "Retirada realizada", "produto": produto}


@router.post("/products/consumo")
def consumo(data: ConsumoData):
    products = read_products_from_csv()
    movs = read_movimentacoes()

    produto = next((p for p in products if p.id == data.id), None)
    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    if data.andar == "4":
        if produto.estoque_4andar < data.quantidade:
            raise HTTPException(400, "Estoque insuficiente 4º andar")
        produto.estoque_4andar -= data.quantidade
    elif data.andar == "5":
        if produto.estoque_5andar < data.quantidade:
            raise HTTPException(400, "Estoque insuficiente 5º andar")
        produto.estoque_5andar -= data.quantidade
    else:
        raise HTTPException(400, "Andar inválido")

    verificar_e_enviar_alerta(produto)
    write_products_to_csv(products)

    movs.append(Movimentacao(
        id_produto=data.id,
        tipo="consumo",
        quantidade=data.quantidade,
        andar=data.andar,
        timestamp=datetime.now(tz).isoformat()
    ))
    write_movimentacoes(movs)

    return {"message": "Consumo registrado", "produto": produto}


@router.get("/movimentacoes", response_model=List[Movimentacao])
def listar_movimentacoes():
    return read_movimentacoes()


@router.get("/products/{product_id}/movimentacoes", response_model=List[Movimentacao])
def listar_movimentacoes_produto(product_id: int = Path(...)):
    return [m for m in read_movimentacoes() if m.id_produto == product_id]
