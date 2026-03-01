import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, GraduationCap,
  ShieldCheck, Sun, Moon, User
} from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [theme, toggleTheme] = useDarkMode();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isMobile]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-2 bg-[var(--bg-main)] shadow-lg' : 'py-3 bg-[var(--bg-main)] lg:bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#6d28d9] rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="leading-none flex flex-col">
              <h1 className="text-lg font-black text-[var(--text-dark)]">
                Science
                <span className="hidden lg:inline text-[#6d28d9]">Platform</span>
              </h1>
              <span className="hidden md:block text-[9px] font-bold text-[var(--text-gray)] uppercase opacity-70">
                Academic Ecosystem
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 p-1 bg-[var(--bg-card)]/50 border border-[var(--border-color)] rounded-2xl">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-[var(--text-gray)] hover:text-[#6d28d9]">Програми</Link>
            <Link to="/blog" className="px-4 py-2 text-sm font-bold text-[var(--text-gray)] hover:text-[#6d28d9]">Блог</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-[var(--text-gray)] hover:text-[#6d28d9]">Про нас</Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">

            <button
              onClick={toggleTheme}
              className="hidden xs:flex p-2 sm:p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[#6d28d9] shrink-0"
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#6d28d9] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-black truncate max-w-[60px]">{user.name.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/login" className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[var(--text-dark)] whitespace-nowrap">Увійти</Link>
                <button
                  onClick={() => navigate('/register')}
                  className="hidden sm:block px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black bg-[#6d28d9] text-white rounded-xl"
                >
                  Почати
                </button>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-[var(--purple-light)] text-[#6d28d9] border border-[var(--border-color)] lg:hidden shrink-0"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 top-[56px] z-[90] bg-[var(--bg-main)] transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="p-6 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-black p-2">Програми</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="text-2xl font-black p-2">Блог</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-2xl font-black p-2">Про нас</Link>

          <div className="mt-auto border-t pt-6 flex flex-col gap-4">
            <button onClick={toggleTheme} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-card)] font-bold">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />} Змінити тему
            </button>

            {!user ? (
              <button onClick={() => { navigate('/register'); setIsOpen(false) }} className="w-full py-4 rounded-2xl bg-[#6d28d9] text-white font-black">Створити акаунт</button>
            ) : (
              <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-bold">Вийти</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;