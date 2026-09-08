"""POST /api/chat — the agentic RAG chatbot endpoint.

Request/response shapes match what the existing ChatWidget.jsx frontend sends
and expects:  { message, history: [{role, content}] }  ->  { response }
"""
from __future__ import annotations

import json
import logging
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..config import get_settings
from ..agent.graph import run_agent, stream_agent

logger = logging.getLogger("portfolio.chat")

router = APIRouter(prefix="/api", tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str


# Defined with `def` (not `async def`) on purpose: the agent call is blocking
# (network I/O to NVIDIA), so FastAPI runs it in a threadpool and the event
# loop stays responsive.
@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    _validate_chat_request(request)

    try:
        answer = run_agent(
            request.message.strip(),
            [m.model_dump() for m in request.history],
        )
    except Exception as exc:  # noqa: BLE001 - surface a clean 500 to the client
        logger.exception("Chat agent failed")
        raise HTTPException(status_code=500, detail=f"Chat agent error: {exc}") from exc

    return ChatResponse(response=answer)


def _validate_chat_request(request: ChatRequest) -> None:
    settings = get_settings()
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Chat is not configured on the server (missing NVIDIA_API_KEY).",
        )
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="The message field cannot be empty.")


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest) -> StreamingResponse:
    """Streaming variant of ``/api/chat`` using Server-Sent Events (SSE).

    Emits ``data: {"delta": "..."}`` events as tokens arrive, then a final
    ``data: [DONE]``. On error it emits ``data: {"error": "..."}`` before
    ``[DONE]`` so the frontend can fall back gracefully.
    """
    _validate_chat_request(request)

    message = request.message.strip()
    history = [m.model_dump() for m in request.history]

    async def event_source():
        try:
            async for delta in stream_agent(message, history):
                yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"
        except Exception as exc:  # noqa: BLE001 - report error inside the stream
            logger.exception("Chat stream failed")
            yield f"data: {json.dumps({'error': f'Chat agent error: {exc}'}, ensure_ascii=False)}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            # Disable proxy buffering (e.g. nginx) so tokens flush immediately.
            "X-Accel-Buffering": "no",
        },
    )
