"""Central configuration for the Portfolio API and the agentic RAG chatbot.

All secrets and tunables are read from environment variables (loaded from
``backend/.env``). Nothing sensitive is hard-coded here.
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

# backend/app/config.py -> parents[1] == backend/
BASE_DIR = Path(__file__).resolve().parents[1]

# Load environment variables from backend/.env (if present).
load_dotenv(BASE_DIR / ".env")


class Settings:
    """Runtime settings, resolved once from the environment."""

    def __init__(self) -> None:
        # --- NVIDIA (chat + embeddings) ---
        self.nvidia_api_key: str = os.getenv("NVIDIA_API_KEY", "").strip()
        self.groq_api_key: str = os.getenv("GROQ_API_KEY" , "").strip()
        # self.chat_model: str = os.getenv("NVIDIA_CHAT_MODEL", "meta/llama-3.3-70b-instruct")
        self.chat_model: str = os.getenv("GROQ_CHAT_MODEL" , "openai/gpt-oss-120b")
        self.embed_model: str = os.getenv("NVIDIA_EMBED_MODEL", "nvidia/llama-3.2-nv-embedqa-1b-v2")

        # --- Generation tunables ---
        self.temperature: float = float(os.getenv("CHAT_TEMPERATURE", "0.2"))
        self.max_tokens: int = int(os.getenv("CHAT_MAX_TOKENS", "1024"))

        # --- Retrieval / vector store ---
        self.chroma_dir: str = os.getenv("CHROMA_DIR", str(BASE_DIR / "chroma_db"))
        self.collection_name: str = os.getenv("CHROMA_COLLECTION", "portfolio")
        self.knowledge_dir: str = os.getenv(
            "KNOWLEDGE_DIR", str(Path(__file__).resolve().parent / "rag" / "knowledge")
        )
        self.retriever_k: int = int(os.getenv("RETRIEVER_K", "5"))

        # --- Conversation ---
        # How many previous messages of history to keep when calling the agent.
        self.history_window: int = int(os.getenv("HISTORY_WINDOW", "10"))

        # --- Admin API key (protects write/upload endpoints) ---
        # Any request to a protected admin route must send this value in the
        # ``X-API-Key`` header. Generate a strong random value and keep it in
        # backend/.env only (never commit it).
        self.admin_api_key: str = os.getenv("ADMIN_API_KEY", "").strip()

        # --- Uploads ---
        # Where uploaded project images are stored and served from.
        self.upload_dir: str = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))
        # Absolute base URL of this API, used to build public image/CV URLs
        # (e.g. "https://api.your-portfolio.com"). Empty => relative URLs.
        self.public_base_url: str = os.getenv("PUBLIC_BASE_URL", "").strip().rstrip("/")

        # --- Contact email notification (Gmail SMTP) ---
        # Fill these in backend/.env to receive an email when a visitor sends a
        # message. Use a Gmail *app password* (not your normal password).
        self.smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
        self.smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user: str = os.getenv("SMTP_USER", "").strip()
        self.smtp_password: str = os.getenv("SMTP_PASSWORD", "").strip()
        # Address the notification is sent to. Defaults to Youssef's email.
        self.contact_notify_to: str = os.getenv(
            "CONTACT_NOTIFY_TO", "youssef.ennagui@usmba.ac.ma"
        ).strip()
        # From address; defaults to the SMTP user when left blank.
        self.smtp_from: str = os.getenv("SMTP_FROM", "").strip() or self.smtp_user

        # --- CORS ---
        # Comma-separated list of allowed frontend origins. In dev the Vite
        # server runs on :5173; in prod add your deployed site's origin here
        # (e.g. CORS_ORIGINS="https://your-portfolio.netlify.app").
        self.cors_origins: list[str] = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "*",
            ).split(",")
            if origin.strip()
        ]

        # Make the key discoverable by the langchain-nvidia SDK, which also
        # auto-reads NVIDIA_API_KEY from the environment.
        if self.groq_api_key:
            os.environ.setdefault("GROQ_API_KEY", self.groq_api_key)

    @property
    def is_configured(self) -> bool:
        """True when the chatbot has everything it needs to answer."""
        return bool(self.groq_api_key)

    @property
    def email_configured(self) -> bool:
        """True when SMTP credentials are present for contact notifications."""
        return bool(self.smtp_user and self.smtp_password and self.contact_notify_to)


@lru_cache
def get_settings() -> Settings:
    return Settings()
