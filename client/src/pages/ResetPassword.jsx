import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Паролі не збігаються");
    }

    if (password.length < 6) {
      return toast.error("Пароль має бути не менше 6 символів");
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password });

      setIsSuccess(true);
      toast.success("Пароль успішно змінено! 🔒");

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      toast.error(err.response?.data?.error || "Токен недійсний або термін дії вичерпано", {
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] selection:bg-purple-100 transition-colors duration-500">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl delay-700 animate-pulse"></div>

        <div
          className="max-w-md w-full bg-[var(--bg-card)] backdrop-blur-xl rounded-[48px] shadow-2xl p-10 md:p-12 border border-[var(--border-color)] relative z-10 transition-colors duration-500"
          data-aos="zoom-in"
        >
          {isSuccess ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={60} />
              </div>
              <h2 className="text-3xl font-black text-[var(--text-dark)]">Готово!</h2>
              <p className="text-[var(--text-gray)] font-medium">Ваш пароль успішно оновлено. Зараз ви будете перенаправлені на сторінку входу.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#6d28d9] font-bold hover:underline"
              >
                Увійти зараз <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20 rotate-3">
                </div>
                <h2 className="text-3xl font-black text-[var(--text-dark)] tracking-tight mb-2">Новий пароль</h2>
                <p className="text-[var(--text-gray)] font-medium italic opacity-70 uppercase text-[10px] tracking-widest">
                  Встановіть надійний захист
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-1 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                    Новий пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                    <input
                      className="w-full pl-14 pr-14 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)]"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-[#6d28d9] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                    Підтвердіть пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                    <input
                      className="w-full pl-14 pr-6 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)]"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black text-lg shadow-2xl shadow-purple-500/20 hover:bg-[#5b21b6] hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <span>Оновити пароль</span>
                      <ArrowRight size={20} className="opacity-50" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;