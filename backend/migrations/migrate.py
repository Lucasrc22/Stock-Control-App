import csv
from pathlib import Path
from app.db.database import SessionLocal, ProductDB

def migrate_from_csv():
    db = SessionLocal()
    
    # Caminho corrigido para o CSV
    csv_path = Path(__file__).parent.parent / 'app' / 'db' / 'products.csv'
    
    print(f"Carregando dados de: {csv_path}")  # Confirmação do caminho
    
    with open(csv_path, mode='r', encoding='utf-8') as file:
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
            print(f"Migrando: {row['nome']}")  # Feedback visual
    
    db.commit()
    db.close()
    print("Migração concluída com sucesso!")

if __name__ == "__main__":
    migrate_from_csv()