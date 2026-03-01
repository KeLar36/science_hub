import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, GraduationCap,
  LayoutDashboard, ShieldCheck,
  Sun, Moon, CircleFadingPlus, User
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

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl
        ${location.pathname === to
          ? 'text-[#6d28d9] bg-purple-50 dark:bg-purple-900/20'
          : 'text-[var(--text-gray)] hover:text-[#6d28d9]'}`}
    >
      {children}
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500
      ${scrolled
          ? 'py-2 bg-[var(--bg-main)] backdrop-blur-xl border-b border-[var(--border-color)] shadow-md'
          : 'py-4 bg-[var(--bg-main)] lg:bg-transparent border-b border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">

          <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 bg-[#6d28d9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:rotate-6 transition-transform">
              <GraduationCap size={24} color="white" />
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-black tracking-tight text-[var(--text-dark)]">
                Science<span className="text-[#6d28d9]">Platform</span>
              </h1>
              <span className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-tighter opacity-70">
                Academic Ecosystem
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 p-1 bg-[var(--bg-card)]/50 border border-[var(--border-color)] rounded-2xl">
            <NavLink to="/">Програми</NavLink>
            <NavLink to="/blog">Блог</NavLink>
            <NavLink to="/about">Про нас</NavLink>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[#6d28d9] transition-all"
            >
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <div className="flex items-center gap-1.5 mr-1">
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <Link to="/admin" className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ShieldCheck size={20} className="text-[#6d28d9]" />
                      </Link>
                    )}
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#6d28d9] transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#6d28d9] text-white flex items-center justify-center font-bold text-sm">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-black text-[var(--text-dark)] leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-[9px] font-bold text-[#6d28d9] uppercase">{user.role}</p>
                  </div>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="hidden sm:block px-6 py-2.5 text-sm font-black bg-[#6d28d9] text-white rounded-xl shadow-lg shadow-purple-500/25"
              >
                Почати
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 
    ${isOpen
                  ? 'bg-[#6d28d9] text-white shadow-lg shadow-purple-500/30'
                  : 'bg-[var(--purple-light)] text-[#6d28d9] border border-[var(--border-color)] hover:bg-[#6d28d9] hover:text-white'
                }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[72px] z-[90] bg-[var(--bg-main)] transition-all duration-500 lg:hidden
        ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        style={{ height: 'calc(100vh - 72px)' }}
      >
        <div className="p-6 flex flex-col gap-6 bg-[var(--bg-main)] h-full border-t border-[var(--border-color)]">
          <div className="grid grid-cols-1 gap-2">
            <p className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest px-4">Меню</p>
            <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-black text-[var(--text-dark)] p-4">Програми</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="text-3xl font-black text-[var(--text-dark)] p-4">Блог</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-3xl font-black text-[var(--text-dark)] p-4">Про нас</Link>
          </div>

          {user && (
            <div className="mt-auto pb-10 space-y-4 border-t border-[var(--border-color)] pt-6">
              <div className="grid grid-cols-2 gap-3 px-4">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-4 rounded-xl bg-[var(--bg-card)] font-bold">
                  <User size={20} /> Профіль
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-bold">
                  <LogOut size={20} /> Вийти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;