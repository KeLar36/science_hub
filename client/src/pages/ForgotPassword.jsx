/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  ArrowLeft,
  Loader2,
  Send,
  ChevronLeft,
  KeyRound,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });

      toast.success("Інструкції надіслано на вашу пошту! 📩", {
        style: {
          borderRadius: "8px",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #7c3aed",
          fontSize: "14px",
        },
      });
    } catch (err) {
      console.error("Помилка відновлення пароля:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Користувача не знайдено",
        {
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

      <main className="flex-grow flex items-center justify-center py-20 px-6 mt-15 relative overflow-hidden">
        <div className="grid-bg" />

        <div className="max-w-md w-full relative z-10" data-aos="fade-up">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-6 transition-all group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Назад до входу
          </button>

          <div className="bento-auth-card p-8 md:p-12 shadow-2xl shadow-black/20">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 flex items-center justify-center text-white">
                  <KeyRound size={20} />
                </div>
                <div className="h-[1px] flex-grow bg-[var(--border-color)]"></div>
              </div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">
                Відновлення <span className="text-purple-600">.</span>
              </h2>
              <p className="text-[var(--text-gray)] text-[11px] font-medium uppercase tracking-wider leading-relaxed">
                Ми надішлемо інструкції для скидання пароля на ваш email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono block">Електронна адреса</label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <input
                    className="input-minimal"
                    type="email"
                    placeholder="your-email@science.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    Надіслати запит
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-center">
              <Link
                to="/login"
                className="text-[10px] font-bold text-[var(--text-gray)] hover:text-purple-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={12} /> Повернутися до авторизації
              </Link>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)]">
              <Sparkles size={12} className="text-purple-600" />
              <span className="text-[9px] font-mono uppercase tracking-tight opacity-60">
                Powered by SciencePlatform Security
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
