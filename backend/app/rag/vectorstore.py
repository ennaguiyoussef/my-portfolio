"""Embeddings and Chroma vector store wiring for the portfolio RAG system.

Both the ingestion script and the retriever tool import from here so that the
exact same embedding model and collection are used on write and on read.
"""
from __future__ import annotations

from functools import lru_cache

from langchain_chroma import Chroma
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

from ..config import get_settings


@lru_cache
def get_embeddings() -> NVIDIAEmbeddings:
    """NVIDIA-hosted embedding model (multilingual, retrieval-optimized).

    ``truncate="END"`` prevents 4xx errors when a chunk exceeds the model's
    maximum input length by truncating instead of failing.
    """
    settings = get_settings()
    return NVIDIAEmbeddings(
        model=settings.embed_model,
        api_key=settings.nvidia_api_key,
        truncate="END",
    )


@lru_cache
def get_vectorstore() -> Chroma:
    """Persistent Chroma collection backed by the NVIDIA embeddings."""
    settings = get_settings()
    return Chroma(
        collection_name=settings.collection_name,
        embedding_function=get_embeddings(),
        persist_directory=settings.chroma_dir,
    )


def get_retriever():
    """A retriever over the portfolio knowledge base."""
    settings = get_settings()
    return get_vectorstore().as_retriever(search_kwargs={"k": settings.retriever_k})
