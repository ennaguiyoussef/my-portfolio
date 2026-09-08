from pydantic import BaseModel
from typing import List, Optional


# Champs communs (entrée et sortie) — miroir de la card front-end
class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: List[str] = []
    demo_url: str = ""
    repo_url: str = ""
    category: str = "AI/ML"
    featured: bool = False
    image: str = ""


# Ce qu'on envoie pour CRÉER un projet (POST)
class ProjectCreate(ProjectBase):
    pass


# Ce qu'on envoie pour METTRE À JOUR un projet (PUT) — tous les champs optionnels
class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    category: Optional[str] = None
    featured: Optional[bool] = None
    image: Optional[str] = None


# Ce que l'API RENVOIE (inclut l'id généré par la base)
class ProjectOut(ProjectBase):
    id: int

    class Config:
        from_attributes = True   # permet de lire directement depuis un objet SQLAlchemy
