from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

produtos = [
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 3,
        "nome": "ACUCAR  KG (PETRIBU NÃO)",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 3
    },
    {
        "id": 4,
        "nome": "MEL",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 1
    },
    {
        "id": 5,
        "nome": " LEITE EM PO INSTANTÂNEO  200G",
        "data_retirada": "",
        "quantidade_retirada": 2,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 6,
        "nome": "GUARDANAPO",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 3
    },
    {
        "id": 7,
        "nome": "FILME PVC",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 1
    },
    {
        "id": 8,
        "nome": "CAFE CAPUCCINO 3 corações  CLASSICO 200g ",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 3
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },
    {
        "id": 1,
        "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 20
    },
    {
        "id": 2,
        "nome": "CAFE SOLUVEL MELITA",
        "data_retirada": "",
        "quantidade_retirada": 0,
        "area_destinada": "",
        "responsavel_retirada": "",
        "saldo_estoque": 6
    },


]

@app.get("/produtos")
def listar_produtos():
    return produtos
