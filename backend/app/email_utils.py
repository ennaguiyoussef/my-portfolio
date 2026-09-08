"""Send an email notification when a visitor leaves a contact message.

Uses plain ``smtplib`` + Gmail SMTP with an app password (configured in
``backend/.env``). Designed to *fail soft*: if SMTP is not configured or the
send fails, we log and return ``False`` instead of raising, so the contact
message is still saved and the API still returns success to the visitor.
"""
from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from .config import get_settings

logger = logging.getLogger("portfolio.email")


def send_contact_notification(
    *,
    name: str,
    email: str,
    subject: str,
    message: str,
    source: str = "website",
) -> bool:
    """Email Youssef about a new contact request. Returns True on success."""
    settings = get_settings()

    if not settings.email_configured:
        logger.info("SMTP not configured; skipping contact notification email.")
        return False

    msg = EmailMessage()
    msg["Subject"] = f"[Portfolio] New message from {name}: {subject}"
    msg["From"] = settings.smtp_from
    msg["To"] = settings.contact_notify_to
    # So you can reply straight to the visitor from your inbox.
    if email:
        msg["Reply-To"] = email

    msg.set_content(
        "You received a new message via your portfolio.\n\n"
        f"Name    : {name}\n"
        f"Email   : {email}\n"
        f"Subject : {subject}\n"
        f"Source  : {source}\n"
        "-------------------------------------------\n\n"
        f"{message}\n"
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        logger.info("Contact notification email sent to %s", settings.contact_notify_to)
        return True
    except Exception as exc:  # noqa: BLE001 - never let email break the request
        logger.warning("Failed to send contact notification email: %s", exc)
        return False
