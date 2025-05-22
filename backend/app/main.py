from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv
from pathlib import Path

app = FastAPI()

# Habilitar CORS para permitir acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Porta do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = Path(__file__).parent / "db" / "produtos.csv"

@app.get("/products")
def get_products():
    products = []
    with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convertendo estoque_atual e quantidade_retirada para inteiro se possível
            row["estoque_atual"] = int(row["estoque_atual"]) if row["estoque_atual"] else 0
            row["quantidade_retirada"] = int(row["quantidade_retirada"]) if row["quantidade_retirada"] else 0
            products.append(row)
    return products
