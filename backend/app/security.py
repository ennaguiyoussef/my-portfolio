"""API-key authentication for the admin (write) endpoints.

Any protected route depends on :func:`require_api_key`, which compares the
``X-API-Key`` request header against ``settings.admin_api_key`` (loaded from
``backend/.env``). Public read endpoints do not use it.
"""
from __future__ import annotations

import secrets

from fastapi import Depends, Header, HTTPException, status

from .config import Settings, get_settings

API_KEY_HEADER = "X-API-Key"


def require_api_key(
    x_api_key: str | None = Header(default=None, alias=API_KEY_HEADER),
    settings: Settings = Depends(get_settings),
) -> None:
    """FastAPI dependency: allow the request only with a valid admin API key."""
    # Fail closed: if no key is configured on the server, admin routes are locked.
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin API is not configured (ADMIN_API_KEY is unset).",
        )

    # Constant-time comparison to avoid leaking the key via timing.
    if not x_api_key or not secrets.compare_digest(x_api_key, settings.admin_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key.",
            headers={"WWW-Authenticate": API_KEY_HEADER},
        )
