import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    try {
      localStorage.setItem("token", token || "");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      setUser(userData);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  };

  const signup = async (fullName, email, password) => {
    // Minimal demo signup: persist a fake user and mark authenticated.
    // Replace with real API call when backend is available.
    try {
      const userData = { id: Date.now(), name: fullName, email };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("isAuthenticated", "true");
      setUser(userData);
      return { ok: true, user: userData };
    } catch (err) {
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      // Redirect to signup after logout
      try {
        navigate("/signup", { replace: true });
      } catch (e) {
        // fallback to full reload if navigate isn't available
        window.location.href = "/signup";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
