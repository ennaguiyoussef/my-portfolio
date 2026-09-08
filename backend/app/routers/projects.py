from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..security import require_api_key
from .. import models, schemas

router = APIRouter(prefix="/api/projects", tags=["projects"])


# GET /api/projects  -> renvoie tous les projets (public)
@router.get("", response_model=List[schemas.ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.id.desc()).all()


# GET /api/projects/{id} -> un seul projet (public)
@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(models.Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# POST /api/projects -> ajoute un projet (protégé par clé API)
@router.post(
    "",
    response_model=schemas.ProjectOut,
    status_code=201,
    dependencies=[Depends(require_api_key)],
)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    new_project = models.Project(**project.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)   # récupère l'id fraîchement généré
    return new_project


# PUT /api/projects/{id} -> met à jour un projet (protégé)
@router.put(
    "/{project_id}",
    response_model=schemas.ProjectOut,
    dependencies=[Depends(require_api_key)],
)
def update_project(
    project_id: int,
    payload: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = db.get(models.Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # N'applique que les champs réellement fournis (partial update).
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


# DELETE /api/projects/{id} -> supprime un projet (protégé)
@router.delete(
    "/{project_id}",
    status_code=204,
    dependencies=[Depends(require_api_key)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(models.Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None
