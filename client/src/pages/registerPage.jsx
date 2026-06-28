/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
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
import { UKRAINIAN_CITIES } from "../constants/cities";
import { SCIENTIFIC_DOMAINS } from "../constants/domains";

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

  // 🟣 Сортуємо міста за українським алфавітом
  const sortedCities = useMemo(() => {
    return [...UKRAINIAN_CITIES].sort((a, b) => a.localeCompare(b, "uk"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", { ...formData, role: "user" });
      toast.success("Реєстрація успішна!");
      navigate("/login");
    } catch (err) {
      toast.error("Помилка реєстрації. Перевірте введені дані.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-600 rounded-lg transition-all";
  const labelStyle =
    "text-[10px] uppercase tracking-[0.2em] text-[var(--text-gray)] font-bold mb-2 block";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-dark)] transition-colors duration-300">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-6 relative">
        <div className="max-w-xl w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-10 md:p-14 relative shadow-2xl rounded-xl">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600" />

          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-8 flex items-center hover:text-purple-600 transition-colors"
          >
            <ChevronLeft size={14} className="mr-2" /> На головну
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Реєстрація
            </h2>
            <p className="text-[var(--text-gray)] text-xs mt-2 uppercase tracking-widest">
              Створення профілю науковця
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className={labelStyle}>Повне ім'я</label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-[var(--text-gray)]"
                  size={16}
                />
                <input
                  name="name"
                  className={inputStyle}
                  onChange={handleChange}
                  required
                  placeholder="Дмитро Мельник"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Електронна пошта</label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-[var(--text-gray)]"
                    size={16}
                  />
                  <input
                    name="email"
                    type="email"
                    className={inputStyle}
                    onChange={handleChange}
                    required
                    placeholder="name@univ.edu"
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Місто</label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-3.5 text-[var(--text-gray)]"
                    size={16}
                  />
                  <select
                    name="city"
                    className={`${inputStyle} appearance-none`}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Оберіть місто</option>
                    {/* 🟣 Використовуємо відсортований масив */}
                    {sortedCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Наукова галузь</label>
              <div className="relative">
                <BookOpen
                  className="absolute left-4 top-3.5 text-[var(--text-gray)]"
                  size={16}
                />
                <select
                  name="domain"
                  className={`${inputStyle} appearance-none`}
                  onChange={handleChange}
                  required
                >
                  {SCIENTIFIC_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Пароль</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-[var(--text-gray)]"
                  size={16}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={inputStyle}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Зареєструватись"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
            <p className="text-[10px] text-[var(--text-gray)] uppercase tracking-widest font-bold">
              Вже маєте акаунт?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-500 font-bold underline underline-offset-4"
              >
                Авторизуватися
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
