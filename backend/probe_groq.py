"""Quick Groq connectivity + tool-calling probe for the portfolio chatbot.

Run from the backend/ folder:

    python probe_groq.py

It checks, in order:
  1. That GROQ_API_KEY is loaded from .env (value masked, never printed in full).
  2. Which chat models your Groq account can actually see (pick a valid ID).
  3. That the configured GROQ_CHAT_MODEL answers a simple prompt.
  4. That the model supports TOOL CALLING -- required by the agent's 3 tools
     (search_portfolio_knowledge, list_portfolio_projects, save_contact_request).

All calls are read-only; nothing here writes to your DB or index.
"""
from __future__ import annotations

import sys

from app.config import get_settings


def _mask(key: str) -> str:
    if not key:
        return "(EMPTY -- key not loaded!)"
    return f"{key[:4]}...{key[-2:]}  (length {len(key)})"


def main() -> int:
    settings = get_settings()
    print("=" * 64)
    print("Groq probe")
    print("=" * 64)
    print(f"GROQ_API_KEY : {_mask(settings.groq_api_key)}")
    print(f"chat_model   : {settings.chat_model!r}")
    print(f"temperature  : {settings.temperature}   max_tokens: {settings.max_tokens}")
    print()

    if not settings.groq_api_key:
        print("X  No Groq key loaded. In backend/.env make sure the line reads")
        print("   GROQ_API_KEY=gsk_...   (with a G, not QROQ_API_KEY).")
        return 1

    # 1) List the models this account can see.
    try:
        from groq import Groq

        client = Groq(api_key=settings.groq_api_key)
        models = sorted(m.id for m in client.models.list().data)
        print(f"Models visible to your account ({len(models)}):")
        for mid in models:
            mark = "   <-- configured (GROQ_CHAT_MODEL)" if mid == settings.chat_model else ""
            print(f"  - {mid}{mark}")
        print()
        if settings.chat_model not in models:
            print(f"!  '{settings.chat_model}' is NOT in the list above.")
            print("   Set GROQ_CHAT_MODEL in .env to one of these exact IDs.")
            print()
    except Exception as e:  # noqa: BLE001
        print(f"!  Could not list models: {type(e).__name__}: {e}")
        print("   (Continuing with the direct chat test below.)")
        print()

    # 2) Plain answer.
    from langchain_groq import ChatGroq

    llm = ChatGroq(
        model=settings.chat_model,
        api_key=settings.groq_api_key,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
    )
    try:
        r = llm.invoke("Reply with exactly: OK")
        print(f"OK  Chat works. Model replied: {r.content!r}")
    except Exception as e:  # noqa: BLE001
        print(f"X   Chat call failed: {type(e).__name__}: {e}")
        return 1

    # 3) Tool-calling -- the agent binds 3 tools, so the model MUST support this.
    from langchain_core.tools import tool

    @tool
    def get_weather(city: str) -> str:
        """Return the current weather for a city."""
        return f"Sunny in {city}."

    try:
        bound = llm.bind_tools([get_weather])
        r = bound.invoke("What's the weather in Fez right now? Use the tool.")
        calls = getattr(r, "tool_calls", []) or []
        if calls:
            print(f"OK  Tool calling works. Model requested: {[c['name'] for c in calls]}")
        else:
            print(f"X   Model did NOT emit a tool call. Content was: {r.content!r}")
            print("    -> This model likely does not support function calling.")
            print("       Pick a tool-capable Groq model in GROQ_CHAT_MODEL and re-run.")
            return 1
    except Exception as e:  # noqa: BLE001
        print(f"X   Tool binding/call failed: {type(e).__name__}: {e}")
        return 1

    print()
    print("All checks passed. Restart uvicorn and the chat should work:")
    print("    uvicorn app.main:app --reload --port 8000")
    return 0


if __name__ == "__main__":
    sys.exit(main())
