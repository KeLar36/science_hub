import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    setLoading(true);

    try {
      const res = await axios.post('http://51.21.180.152/api/auth/login', data);

      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));

      const isNewUser = localStorage.getItem('isNewbie') === 'true';

      const message = isNewUser
        ? `Вітаємо на платформі, ${user.name}! Ваш науковий профіль активовано. ✨`
        : `З поверненням, ${user.name}! Раді вас бачити знову. 🟣`;

      toast.success(message, {
        style: {
          borderRadius: '15px',
          background: '#1e1b4b',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        iconTheme: { primary: '#6d28d9', secondary: '#fff' },
        duration: 5000
      });


      localStorage.removeItem('isNewbie');

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.error || "Невірний email або пароль", {
        style: { borderRadius: '15px', background: '#1e1b4b', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 p-10 border border-purple-50 relative overflow-hidden">

          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#f5f3ff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-purple-100 -rotate-3">
              <LogIn size={32} className="text-[#6d28d9]" />
            </div>
            <h2 className="text-3xl font-black text-[#1e1b4b] tracking-tight">Вхід у систему</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Керуйте вашими науковими публікаціями</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-100 focus:border-[#6d28d9] outline-none transition-all font-medium"
                type="email"
                placeholder="Електронна пошта"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-100 focus:border-[#6d28d9] outline-none transition-all font-medium"
                type={showPassword ? "text" : "password"}
                placeholder="Ваш пароль"
                value={data.password}
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
            </div>

            <button
              className="w-full py-4 bg-[#6d28d9] text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-100 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
              type="submit"
              disabled={loading}
            >
              {loading ? "Авторизація..." : "Продовжити"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-3">
            <Link to="/register" className="text-sm font-bold text-gray-400 hover:text-[#6d28d9] transition-colors">
              Ще немає акаунта? <span className="underline underline-offset-4 decoration-purple-200 text-[#6d28d9]">Реєстрація</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;