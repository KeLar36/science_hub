/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, GraduationCap, Sun, Moon, User } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";
import MobileMenu from "./MobileMenu";

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
      console.error("Помилка під час логауту:", error);
    } finally {
      closeMenu();
      navigate("/login");
    }
  };

  const navLinks = [
    { label: "Головна", path: "/" },
    { label: "Програми", path: "/programs" },
    { label: "Архів", path: "/archive" },
    { label: "Блог", path: "/blog" },
    { label: "Про нас", path: "/about" },
    { label: "Правила", path: "/rules" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 text-left ${
        scrolled || isOpen
          ? "bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 group select-none"
        >
          <div className="w-8.5 h-8.5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]/40 flex items-center justify-center transition-all duration-300 group-hover:border-purple-600 group-hover:shadow-sm">
            <GraduationCap
              size={16}
              className="text-[var(--text-dark)] group-hover:text-purple-600 transition-colors"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black tracking-[0.18em] text-[var(--text-dark)] uppercase">
              Science
              {/* Сховається на екранах менше за sm */}
              <span className="text-purple-600 dark:text-purple-400 hidden sm:inline ml-1">
                Platform
              </span>
            </span>
            <span className="text-[7.5px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-0.5">
              Екосистема 2026
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                className={`text-[9px] uppercase tracking-[0.22em] font-black transition-all relative py-1.5 group/link ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-purple-600 dark:bg-purple-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover/link:w-full"}`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/30 text-[var(--text-gray)] hover:text-purple-600 hover:bg-[var(--bg-card)] transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/profile"
                className="w-8.5 h-8.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/40 flex items-center justify-center transition-all hover:border-purple-600 overflow-hidden"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={15} className="text-[var(--text-dark)]" />
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl border border-transparent text-[var(--text-gray)] hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                title="Вийти з системи"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:block text-[9px] font-black uppercase tracking-widest text-[var(--text-dark)] bg-[var(--bg-card)]/60 border border-[var(--border-color)] px-4 py-2 rounded-xl hover:border-purple-600 transition-all shadow-xs"
            >
              Увійти
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/40 text-[var(--text-dark)] transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        closeMenu={closeMenu}
        navLinks={navLinks}
        user={user}
        handleLogout={handleLogout}
        navigate={navigate}
      />
    </nav>
  );
};

export default Navbar;
