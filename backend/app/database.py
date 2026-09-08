from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Le fichier de base sera créé dans backend/portfolio.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./portfolio.db"

# check_same_thread=False est nécessaire pour SQLite avec FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Chaque requête ouvrira une session via cette "usine"
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base dont hériteront nos modèles
Base = declarative_base()


# Dépendance FastAPI : ouvre une session, la fournit, puis la ferme proprement
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ``Base.metadata.create_all`` crée les tables manquantes mais n'ALTÈRE jamais
# une table existante. Quand on ajoute une colonne à un modèle (ex: category,
# featured, image sur Project), il faut donc l'ajouter à la main sur les bases
# déjà créées. Cette fonction, idempotente, comble ces colonnes manquantes.
_EXPECTED_COLUMNS = {
    "projects": {
        "category": "VARCHAR DEFAULT 'AI/ML'",
        "featured": "BOOLEAN DEFAULT 0",
        "image": "VARCHAR DEFAULT ''",
    },
}


def ensure_schema() -> None:
    """Add any missing columns to existing tables (lightweight migration)."""
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as conn:
        for table, columns in _EXPECTED_COLUMNS.items():
            if table not in existing_tables:
                continue  # create_all will build it fresh with all columns
            present = {col["name"] for col in inspector.get_columns(table)}
            for name, ddl in columns.items():
                if name not in present:
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN {name} {ddl}'))