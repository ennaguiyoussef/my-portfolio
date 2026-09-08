"""Contact endpoints — store messages left by visitors.

The chatbot's ``save_contact_request`` tool writes to the same table, so all
contact requests (from the form or the assistant) end up in one place.
"""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import get_db
from ..email_utils import send_contact_notification
from .. import models

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactIn(BaseModel):
    name: str
    email: str
    subject: str = "Portfolio contact"
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    source: str

    class Config:
        from_attributes = True


@router.post("", response_model=ContactOut, status_code=201)
def create_contact(
    payload: ContactIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> models.ContactMessage:
    row = models.ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
        source="website",
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    # Notify by email in the background so the visitor's request returns fast
    # and a mail hiccup never fails the submission.
    background_tasks.add_task(
        send_contact_notification,
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
        source="website",
    )
    return row


@router.get("", response_model=List[ContactOut])
def list_contacts(db: Session = Depends(get_db)) -> List[models.ContactMessage]:
    return (
        db.query(models.ContactMessage)
        .order_by(models.ContactMessage.id.desc())
        .all()
    )
