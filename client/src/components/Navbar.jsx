/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  GraduationCap,
  Sun,
  Moon,
  User,
  ArrowRight,
  Mail,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useDarkMode();

  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const handleProtectedRedirect = () => {
    setTimeout(() => {
      closeMenu();
    }, 50);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Помилка під час логауту користувача:", error);
    } finally {
      closeMenu();
      navigate("/login");
    }
  };

  const navLinks = [
    { label: "Програми", path: "/" },
    { label: "Архів", path: "/archive" },
    { label: "Блог", path: "/blog" },
    { label: "Про нас", path: "/about" },
    { label: "Правила", path: "/rules" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-[var(--bg-main)]/80 backdrop-blur-md shadow-lg shadow-purple-500/[0.02] border-b border-[var(--border-color)] py-3.5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between relative z-[110]">
          {/* Логотип */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]/50 flex items-center justify-center transition-all duration-300 group-hover:border-[#6d28d9] group-hover:shadow-md group-hover:shadow-purple-500/15">
              <GraduationCap
                size={18}
                className="text-[var(--text-dark)] group-hover:text-[#6d28d9] transition-colors"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-[0.2em] text-[var(--text-dark)] uppercase">
                Science
                <span className="text-[#6d28d9] dark:text-[#a78bfa]">
                  Platform
                </span>
              </span>
              <span className="text-[8px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-1">
                Екосистема 2026
              </span>
            </div>
          </Link>

          {/* Десктопна навігація */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  className={`text-[10px] uppercase tracking-[0.25em] font-black transition-all relative py-2 group/link ${
                    isActive
                      ? "text-[#6d28d9] dark:text-[#a78bfa]"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#6d28d9] dark:bg-[#a78bfa] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover/link:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Кнопки дій */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-transparent text-[var(--text-gray)] hover:text-[#6d28d9] hover:bg-[var(--bg-card)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Кнопка профілю: ТЕПЕР ПРИХОВАНА НА МЕНШЕ НІЖ 768px (hidden md:flex) */}
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="hidden md:flex w-9 h-9 rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] items-center justify-center transition-all hover:border-[#6d28d9]"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-[var(--text-dark)]" />
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden lg:flex p-2.5 rounded-xl text-[var(--text-gray)] hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300"
                  title="Вийти з акаунту"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-[var(--text-dark)] bg-[var(--bg-card)] border border-[var(--border-color)] px-5 py-2.5 rounded-xl hover:border-[#6d28d9] transition-all duration-300"
              >
                Увійти
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[var(--text-dark)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню: Використовує динамічні змінні теми без прозорості */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 h-[100dvh] bg-[var(--bg-main)] bg-opacity-100 lg:hidden flex flex-col justify-between transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 visible z-[99999]"
            : "-translate-y-full opacity-0 invisible z-[-1]"
        }`}
      >
        <div className="flex-1 overflow-y-auto pt-28 px-8 pb-6 space-y-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-gray)] border-b border-[var(--border-color)] pb-2">
            Навігація по екосистемі
          </p>
          <div className="flex flex-col gap-6">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-3xl font-black uppercase tracking-tighter flex justify-between items-center group py-1 transition-colors ${
                    isActive
                      ? "text-[#6d28d9] dark:text-[#a78bfa]"
                      : "text-[var(--text-dark)]"
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    size={20}
                    className={`opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ${isActive ? "text-[#6d28d9] opacity-100" : ""}`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Нижня плашка — адаптована під колір теми */}
        <div className="p-8 pb-12 border-t border-[var(--border-color)] bg-[var(--bg-main)] bg-opacity-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] relative z-20">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] flex items-center justify-center shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-[var(--text-dark)]" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-gray)]">
                    Авторизовано як
                  </span>
                  <span className="text-base font-bold text-[var(--text-dark)] truncate">
                    {user.name}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/profile"
                  onClick={handleProtectedRedirect}
                  className="py-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-center text-[10px] font-black uppercase tracking-widest rounded-xl text-[var(--text-dark)] active:scale-98 transition-transform"
                >
                  Кабінет
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-center text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors active:scale-98 transition-transform"
                >
                  Вийти
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 py-4 border border-[var(--border-color)] text-[var(--text-dark)] text-center text-[10px] font-black uppercase tracking-widest rounded-xl bg-[var(--bg-card)]"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex-1 py-4 bg-[#6d28d9] text-white text-center text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/10"
              >
                Реєстрація
              </Link>
            </div>
          )}

          {/* Системний футер */}
          <div className="mt-6 pt-4 border-t border-[var(--border-color)]/60 flex justify-between items-center text-[9px] text-[var(--text-gray)] font-medium">
            <span className="flex items-center gap-1.5">
              <Mail size={12} /> support@scienceplatform.edu
            </span>
            <span>v1.4.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
