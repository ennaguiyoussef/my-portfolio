import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from .database import Base, engine, ensure_schema
from . import models  # noqa: F401 (nécessaire pour enregistrer la table)
from .config import get_settings
from .routers import projects, chat, contact
from .routers.admin import admin_router, public_router

settings = get_settings()

# Crée les tables manquantes, puis ajoute les colonnes ajoutées après coup
# (create_all n'altère jamais une table déjà existante).
Base.metadata.create_all(bind=engine)
ensure_schema()

# Dossier des images uploadées (servi statiquement sur /uploads).
os.makedirs(settings.upload_dir, exist_ok=True)


app = FastAPI(
    title = "Portfolio API",
    version='0.2.0'
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

# Sert les images uploadées: /uploads/images/<file>
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Portfolio API is running"
    }

# Branche les endpoints /api/projects
app.include_router(projects.router)
# Branche le chatbot agentic RAG (/api/chat) et le contact (/api/contact)
app.include_router(chat.router)
app.include_router(contact.router)
# Branche l'admin protégé (/api/admin/*) et le téléchargement public du CV (/api/cv)
app.include_router(admin_router)
app.include_router(public_router)
