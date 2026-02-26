import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (data.name.length < 3) {
      return toast.error("Ім'я занадто коротке (мін. 3 символи)");
    }
    if (data.password.length < 8) {
      return toast.error("Пароль має бути не менше 8 символів");
    }

    setLoading(true);

    const registerPromise = axios.post('http://51.21.180.152/api/auth/register', data);

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
        style: { borderRadius: '15px', background: '#1e1b4b', color: '#fff' },
        success: { iconTheme: { primary: '#6d28d9', secondary: '#fff' } }
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 p-10 border border-purple-50 relative overflow-hidden">

          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#f5f3ff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-purple-100 rotate-3">
              <UserPlus size={32} className="text-[#6d28d9]" />
            </div>
            <h2 className="text-3xl font-black text-[#1e1b4b] tracking-tight">Приєднуйтесь</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Почніть свій шлях у велику науку</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-100 focus:border-[#6d28d9] outline-none transition-all font-medium"
                placeholder="Ваше повне ім'я"
                maxLength={50}
                minLength={3}
                onChange={e => setData({ ...data, name: e.target.value })}
                required
              />
              <span className="absolute right-4 bottom-[-18px] text-[10px] text-gray-300 font-bold uppercase">
                {data.name.length}/50
              </span>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-100 focus:border-[#6d28d9] outline-none transition-all font-medium"
                type="email"
                placeholder="Електронна пошта"
                onChange={e => setData({ ...data, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-2xl outline-none transition-all font-medium ${data.password.length > 0 && data.password.length < 8
                  ? 'border-red-200 focus:ring-red-50'
                  : 'border-gray-100 focus:ring-purple-100 focus:border-[#6d28d9]'
                  }`}
                type={showPassword ? "text" : "password"}
                placeholder="Надійний пароль (мін. 8 символів)"
                minLength={8}
                onChange={e => setData({ ...data, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6d28d9] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {data.password.length > 0 && data.password.length < 8 && (
                <p className="text-[10px] text-red-400 mt-1 ml-4 font-bold animate-pulse">
                  Занадто короткий пароль
                </p>
              )}
            </div>

            <button
              className="w-full py-4 bg-[#6d28d9] text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-100 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
              type="submit"
              disabled={loading}
            >
              {loading ? "Створення..." : "Створити акаунт"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <ShieldCheck size={14} className="text-green-400" />
              <span>Ваші дані захищені наскрізним шифруванням</span>
            </div>
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-[#6d28d9] transition-colors">
              Вже є акаунт? <span className="underline underline-offset-4 decoration-purple-200">Увійти в кабінет</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;