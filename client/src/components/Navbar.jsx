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
  ArrowRight,
  User,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useDarkMode();
  const user = JSON.parse(localStorage.getItem("user"));

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    closeMenu();
  };

  const navLinks = [
    { label: "Програми", path: "/" },
    { label: "Блог", path: "/blog" },
    { label: "Про нас", path: "/about" },
    { label: "Правила", path: "/rules" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-[var(--bg-main)] shadow-xl border-b border-[var(--border-color)] py-4"
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between relative z-[110]">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 border border-[var(--border-color)] flex items-center justify-center transition-all group-hover:border-[var(--purple-main)]">
              <GraduationCap
                size={20}
                className="text-[var(--text-dark)] group-hover:text-[var(--purple-main)]"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-[0.2em] text-[var(--text-dark)] uppercase">
                Science
                <span className="text-[var(--purple-main)]">Platform</span>
              </span>
              <span className="text-[8px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-1">
                Екосистема 2026
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className={`text-[10px] uppercase tracking-[0.25em] font-black transition-all relative py-1 ${
                  location.pathname === link.path
                    ? "text-[var(--purple-main)]"
                    : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 ">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-gray)] hover:text-[var(--purple-main)]"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="w-8 h-8 rounded-full border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] flex items-center justify-center"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={14} />
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden lg:block text-[var(--text-gray)] hover:text-rose-500"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-[var(--text-dark)]"
              >
                Увійти
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-[var(--text-dark)]"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-[var(--bg-main)] z-[105] transition-all duration-500 ease-in-out lg:hidden ${
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="h-full flex flex-col-reverse pt-32 justify-end pb-10 px-8 overflow-y-auto">
          <div className="flex flex-col gap-8 items-center">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={closeMenu}
                className={`text-2xl font-black uppercase tracking-tighter flex justify-between items-center ${
                  location.pathname === link.path
                    ? "text-[var(--purple-main)]"
                    : "text-[var(--text-dark)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-10 space-y-4">
            {user ? (
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
                <p className="text-[10px] font-black text-[var(--text-gray)] text-center uppercase tracking-widest mb-1">
                  Вітаємо,
                </p>
                <p className="text-xl font-bold text-[var(--text-dark)] text-center mb-4">
                  {user.name}
                </p>
                <div className="flex justify-center  gap-4">
                  <button
                    onClick={handleLogout}
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500"
                  >
                    Вийти
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full py-5 bg-[var(--purple-main)] text-white text-center text-[10px] font-black uppercase tracking-widest rounded-2xl"
                >
                  Реєстрація
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full py-5 border border-[var(--border-color)] text-[var(--text-dark)] text-center text-[10px] font-black uppercase tracking-widest rounded-2xl"
                >
                  Увійти
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
