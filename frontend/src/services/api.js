const API_URL = import.meta.env.VITE_API_URL || '/api';

// The access token lives ONLY in memory (never in localStorage), so an XSS attack
// can't steal a long-lived login from storage.
let accessToken = null;
export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};

// AuthContext registers this to log the user out locally when the session is dead
let onSessionExpired = null;
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

// Asks the server for a new access token using the httpOnly refresh cookie.
// One shared promise: parallel callers (React StrictMode, several requests) trigger ONE refresh.
let refreshPromise = null;
export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const error = new Error(data.error || 'Session expired');
          error.status = response.status;
          throw error;
        }
        setAccessToken(data.token);
        return data; // { token, user }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Shared fetch helper. Returns { ok, data } so callers keep the same
// response.ok / result checks as before.
export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const send = () => {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  };

  let response = await send();

  // Access token expired? Get a new one with the refresh cookie and retry once.
  if (auth && response.status === 401) {
    try {
      await refreshAccessToken();
      response = await send();
    } catch (error) {
      if (error.status === 401 && onSessionExpired) onSessionExpired();
    }
  }

  const data = await response.json();
  return { ok: response.ok, data };
}
