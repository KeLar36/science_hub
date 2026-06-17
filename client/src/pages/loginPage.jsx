/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Імпортуємо наш хук
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const savedEmail = localStorage.getItem("registeredEmail");
    if (savedEmail) {
      setData((prev) => ({ ...prev, email: savedEmail }));
      localStorage.removeItem("registeredEmail");
    }
  }, []);

  const handleChange = (e) => {
    const { type, value } = e.target;
    setData((prev) => ({ ...prev, [type]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.post(`${apiUrl}/api/auth/login`, data);

      login(res.data.user);

      toast.success(`Вітаємо у системі!`, {
        style: {
          borderRadius: "8px",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #7c3aed",
          fontSize: "14px",
        },
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка авторизації", {
        style: {
          borderRadius: "8px",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
      setData((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)]">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6 mt-15 relative">
        <div className="absolute inset-0 opacity-40 z-0 pointer-events-none bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="max-w-md w-full relative z-10" data-aos="fade-up">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-6 transition-all group bg-transparent border-none cursor-pointer"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Назад
          </button>

          <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-12 shadow-2xl shadow-black/20 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-purple-600">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <div className="h-[1px] flex-grow bg-[var(--border-color)]"></div>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-3">
                <span className="text-purple-600">Авторизація</span>
              </h2>
              <p className="text-[var(--text-gray)] text-[11px] font-medium uppercase tracking-wider">
                Вхід до наукової платформи
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700 block">
                  Електронна пошта
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <input
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-sm transition-all text-[var(--text-dark)] outline-none focus:border-purple-600 focus:bg-[var(--bg-card)]"
                    type="email"
                    placeholder="name@university.edu"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700">
                    Пароль
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] font-bold text-purple-600 hover:underline uppercase"
                  >
                    Забули?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <input
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-sm transition-all text-[var(--text-dark)] outline-none focus:border-purple-600 focus:bg-[var(--bg-card)]"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-purple-600 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Увійти до системи
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[var(--border-color)]">
              <p className="text-[11px] text-center text-[var(--text-gray)] font-medium uppercase tracking-wider">
                Немає облікового запису?{" "}
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-400 font-bold ml-1 transition-colors"
                >
                  Створити акаунт
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-[10px] font-mono tracking-tighter">
              SECURE ACCESS GRANTED // 2026
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
