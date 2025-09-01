from fastapi import APIRouter, HTTPException, Path, Body
from pydantic import BaseModel
from typing import List
import csv
import threading
from datetime import datetime
import pytz


router = APIRouter()

CSV_FILE = "app/data/products.csv"
lock = threading.Lock()

class ProductCreate(BaseModel):
    nome: str
    estoque_atual: int
    estoque_4andar: int = 0
    estoque_5andar: int = 0
class ConsumoData(BaseModel):
    id: int
    quantidade: int
    andar: str 

brasilia_tz = pytz.timezone('America/Sao_Paulo')
now_brasilia = datetime.now(brasilia_tz).isoformat()

class Movimentacao(BaseModel):
    id_produto: int
    tipo: str  # 'retirada' ou 'consumo'
    quantidade: int
    andar: str
    timestamp: str  # ISO format string

@router.post("/movimentacoes/adicionar_estoque")
def adicionar_estoque(
    produto_id: int = Body(...),
    quantidade: int = Body(...),
    tipo: str = Body("entrada")  # Para consistência no histórico
):
    if quantidade <= 0:
        raise HTTPException(status_code=400, detail="Quantidade inválida")

    produtos = read_products_from_csv()
    movimentacoes = read_movimentacoes()
    produto = next((p for p in produtos if p.id == produto_id), None)

    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    produto.estoque_atual += quantidade

    for i, p in enumerate(produtos):
        if p.id == produto_id:
            produtos[i] = produto
            break

    write_products_to_csv(produtos)

    mov = Movimentacao(
        id_produto=produto.id,
        tipo=tipo,
        quantidade=quantidade,
        andar="-",  # Não é ligado a um andar específico
        timestamp=datetime.now(pytz.timezone("America/Sao_Paulo")).isoformat()
    )
    movimentacoes.append(mov)
    write_movimentacoes(movimentacoes)

    return {"message": "Quantidade adicionada ao estoque", "produto": produto}

@router.post("/products/consumo")
def consumir_produto(data: ConsumoData):
    produtos = read_products_from_csv()
    movimentacoes = read_movimentacoes()
    for produto in produtos:
        if produto.id == data.id:
            if data.andar == "4":
                if produto.estoque_4andar >= data.quantidade:
                    produto.estoque_4andar -= data.quantidade
                else:
                    raise HTTPException(status_code=400, detail="Estoque insuficiente no 4º andar")
            elif data.andar == "5":
                if produto.estoque_5andar >= data.quantidade:
                    produto.estoque_5andar -= data.quantidade
                else:
                    raise HTTPException(status_code=400, detail="Estoque insuficiente no 5º andar")
            else:
                raise HTTPException(status_code=400, detail="Andar inválido")
            
            write_products_to_csv(produtos)
            mov = Movimentacao(
                id_produto=produto.id,
                tipo="consumo",
                quantidade=data.quantidade,
                andar=data.andar,
                timestamp=datetime.now(pytz.timezone('America/Sao_Paulo')).isoformat()
            )
            movimentacoes.append(mov)
            write_movimentacoes(movimentacoes)
            return {"message": "Consumo registrado com sucesso", "produto": produto}

    raise HTTPException(status_code=404, detail="Produto não encontrado")



class ProductResponse(ProductCreate):
    id: int

def read_products_from_csv() -> List[ProductResponse]:
    products = []
    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            products.append(ProductResponse(
                id=int(row["id"]),
                nome=row["nome"],
                estoque_atual=int(row["estoque_atual"]),
                estoque_4andar=int(row["estoque_4andar"]),
                estoque_5andar=int(row["estoque_5andar"]),
            ))
    return products

def write_products_to_csv(products: List[ProductResponse]):
    with lock:
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id", "nome", "estoque_atual", "estoque_4andar", "estoque_5andar"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for product in products:
                writer.writerow(product.dict())

