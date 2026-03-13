import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
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
          background: 'var(--bg-card)',
          color: 'var(--text-dark)',
          border: '1px solid var(--border-color)'
        },
        success: { iconTheme: { primary: '#6d28d9', secondary: '#fff' } }
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500 overflow-hidden">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-6 relative">
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl delay-700 animate-pulse"></div>

        <div
          className="max-w-md w-full bg-[var(--bg-card)] backdrop-blur-xl rounded-[48px] shadow-2xl p-10 md:p-12 border border-[var(--border-color)] relative z-10"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#6d28d9] to-[#a855f7] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20 rotate-6 transition-transform hover:rotate-0 duration-500">
              <UserPlus size={38} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-[var(--text-dark)] tracking-tight mb-2">Приєднуйтесь</h2>
            <p className="text-[var(--text-gray)] font-black opacity-70 uppercase text-[10px] tracking-widest">
              Почніть свій шлях у науку
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1 group" data-aos="fade-up" data-aos-delay="100">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                Повне ім'я
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                <input
                  className="w-full pl-14 pr-6 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/30"
                  placeholder="Олександр Науковець"
                  maxLength={50}
                  minLength={3}
                  onChange={e => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 group" data-aos="fade-up" data-aos-delay="200">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                Електронна пошта
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                <input
                  className="w-full pl-14 pr-6 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9] outline-none transition-all font-bold text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/30"
                  type="email"
                  placeholder="name@university.edu"
                  onChange={e => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1 group" data-aos="fade-up" data-aos-delay="300">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4 group-focus-within:text-[#6d28d9] transition-colors">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50 group-focus-within:text-[#6d28d9] transition-colors" size={18} />
                <input
                  className={`w-full pl-14 pr-14 py-4.5 bg-[var(--bg-main)] border rounded-3xl outline-none transition-all font-bold text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/30 ${data.password.length > 0 && data.password.length < 8
                      ? 'border-red-400 focus:ring-red-500/10'
                      : 'border-[var(--border-color)] focus:ring-4 focus:ring-purple-500/10 focus:border-[#6d28d9]'
                    }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength={8}
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

            <button
              className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black text-lg shadow-2xl shadow-purple-500/20 hover:bg-[#5b21b6] hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
              type="submit"
              disabled={loading}
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><span>Створити акаунт</span><ArrowRight size={20} className="opacity-50" /></>}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4" data-aos="fade-up" data-aos-delay="500">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-gray)] bg-[var(--bg-main)] px-4 py-2 rounded-full border border-[var(--border-color)] uppercase tracking-tight">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Ваші дані захищені наскрізним шифруванням</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-gray)]">
              Вже маєте аккаунт?{' '}
              <Link to="/login" className="text-[#6d28d9] hover:underline underline-offset-8 decoration-2 decoration-purple-200 transition-all">
                Ввійти в кабінет
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;