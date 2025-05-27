import csv
import sys
from pathlib import Path

# Adiciona o diretório pai ao path
sys.path.append(str(Path(__file__).parent.parent))

from app.db.database import SessionLocal, ProductDB  # Import corrigido

def migrate_from_csv():
    db = SessionLocal()
    
    with open('products.csv', mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            product = ProductDB(
                id=int(row['id']),
                nome=row['nome'],
                estoque_atual=int(row['estoque_atual']),
                estoque_4andar=int(row['estoque_4andar']),
                estoque_5andar=int(row['estoque_5andar'])
            )
            db.add(product)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    migrate_from_csv()