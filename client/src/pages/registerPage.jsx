/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios"; // Використовуємо твій конфіг axios
import toast, { Toaster } from "react-hot-toast";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  MapPin,
  BookOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

import { UKRAINIAN_CITIES } from "../constants/cities";

const SCIENTIFIC_DOMAINS = [
  "Штучний інтелект & IT",
  "Медицина та фармація",
  "Економіка та фінанси",
  "Право та юриспруденція",
  "Природничі науки",
  "Гуманітарні науки",
  "Технічні науки & Інженерія",
  "Інше",
];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    domain: "Інше",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 3)
      return toast.error("Ім'я занадто коротке (мін. 3 символи)");
    if (formData.password.length < 8)
      return toast.error("Пароль має бути не менше 8 символів");
    if (!formData.city) return toast.error("Будь ласка, оберіть місто");

    setLoading(true);

    const finalData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      topics: [formData.domain],
      role: "user",
      status: "Offline",
    };

    const registerPromise = axios.post("/auth/register", finalData);

    toast
      .promise(
        registerPromise,
        {
          loading: "Створюємо ваш профіль у системі...",
          success: (res) => {
            localStorage.setItem("registeredEmail", formData.email);
            setTimeout(() => navigate("/login"), 2000);
            return <b>Реєстрація успішна! ✨ Вітаємо в Science Platform.</b>;
          },
          error: (err) =>
            `Помилка: ${err.response?.data?.error || "Ця пошта вже зареєстрована"}`,
        },
        {
          style: {
            borderRadius: "12px",
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #7c3aed",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#7c3aed", secondary: "#fff" } },
        },
      )
      .finally(() => setLoading(false));
  };

  const inputClass =
    "w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-sm transition-all text-[var(--text-dark)] outline-none focus:border-purple-600 focus:bg-[var(--bg-card)] rounded-lg appearance-none";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)]">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-6 mt-10 relative">
        <div className="absolute inset-0 opacity-40 z-0 pointer-events-none bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="max-w-2xl w-full relative z-10" data-aos="fade-up">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-purple-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 transition-all group bg-transparent border-none cursor-pointer"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Повернутися до головної
          </button>

          <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] p-10 md:p-14 shadow-2xl shadow-black/20 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-purple-600">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 flex items-center justify-center text-white rounded-xl shadow-lg shadow-purple-600/20">
                  <UserPlus size={24} />
                </div>
                <div className="h-[1px] flex-grow bg-[var(--border-color)]"></div>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-3">
                <span className="text-purple-600">Реєстрація</span>
              </h2>
              <p className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Створення профілю науковця в екосистемі Science Platform
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2 md:col-span-2">
                <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700 block">
                  Повне ім'я (для сертифікатів)
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <input
                    name="name"
                    className={inputClass}
                    type="text"
                    placeholder="Дмитро Мельник"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                    name="email"
                    className={inputClass}
                    type="email"
                    placeholder="melnyk@univ.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700 block">
                  Місто проживання/базування
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <select
                    name="city"
                    className="bg-[#1a1a1a] text-white placeholder:text-[var(--text-gray)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    }}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option
                      value=""
                      disabled
                      className="bg-[#1a1a1a] text-white"
                    >
                      Оберіть місто
                    </option>
                    {UKRAINIAN_CITIES.map((city) => (
                      <option
                        key={city}
                        value={city}
                        className="bg-[#1a1a1a] text-white"
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700 block">
                  Наукова галузь
                </label>
                <div className="relative">
                  <BookOpen
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                    size={16}
                  />
                  <select
                    name="domain"
                    className={`${inputClass} cursor-pointer pr-10 bg-no-repeat bg-[right_1rem_center] bg-[length:1em] [appearance:none]`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    }}
                    value={formData.domain}
                    onChange={handleChange}
                    required
                  >
                    {SCIENTIFIC_DOMAINS.map((domain) => (
                      <option
                        key={domain}
                        value={domain}
                        className="bg-[#1a1a1a] text-white"
                      >
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-['Space_Mono',_monospace] text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-700 block">
                  Пароль
                </label>
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
                    value={formData.password}
                    onChange={handleChange}
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
                className="md:col-span-2 mt-6 py-5 bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.25em] hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-4 rounded-xl shadow-xl shadow-purple-600/10 cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Зареєструватись</>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center">
              <p className="text-[11px] text-[var(--text-gray)] font-bold uppercase tracking-widest">
                Вже маєте обліковий запис?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-400 ml-2 transition-colors"
                >
                  Авторизуватися
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

export default RegisterPage;
