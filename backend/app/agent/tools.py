"""Tools exposed to the LangGraph agent.

Each tool is a plain function decorated with ``@tool``; its docstring is the
description the LLM sees, so keep those docstrings clear and action-oriented.
"""
from __future__ import annotations

import json
import re

from langchain_core.tools import tool

from ..database import SessionLocal
from .. import models
from ..rag.vectorstore import get_retriever

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@tool
def search_portfolio_knowledge(query: str) -> str:
    """Search Youssef Ennagui's portfolio knowledge base for relevant information.

    Covers his biography, technical skills, education and roadmap, certifications,
    availability, and contact details (and his CV if provided). Use this for ANY
    question about Youssef's background, experience, studies, skills, or how to
    reach him. The input should be a natural-language search query.
    """
    docs = get_retriever().invoke(query)
    if not docs:
        return "No relevant information was found in the knowledge base for this query."
    blocks = []
    for doc in docs:
        source = doc.metadata.get("source", "knowledge")
        blocks.append(f"[source: {source}]\n{doc.page_content.strip()}")
    return "\n\n---\n\n".join(blocks)


@tool
def list_portfolio_projects() -> str:
    """List Youssef's portfolio projects from the live database.

    Returns each project's title, description, technologies, demo URL, and
    repository URL. Use this whenever the visitor asks about Youssef's projects,
    portfolio, or the things he has built.
    """
    db = SessionLocal()
    try:
        projects = db.query(models.Project).all()
        if not projects:
            return "There are currently no projects listed in the database."
        rows = []
        for project in projects:
            rows.append(
                json.dumps(
                    {
                        "id": project.id,
                        "title": project.title,
                        "description": project.description,
                        "technologies": project.technologies or [],
                        "demo_url": project.demo_url or "",
                        "repo_url": project.repo_url or "",
                    },
                    ensure_ascii=False,
                )
            )
        return "\n".join(rows)
    finally:
        db.close()


@tool
def save_contact_request(name: str, email: str, message: str, subject: str = "Chatbot contact") -> str:
    """Save a contact request from a visitor who wants Youssef to get in touch.

    Call this ONLY after you have collected the visitor's name, a valid email
    address, and their message. Returns a confirmation string. Do not fabricate
    any of these values — ask the visitor for anything that is missing.
    """
    name = (name or "").strip()
    email = (email or "").strip()
    message = (message or "").strip()
    subject = (subject or "Chatbot contact").strip()

    if not name:
        return "Missing the visitor's name. Ask for it before saving."
    if not _EMAIL_RE.match(email):
        return "The email address looks invalid. Ask the visitor for a valid email."
    if not message:
        return "Missing the message content. Ask the visitor what they would like to say."

    db = SessionLocal()
    try:
        row = models.ContactMessage(
            name=name, email=email, subject=subject, message=message, source="chatbot"
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return (
            f"Contact request saved successfully (id={row.id}). "
            f"Youssef will receive it and can reply to {email}."
        )
    finally:
        db.close()


TOOLS = [search_portfolio_knowledge, list_portfolio_projects, save_contact_request]
