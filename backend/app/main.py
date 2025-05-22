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
  { "id": 1, "nome": "CAFE EM PO 250GR MELITA EXTRAFORTE", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 2, "nome": "CAFE SOLUVEL MELITA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 3, "nome": "ACUCAR  KG (PETRIBU NÃO)", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 4, "nome": "ADOÇANTE", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 5, "nome": "MEL", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 6, "nome": "LEITE EM PO INSTANTÂNEO 200G", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 7, "nome": "GUARDANAPO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 8, "nome": "FILME PVC", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 9, "nome": "CAFE CAPUCCINO 3 corações CLASSICO 200g", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 10, "nome": "Capuccino 3 corações caramello salgado", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 11, "nome": "CHÁ DE BOLDO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 12, "nome": "CHA DE CAMOMILA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 13, "nome": "CHA DE HORTELA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 14, "nome": "COPOS PEQ. DESCARTÁVEIS", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 15, "nome": "CHA DE ERVA DOCE", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 16, "nome": "FILTRO DE CAFÉ 103", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 17, "nome": "CANELA EM PO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 18, "nome": "AZEITE EXTRA VIRGEM", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 19, "nome": "CAPSULAS DE CAFÉ", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 20, "nome": "SACO LIXO 20LTS PRETO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 21, "nome": "SACO LIXO 100LTS PRETO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 22, "nome": "SACO LIXO 60LTS PRETO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 23, "nome": "PAPEL HIG ELLITE 8X300MTS RESERVA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 24, "nome": "PAPEL TOALHA INTERF FABRICAÇÃO PROPRIA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 25, "nome": "DESINFETANTE DRAGÃO 5LTS", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 26, "nome": "DETERGENTE 5L gold audax 5 lt", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 27, "nome": "ROLO PERFEX 50 UNID", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 28, "nome": "MULTIUSO veja", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 29, "nome": "LUSTRA MÓVEIS BRAVO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 30, "nome": "AGUA SANITARIA 1LT", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 31, "nome": "ESPONJA DUPLA FACE (FINA)", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 32, "nome": "LIMPA VIDROS", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 33, "nome": "AROM. 5LT BAMBO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 34, "nome": "DESODORIZ. SANIT. FIT DESOFLOR", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 35, "nome": "SABÃO LIQUIDO PARA ROUPAS", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 36, "nome": "SABONETE LIQUIDO DOVE 5 lts", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 37, "nome": "GLADE BOM AR CHEIRINHO DE INFANCIA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 38, "nome": "GLADE BOM AR LAVANDA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 39, "nome": "CIF", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 40, "nome": "SOLUÇÃO ÁCIDA", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 41, "nome": "SOLUÇÃO ÁCIDA EM PÓ", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 42, "nome": "PANO DE PRATO BRANCO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 43, "nome": "PANO DE CHÃO", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 44, "nome": "ALCOOL 70%", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 },
  { "id": 45, "nome": "Resmas A4", "data_retirada": "", "quantidade_retirada": 0, "area_destinada": "", "responsavel_retirada": "", "saldo_estoque": 0 }
]


@app.get("/produtos")
def listar_produtos():
    return produtos
