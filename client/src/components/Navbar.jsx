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
  ShieldAlert,
  FileCheck,
  FileText,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useDarkMode();

  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

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

          <div className="flex justify-center items-center gap-2">
            <Button
              variant="secondary"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-transparent text-[var(--text-gray)] hover:text-[#6d28d9] hover:bg-[var(--bg-card)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] flex items-center justify-center transition-all hover:border-[#6d28d9]"
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

                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-[var(--text-gray)] hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300"
                  title="Вийти з акаунту"
                >
                  <LogOut size={16} />
                </Button>
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

            <Button
              variant="secondary"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[var(--text-dark)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Спрощене та оптимізоване мобільне меню */}
      <div
        className={`fixed inset-0 h-[100dvh] bg-[var(--bg-main)] flex flex-col justify-between transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 visible z-[99999]"
            : "-translate-y-full opacity-0 invisible z-[-1]"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between border-b border-[var(--border-color)]/40 bg-[var(--bg-main)] z-[100000]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--border-color)] rounded-lg flex items-center justify-center bg-[var(--bg-card)]">
              <GraduationCap size={16} className="text-[#6d28d9]" />
            </div>
            <span className="text-xs font-black tracking-widest text-[var(--text-dark)] uppercase"></span>
          </div>

          <Button
            variant="secondary"
            onClick={closeMenu}
            className="p-2.5 rounded-xl text-[var(--text-dark)] bg-[var(--bg-card)] border border-[var(--border-color)] hover:text-rose-500 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pt-24 px-8 pb-6 space-y-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-gray)] border-b border-[var(--border-color)] pb-2">
            Навігація по екосистемі
          </p>

          <div className="flex flex-col gap-5">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-2xl font-black uppercase tracking-tight flex justify-between items-center group py-0.5 transition-colors ${
                    isActive
                      ? "text-[#6d28d9] dark:text-[#a78bfa]"
                      : "text-[var(--text-dark)]"
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    size={18}
                    className={`opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ${isActive ? "text-[#6d28d9] opacity-100" : ""}`}
                  />
                </Link>
              );
            })}
          </div>

          {user &&
            (user.role === "superadmin" ||
              user.role === "reviewer" ||
              user.role === "content-manager") && (
              <div className="pt-4 space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-gray)] border-b border-[var(--border-color)] pb-2 mb-1">
                  Термінали керування
                </p>

                {user.role === "superadmin" && (
                  <button
                    onClick={() => {
                      closeMenu();
                      navigate("/superadmin");
                    }}
                    className="w-full px-4 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic transition-all active:scale-98 flex items-center gap-2.5 shadow-md shadow-amber-500/10"
                  >
                    <ShieldAlert size={14} /> SuperAdmin Панель
                  </button>
                )}

                {(user.role === "superadmin" || user.role === "reviewer") && (
                  <button
                    onClick={() => {
                      closeMenu();
                      navigate("/reviewer");
                    }}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic transition-all active:scale-98 flex items-center gap-2.5 shadow-md shadow-purple-600/10"
                  >
                    <FileCheck size={14} /> Панель рецензента
                  </button>
                )}

                {(user.role === "superadmin" ||
                  user.role === "content-manager") && (
                  <button
                    onClick={() => {
                      closeMenu();
                      navigate("/content-panel");
                    }}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic transition-all active:scale-98 flex items-center gap-2.5 shadow-md shadow-purple-600/10"
                  >
                    <FileText size={14} /> Менеджер контенту
                  </button>
                )}
              </div>
            )}
        </div>

        <div className="p-8 pb-10 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-md">
          {user ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center gap-3 group min-w-0"
              >
                <div className="w-9 h-9 rounded-xl border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-main)] shrink-0 font-bold text-xs text-[var(--text-dark)] group-hover:border-[#6d28d9] transition-colors">
                  <User size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                    Кабінет
                  </span>
                  <span className="text-sm font-bold text-[var(--text-dark)] truncate">
                    {user.name}
                  </span>
                </div>
              </Link>

              <Button
                variant="danger"
                onClick={handleLogout}
                className="py-3 px-5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={12} /> Вийти з системи
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="py-3.5 border border-[var(--border-color)] text-[var(--text-dark)] text-center text-[9px] font-black uppercase tracking-widest rounded-xl bg-[var(--bg-main)] hover:border-[#6d28d9] transition-colors"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="py-3.5 bg-[#6d28d9] text-white text-center text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/10"
              >
                Реєстрація
              </Link>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[var(--border-color)]/50 flex justify-between items-center text-[8px] text-[var(--text-gray)] font-bold tracking-wide">
            <span className="flex items-center gap-1">
              <Mail size={10} className="text-[#6d28d9]" />{" "}
              support@scienceplatform.edu
            </span>
            <span>v2.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