@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate):
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
def update_product(
    product_id: int = Path(..., gt=0),
    updated_product: ProductCreate = Body(...)
):
    products = read_products_from_csv()
    index = next((i for i, p in enumerate(products) if p.id == product_id), -1)
    if index == -1:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    atual_produto = products[index]
    updated_data = updated_product.dict()

    novo_estoque = updated_data.get("estoque_atual", 0)

    # Verifica se o estoque_atual foi reduzido (não permitido)
    if novo_estoque < atual_produto.estoque_atual:
        raise HTTPException(
            status_code=400,
            detail="Não é permitido diminuir o estoque atual via atualização direta. Use retirada ou consumo."
        )

    # Atualiza o produto
    updated_data["id"] = product_id
    products[index] = ProductResponse(**updated_data)
    write_products_to_csv(products)

    # Se houve aumento no estoque_atual, registra a movimentação
    if novo_estoque > atual_produto.estoque_atual:
        movimentacoes = read_movimentacoes()
        mov = Movimentacao(
            id_produto=product_id,
            tipo="adicao_estoque_atual",
            quantidade=novo_estoque - atual_produto.estoque_atual,
            andar="geral",
            timestamp=datetime.now(pytz.timezone('America/Sao_Paulo')).isoformat()
        )
        movimentacoes.append(mov)
        write_movimentacoes(movimentacoes)

    return products[index]
@router.get("/movimentacoes", response_model=List[Movimentacao])
def list_all_movimentacoes():
    """
    Retorna todas as movimentações de todos os produtos.
    """
    return read_movimentacoes()


@router.post("/products/retirada")
def register_withdrawal(
    id: int = Body(...),
    quantidade: int = Body(...),
    andar: str = Body(...)
):
    products = read_products_from_csv()
    movimentacoes = read_movimentacoes()
    product = next((p for p in products if p.id == id), None)

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if quantidade <= 0:
        raise HTTPException(status_code=400, detail="Quantidade inválida")

    if product.estoque_atual < quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")

    if andar in ("4º andar", "4"):
        product.estoque_4andar += quantidade
    elif andar in ("5º andar", "5"):
        product.estoque_5andar += quantidade
    else:
        raise HTTPException(status_code=400, detail="Andar inválido. Use '4' ou '5'.")
    

    product.estoque_atual -= quantidade

    for i, p in enumerate(products):
        if p.id == id:
            products[i] = product
            break

    write_products_to_csv(products)

    mov = Movimentacao(
        id_produto=product.id,
        tipo="Andar Destinado",
        quantidade=quantidade,
        andar=andar,
        timestamp=datetime.now(pytz.timezone('America/Sao_Paulo')).isoformat()
    )
    movimentacoes.append(mov)
    write_movimentacoes(movimentacoes)

    return {
    "message": "Retirada registrada com sucesso",
    "produto": product
    }

MOV_CSV_FILE = "app/data/movimentacoes.csv"
mov_lock = threading.Lock()

def read_movimentacoes() -> List[Movimentacao]:
    movimentacoes = []
    try:
        with open(MOV_CSV_FILE, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movimentacoes.append(Movimentacao(
                    id_produto=int(row["id_produto"]),
                    tipo=row["tipo"],
                    quantidade=int(row["quantidade"]),
                    andar=row["andar"],
                    timestamp=row["timestamp"]
                ))
    except FileNotFoundError:
        # Arquivo pode não existir na primeira vez
        pass
    return movimentacoes

def write_movimentacoes(movimentacoes: List[Movimentacao]):
    with mov_lock:
        with open(MOV_CSV_FILE, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["id_produto", "tipo", "quantidade", "andar", "timestamp"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for mov in movimentacoes:
                writer.writerow(mov.dict())

@router.get("/products/{product_id}/movimentacoes", response_model=List[Movimentacao])
def list_movimentacoes(product_id: int = Path(..., gt=0)):
    movimentacoes = read_movimentacoes()
    return [m for m in movimentacoes if m.id_produto == product_id]

