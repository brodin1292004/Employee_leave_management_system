import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

// reads the payload of a JWT token (used only if the login response has no role)
function readToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
const res = await api.post("/accounts/login/", { username, password });
    const { access, refresh } = res.data;
    const payload = readToken(access);
    const info = {
      username: res.data.username || res.data.user?.username || payload.username || username,
      role: res.data.role || res.data.user?.role || payload.role,
    };
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(info));
    setUser(info);
    return info;
  };

  const logout = async () => {
    try {
      await api.post("/api/accounts/logout/", { refresh: localStorage.getItem("refresh") });
    } catch {
      // ignore, we clear the session anyway
    }
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
