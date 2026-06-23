/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
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
  const [data, setData] = useState(() => {
    const savedEmail = localStorage.getItem("registeredEmail");
    return {
      email: savedEmail || "",
      password: "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const savedEmail = localStorage.getItem("registeredEmail");
  }, []);

  // Перевірка на випадок, якщо користувач вже зайшов раніше за прямим лінком
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axiosInstance.post("/auth/login", data);
      const res = await axiosInstance.get("/users/me");

      toast.success("Вітаємо у системі! 🟣");

      // Робимо паузу 600мс, щоб юзер побачив анімацію тоста, і лише потім редиректимо через контекст
      setTimeout(() => {
        login(res.data.user);
      }, 600);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка авторизації");
      setData((prev) => ({ ...prev, password: "" }));
      setLoading(false); // Скидаємо loading тільки при помилці
    }
  };

  const inputClass =
    "w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-12 pr-4 py-4 text-sm text-[var(--text-dark)] outline-none focus:border-purple-600 rounded-xl transition-all";
  const labelStyle =
    "text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-bold mb-2 block";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-300">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-6 relative">
        <div className="absolute inset-0 opacity-20 z-0 pointer-events-none bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="max-w-md w-full relative z-10" data-aos="fade-up">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-purple-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 transition-all group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            На головну
          </button>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-10 md:p-12 shadow-2xl relative overflow-hidden rounded-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-600" />

            <div className="mb-10">
              <div className="w-12 h-12 bg-purple-600/20 flex items-center justify-center text-purple-600 rounded-xl mb-6">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Авторизація
              </h2>
              <p className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-widest mt-2">
                Вхід до наукової платформи
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className={labelStyle}>Електронна пошта</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                  />
                  <input
                    name="email"
                    className={inputClass}
                    type="email"
                    placeholder="name@university.edu"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelStyle}>Пароль</label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] font-bold text-purple-600 hover:underline uppercase tracking-widest"
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
                    name="password"
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-600/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Увійти <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-center">
              <p className="text-[10px] text-[var(--text-gray)] font-bold uppercase tracking-widest">
                Немає акаунту?{" "}
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-400 underline underline-offset-4 transition-colors"
                >
                  Створити профіль
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
