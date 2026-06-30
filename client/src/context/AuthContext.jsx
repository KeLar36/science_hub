/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "../api/axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const isChecking = useRef(false);

  const checkAuth = useCallback(
    async (force = false) => {
      if (isChecking.current || (isAuthChecked && !force)) return;
      isChecking.current = true;

      try {
        const res = await axios.get("/users/me");

        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Помилка авторизації в контексті:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setIsAuthChecked(true);
        isChecking.current = false;
      }
    },
    [isAuthChecked],
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.get("/users/me");
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(userData);
      }
    } catch {
      setUser(userData);
    } finally {
      setIsAuthChecked(true);
      setLoading(false);
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
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
        updateUserState,
      }}
    >
      {loading ? (
        <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
