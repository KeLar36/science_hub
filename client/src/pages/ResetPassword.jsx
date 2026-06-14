/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Паролі не збігаються");
    }

    if (password.length < 8) {
      return toast.error("Пароль має бути не менше 8 символів");
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, {
        password,
      });

      setIsSuccess(true);
      toast.success("Пароль успішно змінено! 🔒", {
        style: {
          borderRadius: "8px",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #7c3aed",
        },
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Токен недійсний або термін дії вичерпано",
        {
          duration: 5000,
          style: {
            borderRadius: "8px",
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)]">
      <Toaster position="top-right" />
      <Navbar />

      <style>{`
        .bento-auth-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
        }
        .bento-auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #7c3aed;
        }
        .input-minimal {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 12px 16px 12px 48px;
          width: 100%;
          font-size: 14px;
          transition: all 0.2s ease;
          color: var(--text-dark);
          outline: none;
        }
        .input-minimal:focus {
          border-color: #7c3aed;
          background: var(--bg-card);
        }
        .label-mono {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-gray);
          font-weight: 700;
        }
        .grid-bg {
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 32px 32px;
          position: absolute;
          inset: 0;
          opacity: 0.4;
          z-index: 0;
        }
      `}</style>

      <main className="flex-grow flex items-center justify-center py-20 px-6 mt-15 relative">
        <div className="grid-bg" />

        <div className="max-w-md w-full relative z-10" data-aos="fade-up">
          {!isSuccess && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-[var(--text-gray)] hover:text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-6 transition-all group"
            >
              <ChevronLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Повернутися до входу
            </button>
          )}

          <div className="bento-auth-card p-8 md:p-12 shadow-2xl shadow-black/20">
            {isSuccess ? (
              <div className="text-center py-6" data-aos="zoom-in">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-4">
                  Пароль оновлено <span className="text-emerald-500">.</span>
                </h2>
                <p className="text-[var(--text-gray)] text-[11px] font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Ваш доступ успішно відновлено. Зараз ви будете автоматично
                  перенаправлені.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 text-purple-600 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-purple-400 transition-colors"
                >
                  Увійти вручну <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 flex items-center justify-center text-white">
                      <Lock size={20} />
                    </div>
                    <div className="h-[1px] flex-grow bg-[var(--border-color)]"></div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">
                    Новий пароль <span className="text-purple-600">.</span>
                  </h2>
                  <p className="text-[var(--text-gray)] text-[11px] font-medium uppercase tracking-wider">
                    Встановіть новий захист для вашого профілю
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                  <div className="space-y-2">
                    <label className="label-mono block">Новий пароль</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                        size={16}
                      />
                      <input
                        className="input-minimal"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-purple-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-mono block">Підтвердження</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                        size={16}
                      />
                      <input
                        className="input-minimal"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-purple-600 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Оновити доступ
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/10">
                  <ShieldAlert
                    size={16}
                    className="text-purple-600 mt-0.5 shrink-0"
                  />
                  <p className="text-[9px] text-[var(--text-gray)] leading-relaxed uppercase font-bold tracking-tight">
                    Переконайтеся, що ваш пароль містить великі літери та цифри
                    для максимальної безпеки.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
