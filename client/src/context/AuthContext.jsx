import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isChecking = useRef(false);

  const checkAuth = async () => {
    if (isChecking.current || isAuthChecked) return;
    isChecking.current = true;

    try {
      const res = await axios.get("/auth/me");

      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
      setIsAuthChecked(true);
      isChecking.current = false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (newUser) => {
    setUser(newUser);
    setIsAuthChecked(true);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Помилка під час логауту на сервері:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {loading ? (
        <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--purple-main)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth має використовуватись всередині AuthProvider");
  }
  return context;
};
