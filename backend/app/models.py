from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, JSON
from .database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, default=list)   # liste de strings, ex: ["Python", "React"]
    demo_url = Column(String, default="")
    repo_url = Column(String, default="")
    # --- Champs miroir de la card front-end ---
    category = Column(String, default="AI/ML")   # ex: "AI/ML", "MLOps", "Full-Stack"
    featured = Column(Boolean, default=False)     # met le projet en avant
    image = Column(String, default="")            # URL de l'image de couverture


class ContactMessage(Base):
    """A contact request left by a website visitor.

    Written either by the /api/contact endpoint or by the chatbot's
    ``save_contact_request`` tool when a visitor asks Youssef to get in touch.
    """

    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, default="Portfolio contact")
    message = Column(Text, nullable=False)
    source = Column(String, default="website")  # "website" | "chatbot"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))