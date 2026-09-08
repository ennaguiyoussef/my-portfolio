// Central place for the backend base URL.
//
// In development the FastAPI server runs on http://localhost:8000.
// In production, set VITE_API_URL in the frontend's environment (e.g. a
// Netlify env var) to your deployed API origin, e.g.
//   VITE_API_URL=https://your-portfolio-api.onrender.com
//
// A trailing slash (if any) is stripped so `apiPath('/api/chat')` is always
// well-formed.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

/** Build a full backend URL from a path, e.g. apiPath('/api/chat'). */
export function apiPath(path) {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// --- Admin API key (used by the #admin panel) ---------------------------
// The key is kept in sessionStorage so it survives reloads within the tab but
// is cleared when the tab closes. It is sent as the "X-API-Key" header.
const ADMIN_KEY_STORAGE = 'portfolio_admin_key';

export function getAdminKey() {
  try {
    return sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setAdminKey(key) {
  try {
    if (key) sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    else sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  } catch {
    /* sessionStorage unavailable (private mode) — key stays in memory only */
  }
}

export function clearAdminKey() {
  setAdminKey('');
}

/** Headers for a JSON admin request, including the API key. */
export function adminHeaders(key = getAdminKey()) {
  return { 'Content-Type': 'application/json', 'X-API-Key': key };
}

