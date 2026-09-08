"""Build (or rebuild) the Chroma vector index for the portfolio knowledge base.

It ingests every ``.md`` / ``.txt`` file in ``app/rag/knowledge/`` plus any
``.pdf`` you drop there (e.g. your CV), chunks them, embeds them with the
configured NVIDIA embedding model, and persists them to ``backend/chroma_db/``.

Run it from the ``backend/`` directory:

    python -m app.rag.ingest

Re-run it whenever you edit the knowledge files or add your CV PDF.
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..config import get_settings
from .vectorstore import get_embeddings


def _read_pdf(path: Path) -> str:
    """Extract text from a PDF, page by page. Requires pypdf."""
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def load_documents(knowledge_dir: Path) -> list[Document]:
    """Load all supported files from the knowledge directory."""
    documents: list[Document] = []
    for path in sorted(knowledge_dir.rglob("*")):
        if path.is_dir():
            continue
        suffix = path.suffix.lower()
        try:
            if suffix in {".md", ".txt"}:
                text = path.read_text(encoding="utf-8")
                doc_type = "note"
            elif suffix == ".pdf":
                text = _read_pdf(path)
                doc_type = "cv_pdf"
            else:
                continue
        except Exception as exc:  # pragma: no cover - defensive
            print(f"  ! Skipping {path.name}: {exc}")
            continue

        if text and text.strip():
            documents.append(
                Document(page_content=text, metadata={"source": path.name, "type": doc_type})
            )
            print(f"  + Loaded {path.name} ({len(text)} chars)")
    return documents


def run_ingest() -> dict[str, int]:
    """Rebuild the Chroma index from the knowledge directory.

    Callable programmatically (e.g. after a CV upload). Raises ``RuntimeError``
    with a clear message on any problem; returns ``{"documents": n, "chunks": m}``
    on success.
    """
    settings = get_settings()

    if not settings.nvidia_api_key:
        raise RuntimeError("NVIDIA_API_KEY is not set. Add it to backend/.env before ingesting.")

    knowledge_dir = Path(settings.knowledge_dir)
    if not knowledge_dir.exists():
        raise RuntimeError(f"knowledge directory not found: {knowledge_dir}")

    documents = load_documents(knowledge_dir)
    if not documents:
        raise RuntimeError("no documents found to ingest.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120,
        separators=["\n## ", "\n### ", "\n\n", "\n", " ", ""],
    )
    chunks = splitter.split_documents(documents)

    # Rebuild the collection from scratch so stale content never lingers.
    chroma_path = Path(settings.chroma_dir)
    if chroma_path.exists():
        shutil.rmtree(chroma_path)

    Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        collection_name=settings.collection_name,
        persist_directory=settings.chroma_dir,
    )

    return {"documents": len(documents), "chunks": len(chunks)}


def main() -> None:
    settings = get_settings()
    print(f"Loading documents from {settings.knowledge_dir} ...")
    try:
        result = run_ingest()
    except RuntimeError as exc:
        print(f"ERROR: {exc}")
        sys.exit(1)

    print(
        f"Done. Ingested {result['chunks']} chunks from {result['documents']} document(s) "
        f"into collection '{settings.collection_name}' at {settings.chroma_dir}."
    )


if __name__ == "__main__":
    main()
