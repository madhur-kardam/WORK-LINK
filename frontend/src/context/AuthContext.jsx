import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  request,
  refreshAccessToken,
  setAccessToken,
  setSessionExpiredHandler
} from '../services/api.js';

const AuthContext = createContext(null);

// The access token lives 15 minutes; renew it a little before it expires
const REFRESH_EVERY_MS = 13 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while the login is being restored on page load

  const clearSession = useCallback(() => {
    setAccessToken(null);
    localStorage.clear();
    setUser(null);
  }, []);

  // 1) Page load / refresh: ask the server for a new access token using the refresh cookie
  useEffect(() => {
    let active = true;

    // remove the token saved by the old login system (it was readable by any script)
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    refreshAccessToken()
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {}) // no valid cookie -> stay logged out
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // 2) If the server says the session is dead, log out locally
  useEffect(() => {
    setSessionExpiredHandler(clearSession);
    return () => setSessionExpiredHandler(null);
  }, [clearSession]);

  // 3) While logged in, quietly renew the access token before it expires
  useEffect(() => {
    if (!user) return;

    const id = setInterval(() => {
      refreshAccessToken().catch((error) => {
        if (error.status === 401) clearSession(); // network errors don't log you out
      });
    }, REFRESH_EVERY_MS);

    return () => clearInterval(id);
  }, [user, clearSession]);

  const login = (token, newUser) => {
    setAccessToken(token);
    setUser(newUser);
  };

  const logout = () => {
    request('/auth/logout', { method: 'POST' }).catch(() => {}); // revokes the refresh token + clears the cookie
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
