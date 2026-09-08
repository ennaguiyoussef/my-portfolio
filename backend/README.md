# Portfolio API — Agentic RAG Chatbot

The `/api/chat` endpoint is an **agentic RAG** assistant for Youssef Ennagui's
portfolio, built with **LangGraph** (ReAct agent) using **Groq** for chat and
**NVIDIA** for embeddings, over a **ChromaDB** vector store.

It is *agentic* RAG because the LLM decides on its own when to retrieve from the
knowledge base, when to query the live projects database, and when to record a
contact request — rather than always running a fixed retrieve-then-answer chain.

## Architecture

```
frontend/ChatWidget.jsx  ──POST /api/chat {message, history}──►  FastAPI
                                                                    │
                                                          app/routers/chat.py
                                                                    │
                                                          app/agent/graph.py  (LangGraph ReAct agent, ChatGroq)
                                                              │        │        │
                                    search_portfolio_knowledge  list_portfolio_projects  save_contact_request
                                                │                    │                    │
                                     Chroma + NVIDIA embeddings   SQLite (projects)   SQLite (contact_messages)
                                                │
                                     app/rag/knowledge/*.md  (+ your CV PDF)
```

Key files:

- `app/config.py` — settings from environment (`.env`).
- `app/rag/knowledge/*.md` — the knowledge base (bio, skills, education, certs, contact, FAQ).
- `app/rag/ingest.py` — chunks + embeds the knowledge base into Chroma.
- `app/rag/vectorstore.py` — embeddings + Chroma wiring (shared by ingest and retrieval).
- `app/agent/tools.py` — the three agent tools.
- `app/agent/graph.py` — the LangGraph agent + `run_agent()`.
- `app/routers/chat.py` — the `/api/chat` endpoint (matches the frontend contract).
- `app/routers/contact.py` — `/api/contact` (visitors' messages; same table the bot writes to).

## Setup (Windows / PowerShell)

From the `backend/` folder:

```powershell
# 1. Activate the virtual environment
.\.venv\Scripts\activate

# 2. Install dependencies (first run downloads the LangChain/Chroma stack).
#    requirements.txt already pins everything, including the ingestion
#    helpers (langchain-text-splitters, pypdf) used by `python -m app.rag.ingest`.
pip install -r requirements.txt

# 3. Keys already live in backend/.env: GROQ_API_KEY (chat) and
#    NVIDIA_API_KEY (embeddings). Nothing to do unless you change models.

# 4. Build the vector index from the knowledge base (run once, and again
#    whenever you edit the .md files or add your CV PDF)
python -m app.rag.ingest

# 5. Start the API
uvicorn app.main:app --reload --port 8000
```

Then start the frontend in another terminal (from `frontend/`): `npm run dev`,
open http://localhost:5173, and use the chat bubble. The widget already points at
`http://localhost:8000` via `VITE_API_URL`.

## Add your CV (PDF)

You have two ways to add/replace the CV:

**A. From the admin dashboard (recommended).** Open the site at `#admin`, unlock
with your API key, go to **CV & Document Management**, and upload the PDF. The
backend saves it to `app/rag/knowledge/cv.pdf` **and re-indexes the chatbot
automatically** — no terminal needed. The site's "Download CV" button then serves
this file via `GET /api/cv`.

**B. Manually.** Drop your CV as `app/rag/knowledge/cv.pdf`, then re-run:

```powershell
python -m app.rag.ingest
```

Either way the ingester extracts the PDF text and adds it to the same index, so
the assistant can answer from your real CV.

## Admin dashboard & content management

The React app doubles as a private admin console. Visit the site with the
`#admin` hash (e.g. `http://localhost:5173/#admin`) to open it. It is gated by
your **admin API key** and lets you:

- **Add / edit / delete projects** — the form mirrors the public project card
  (title, description, category, featured flag, tech stack, GitHub/demo links,
  cover image). Changes hit the protected `/api/projects` routes and show up on
  the site (and to the chatbot's `list_portfolio_projects` tool) immediately.
- **Upload a cover image** — stored by the API and served from `/uploads/images/`.
- **Upload / replace the CV PDF** — replaces the file and re-indexes the chatbot.

**How the key works.** All write/upload routes require an `X-API-Key` header equal
to `ADMIN_API_KEY` in `backend/.env` (compared with `secrets.compare_digest`). The
UI stores the key in `sessionStorage` (cleared when the tab closes) and verifies it
against `GET /api/admin/verify` on unlock. If `ADMIN_API_KEY` is unset the admin
routes return **503** (locked by default). Keep this key private — anyone with it
can edit your content.

## Contact email notifications (optional)

When a visitor submits the contact form, the message is always stored in SQLite.
If SMTP is configured, the API **also** emails you a notification (sent in the
background via `EmailMessage` + `smtplib`, with the visitor's address as
`Reply-To`). Email is *fail-soft*: if SMTP is missing or errors, the message is
still saved and the visitor still gets a success response.

To enable it with Gmail, create an **App Password** (Google Account → Security →
2-Step Verification → App passwords — a 16-char code, **not** your normal
password) and set in `backend/.env`:

```
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASSWORD=your-16-char-app-password
CONTACT_NOTIFY_TO=where-to-receive@example.com
```

## Environment variables

All configuration lives in `backend/.env` (git-ignored). See `.env.example` for
the full template.

- `GROQ_API_KEY`, `NVIDIA_API_KEY` — chat + embeddings (required for the bot).
- `GROQ_CHAT_MODEL`, `NVIDIA_EMBED_MODEL` — model overrides (see below).
- `CORS_ORIGINS` — comma-separated allowed frontend origins.
- `ADMIN_API_KEY` — protects the admin/write endpoints. Generate a strong random
  value, e.g. `python -c "import secrets; print(secrets.token_urlsafe(32))"`.
- `UPLOAD_DIR` — where uploaded images are stored (default `uploads/`, git-ignored).
- `PUBLIC_BASE_URL` — public origin of the API (e.g. `https://api.example.com`)
  used to build absolute image URLs; leave blank in local dev and the request host
  is used.
- `SMTP_HOST` (default `smtp.gmail.com`), `SMTP_PORT` (default `587`), `SMTP_USER`,
  `SMTP_PASSWORD`, `SMTP_FROM` (defaults to `SMTP_USER`), `CONTACT_NOTIFY_TO` —
  contact-email settings above.

## Endpoints

- `POST /api/chat` — body `{ "message": "...", "history": [{"role","content"}] }`, returns `{ "response": "..." }`.
- `POST /api/chat/stream` — same body, returns a **Server-Sent Events** stream:
  `data: {"delta":"..."}` events as tokens arrive, then `data: [DONE]`. On error
  it emits `data: {"error":"..."}` before `[DONE]`. The frontend uses this by
  default and falls back to `POST /api/chat` if streaming is unavailable.
- `POST /api/contact` — body `{ name, email, subject?, message }`, stores a message
  **and** (if SMTP is configured) emails you a notification in the background.
- `GET  /api/contact` — lists stored messages (for you).
- `GET/POST /api/projects` — projects endpoints. `GET` (list) and `GET /{id}` are
  public (the bot reads these live); `POST`, `PUT /{id}`, `DELETE /{id}` require
  the admin API key (`X-API-Key` header).
- `GET  /api/admin/verify` — cheap key check used by the admin UI to unlock. **(key required)**
- `POST /api/admin/upload-image` — multipart `file`; stores a project cover image,
  returns `{ "url": "..." }`. **(key required)**
- `POST /api/admin/cv` — multipart `file` (PDF); replaces the CV and re-indexes the
  chatbot, returns `{ saved, reindexed, message }`. **(key required)**
- `GET  /api/cv` — public download of the current CV PDF (used by the site's
  "Download CV" button); `404` until one is uploaded.
- Uploaded images are served statically at `/uploads/images/<file>`.

Quick test once the server is running:

```powershell
curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" ^
  -d "{\"message\": \"Quelles sont les compétences de Youssef ?\", \"history\": []}"
```

## Frontend integration

The React frontend is already wired to this API:

- **Base URL:** `frontend/src/api.js` reads `VITE_API_URL` (see `frontend/.env`),
  defaulting to `http://localhost:8000`. In production set `VITE_API_URL` to the
  deployed API origin and add that frontend origin to `CORS_ORIGINS` here.
- **Chat widget** (`ChatWidget.jsx`) streams from `/api/chat/stream` and renders
  the assistant's markdown (bold, lists, code, clickable links) safely; it falls
  back to `/api/chat` automatically if streaming isn't available.
- **Contact form** (`Contact.jsx`) posts to `/api/contact`, so messages land in
  the same `contact_messages` table the chatbot writes to. View them via
  `GET /api/contact`. If SMTP is configured (see *Contact email notifications*),
  you also get an email notification per message.
- **Admin console** (`AdminPanel.jsx`) is mounted at the `#admin` hash and manages
  projects and the CV via the protected API (see *Admin dashboard*). The CV
  "Download" button on the site points at `GET /api/cv`.

For this to work in production the FastAPI backend must be deployed and reachable
at `VITE_API_URL`; in local dev just run `uvicorn` (port 8000) and `npm run dev`.

## Changing models

Edit `backend/.env`:

- `GROQ_CHAT_MODEL` — the chat model, served by **Groq** (fast inference). It
  **must support tool/function calling** (the agent binds 3 tools). Run
  `python probe_groq.py` to list the models your account can see and confirm the
  configured one supports tool calls before committing to it.
- `NVIDIA_EMBED_MODEL` — the embedding model, served by **NVIDIA**. Confirmed
  working: `nvidia/nemotron-3-embed-1b`. NVIDIA retires models often, so if
  ingest returns `[410] Gone`, probe for a live one. If you change this,
  **re-run `python -m app.rag.ingest`** so the index matches.

## Notes & troubleshooting

- **Run ingest before the first chat.** Without an index, retrieval returns
  nothing (the bot still answers from projects/live tools, but won't know the bio).
- If `/api/chat` returns **503**, `GROQ_API_KEY` isn't being read — check that
  `backend/.env` has `GROQ_API_KEY=gsk_...` (not `QROQ_API_KEY`).
- If the agent errors about **tools not supported**, your chosen Groq chat model
  doesn't support function calling — run `python probe_groq.py` and pick a
  tool-capable model.
- `chroma_db/`, `*.db`, and `.env` are git-ignored (secrets and local data stay local).
- API keys live only in `backend/.env` (`GROQ_API_KEY`, `NVIDIA_API_KEY`), which is
  git-ignored. Since the NVIDIA key was shared in chat earlier, consider rotating it
  on https://build.nvidia.com when convenient.
```
