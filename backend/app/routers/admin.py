"""Admin (protected) endpoints + public CV download.

All write/upload routes here require a valid ``X-API-Key`` header
(see :func:`app.security.require_api_key`). The CV *download* is public.

- POST /api/admin/upload-image : store a project cover image, return its URL
- POST /api/admin/cv           : replace the CV PDF and re-index the chatbot
- GET  /api/cv                 : download the current CV PDF (public)
"""
from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
)
from fastapi.responses import FileResponse

from ..config import get_settings
from ..security import require_api_key

# Admin routes live under /api/admin and are all key-protected.
admin_router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(require_api_key)],
)

# Public routes (no key) that logically belong with uploads, e.g. CV download.
public_router = APIRouter(tags=["files"])

# --- Limits & allow-lists -------------------------------------------------
MAX_IMAGE_BYTES = 8 * 1024 * 1024   # 8 MB
MAX_PDF_BYTES = 20 * 1024 * 1024    # 20 MB
IMAGE_CONTENT_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
}


def _images_dir() -> Path:
    path = Path(get_settings().upload_dir) / "images"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _cv_path() -> Path:
    """Canonical location of the CV inside the RAG knowledge base."""
    return Path(get_settings().knowledge_dir) / "cv.pdf"


def _absolute_url(request: Request, relative_path: str) -> str:
    """Build a browser-usable absolute URL for a served file."""
    base = get_settings().public_base_url or str(request.base_url).rstrip("/")
    return f"{base}/{relative_path.lstrip('/')}"


@admin_router.get("/verify")
def verify_key() -> dict:
    """Cheap protected ping so the admin UI can validate the key on unlock."""
    return {"ok": True}


@admin_router.post("/upload-image")
async def upload_image(request: Request, file: UploadFile = File(...)) -> dict:
    """Store a project cover image and return its public URL."""
    ext = IMAGE_CONTENT_TYPES.get((file.content_type or "").lower())
    if ext is None:
        # Fall back to the original extension when the browser sends a vague type.
        ext = Path(file.filename or "").suffix.lower()
        if ext not in set(IMAGE_CONTENT_TYPES.values()) | {".jpeg"}:
            raise HTTPException(
                status_code=400,
                detail="Unsupported image type. Use PNG, JPG, WEBP, GIF or SVG.",
            )
        if ext == ".jpeg":
            ext = ".jpg"

    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 8 MB).")

    filename = f"{uuid.uuid4().hex}{ext}"
    (_images_dir() / filename).write_bytes(data)

    return {"url": _absolute_url(request, f"uploads/images/{filename}")}


@admin_router.post("/cv")
async def upload_cv(file: UploadFile = File(...)) -> dict:
    """Replace the CV PDF and rebuild the chatbot's knowledge index."""
    is_pdf = (file.content_type or "").lower() == "application/pdf" or (
        (file.filename or "").lower().endswith(".pdf")
    )
    if not is_pdf:
        raise HTTPException(status_code=400, detail="CV must be a PDF file.")

    data = await file.read()
    if len(data) > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="PDF too large (max 20 MB).")

    cv_path = _cv_path()
    cv_path.parent.mkdir(parents=True, exist_ok=True)
    cv_path.write_bytes(data)

    # Re-index so the assistant answers from the new CV. Import lazily to keep
    # heavy RAG deps out of the import path for non-CV requests.
    reindexed = False
    message = "CV saved."
    try:
        from ..rag.ingest import run_ingest

        result = run_ingest()
        reindexed = True
        message = (
            f"CV saved and chatbot re-indexed "
            f"({result['chunks']} chunks from {result['documents']} document(s))."
        )
    except Exception as exc:  # noqa: BLE001 - surface any reindex failure softly
        message = f"CV saved, but re-indexing failed: {exc}"

    return {"saved": True, "reindexed": reindexed, "message": message}


@public_router.get("/api/cv")
def download_cv() -> FileResponse:
    """Public: download the current CV PDF."""
    cv_path = _cv_path()
    if not cv_path.exists():
        raise HTTPException(status_code=404, detail="No CV has been uploaded yet.")
    return FileResponse(
        path=str(cv_path),
        media_type="application/pdf",
        filename="Youssef-Ennagui-CV.pdf",
    )
