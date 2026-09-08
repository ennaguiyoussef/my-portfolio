"""Send a Telegram notification when a visitor leaves a contact message.

Uses Telegram Bot API (HTTP requests over port 443) which works seamlessly on 
cloud providers like Railway without getting blocked.
Designed to fail soft: if Telegram is not configured or the send fails, 
we log and return False instead of raising.
"""
from __future__ import annotations

import logging
import os
import httpx

logger = logging.getLogger("portfolio.notifications")


def send_contact_notification(
    *,
    name: str,
    email: str,
    subject: str,
    message: str,
    source: str = "website",
) -> bool:
    """Send Telegram alert about a new contact request. Returns True on success."""
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()

    if not bot_token or not chat_id:
        logger.info("Telegram Bot not configured; skipping notification.")
        return False

    text = (
        "📩 *New Portfolio Message*\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        f"👤 *Name:* {name}\n"
        f"📧 *Email:* `{email}`\n"
        f"📌 *Subject:* {subject}\n"
        f"🌐 *Source:* {source}\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        f"💬 *Message:*\n{message}"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
    }

    try:
        response = httpx.post(url, json=payload, timeout=10.0)
        if response.status_code == 200:
            logger.info("Telegram notification sent successfully to chat %s", chat_id)
            return True
        else:
            logger.warning(
                "Failed to send Telegram notification: HTTP %s - %s",
                response.status_code,
                response.text,
            )
            return False
    except Exception as exc:  # noqa: BLE001 - never let notification break the request
        logger.warning("Failed to send Telegram notification: %s", exc)
        return False
