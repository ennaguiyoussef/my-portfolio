"""The agentic RAG agent: a LangGraph ReAct agent backed by NVIDIA-hosted models.

The agent decides on its own when to retrieve from the knowledge base, when to
query the live projects database, and when to record a contact request — this
is what makes it *agentic* RAG rather than a fixed retrieve-then-answer chain.
"""
from __future__ import annotations

from functools import lru_cache

from langchain_core.messages import AIMessage, AIMessageChunk, HumanMessage, SystemMessage
# from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent

from ..config import get_settings
from .prompt import SYSTEM_PROMPT
from .tools import TOOLS


# @lru_cache
# def get_agent():
#     """Build (once) the compiled LangGraph ReAct agent."""
#     settings = get_settings()
#     llm = ChatNVIDIA(
#         model=settings.chat_model,
#         api_key=settings.nvidia_api_key,
#         temperature=settings.temperature,
#         max_tokens=settings.max_tokens,
#     )
#     return create_react_agent(llm, TOOLS)

@lru_cache
def get_agent():
    """Build (once) the compiled LangGraph ReAct agent."""
    settings = get_settings()
    llm = ChatGroq(
        model=settings.chat_model,
        api_key=settings.groq_api_key,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
    )
    return create_react_agent(llm, TOOLS)



def _history_to_messages(history: list[dict] | None) -> list:
    """Convert the frontend's [{role, content}] history to LangChain messages."""
    messages: list = []
    for item in history or []:
        role = (item.get("role") or "").lower()
        content = (item.get("content") or "").strip()
        if not content:
            continue
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))
        # ignore any prior system/error messages
    return messages


def _build_inputs(message: str, history: list[dict] | None) -> dict:
    """Assemble the LangGraph input messages (system + windowed history + user)."""
    settings = get_settings()
    window = settings.history_window
    prior = _history_to_messages(history)
    if window > 0:
        prior = prior[-window:]
    return {
        "messages": [
            SystemMessage(content=SYSTEM_PROMPT),
            *prior,
            HumanMessage(content=message),
        ]
    }


def _chunk_text(content) -> str:
    """Normalize a message chunk's content (str or list of parts) to plain text."""
    if isinstance(content, list):
        return "".join(
            part.get("text", "") if isinstance(part, dict) else str(part) for part in content
        )
    return content or ""


def run_agent(message: str, history: list[dict] | None = None) -> str:
    """Run one agent turn and return the assistant's final text answer."""
    agent = get_agent()
    result = agent.invoke(_build_inputs(message, history))
    final = result["messages"][-1]
    content = _chunk_text(getattr(final, "content", None))
    return content or "Sorry, I couldn't generate a response. Please try rephrasing your question."


async def stream_agent(message: str, history: list[dict] | None = None):
    """Yield the assistant's answer incrementally, token by token.

    Uses LangGraph's ``stream_mode="messages"`` so we receive LLM token chunks
    as they are produced. Chunks emitted while the agent is *planning* a tool
    call carry no visible text (the payload is in ``tool_call_chunks``), so we
    simply skip empty deltas and stream only the final natural-language answer.
    """
    agent = get_agent()
    async for chunk, _metadata in agent.astream(
        _build_inputs(message, history), stream_mode="messages"
    ):
        if isinstance(chunk, AIMessageChunk):
            text = _chunk_text(chunk.content)
            if text:
                yield text
