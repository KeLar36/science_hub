import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const LoginPage = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('registeredEmail');
    if (savedEmail) {
      setData(prev => ({ ...prev, email: savedEmail }));
      localStorage.removeItem('registeredEmail');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/auth/login`, data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`З поверненням! 🟣`, {
        style: {
          borderRadius: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-dark)',
          border: '1px solid var(--border-color)'
        }
      });

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка авторизації", {
        style: {
          borderRadius: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-dark)',
          border: '1px solid var(--border-color)'
        },
      });
      setData(prev => ({ ...prev, password: '' }));
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
          data-aos-duration="800"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20 -rotate-6 transition-transform duration-500">
              <LogIn size={38} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-[var(--text-dark)] tracking-tight mb-2">Вхід</h2>
            <p className="text-[var(--text-gray)] font-medium italic opacity-70 uppercase text-[10px] tracking-widest">
              Доступ до наукової панелі
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                Електронна пошта
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                <input
                  className="w-full pl-14 pr-6 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/30"
                  type="email"
                  placeholder="name@university.edu"
                  value={data.email}
                  onChange={e => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                <input
                  className="w-full pl-14 pr-14 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/30"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={data.password}
                  onChange={e => setData({ ...data, password: e.target.value })}
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

            <div className="flex justify-end px-2">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#6d28d9] hover:opacity-70 transition-opacity">
                Забули пароль?
              </Link>
            </div>

            <button
              className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black text-lg shadow-2xl shadow-purple-500/20 hover:bg-[#5b21b6] hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><span>Увійти</span><ArrowRight size={20} className="opacity-50" /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-[var(--text-gray)]">
              Новий користувач?{' '}
              <Link to="/register" className="text-[#6d28d9] hover:underline underline-offset-8 decoration-2 decoration-purple-200 transition-all">
                Реєстрація
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;