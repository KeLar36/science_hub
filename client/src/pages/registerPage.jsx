import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (data.name.length < 3) return toast.error("Ім'я занадто коротке (мін. 3 символи)");
    if (data.password.length < 8) return toast.error("Пароль має бути не менше 8 символів");

    setLoading(true);
    const registerPromise = axios.post(`${apiUrl}/api/auth/register`, data);

    toast.promise(
      registerPromise,
      {
        loading: 'Створюємо ваш науковий профіль...',
        success: (res) => {
          localStorage.setItem('isNewbie', 'true');
          localStorage.setItem('registeredEmail', data.email);
          setTimeout(() => navigate('/login'), 2000);
          return <b>Вітаємо! Реєстрація успішна. ✨</b>;
        },
        error: (err) => `Помилка: ${err.response?.data?.error || "щось пішло не так"}`,
      },
      {
        style: {
          borderRadius: '15px',
          background: 'var(--text-dark)',
          color: 'var(--bg-main)',
          border: '1px solid var(--border-color)'
        },
        success: { iconTheme: { primary: '#6d28d9', secondary: '#fff' } }
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500 overflow-x-hidden">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div
          className="max-w-md w-full bg-[var(--bg-card)] rounded-[40px] shadow-2xl shadow-indigo-500/5 p-10 border border-[var(--border-color)] relative overflow-hidden"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--purple-light)] rounded-full blur-3xl opacity-50"></div>

          <div className="text-center mb-10" data-aos="fade-down" data-aos-delay="200">
            <div className="w-16 h-16 bg-[var(--purple-light)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[var(--border-color)] rotate-3">
              <UserPlus size={32} className="text-[#6d28d9]" />
            </div>
            <h2 className="text-3xl font-black text-[var(--text-dark)] tracking-tight">Приєднуйтесь</h2>
            <p className="text-[var(--text-gray)] text-sm mt-2 font-medium">Почніть свій шлях у велику науку</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative" data-aos="fade-up" data-aos-delay="300">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-[#6d28d9] outline-none transition-all font-medium placeholder:text-[var(--text-gray)] opacity-80 focus:opacity-100"
                placeholder="Ваше повне ім'я"
                maxLength={50}
                minLength={3}
                onChange={e => setData({ ...data, name: e.target.value })}
                required
              />
              <span className="absolute right-4 bottom-[-20px] text-[10px] text-[var(--text-gray)] font-bold uppercase">
                {data.name.length}/50
              </span>
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="400">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-[#6d28d9] outline-none transition-all font-medium placeholder:text-[var(--text-gray)]"
                type="email"
                placeholder="Електронна пошта"
                onChange={e => setData({ ...data, email: e.target.value })}
                required
              />
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="500">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className={`w-full pl-12 pr-12 py-4 bg-[var(--bg-main)] border rounded-2xl outline-none transition-all font-medium text-[var(--text-dark)] placeholder:text-[var(--text-gray)] ${data.password.length > 0 && data.password.length < 8
                    ? 'border-red-400 focus:ring-red-500/10'
                    : 'border-[var(--border-color)] focus:ring-purple-500/20 focus:border-[#6d28d9]'
                  }`}
                type={showPassword ? "text" : "password"}
                placeholder="Пароль (мін. 8 символів)"
                minLength={8}
                onChange={e => setData({ ...data, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-[#6d28d9] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {data.password.length > 0 && data.password.length < 8 && (
                <p className="text-[10px] text-red-400 mt-1 ml-4 font-bold animate-pulse absolute">
                  Занадто короткий пароль
                </p>
              )}
            </div>

            <button
              className="w-full py-4 bg-[#6d28d9] text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group mt-4"
              type="submit"
              disabled={loading}
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              {loading ? "Створення..." : "Створити акаунт"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4" data-aos="fade-up" data-aos-delay="700">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-gray)] bg-[var(--bg-main)] px-4 py-2 rounded-full border border-[var(--border-color)]">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Ваші дані захищені наскрізним шифруванням</span>
            </div>
            <Link to="/login" className="text-sm font-bold text-[var(--text-gray)] hover:text-[#6d28d9] transition-colors">
              Вже є акаунт? <span className="underline underline-offset-4 decoration-purple-500/30">Увійти в кабінет</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;