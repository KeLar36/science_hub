import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, GraduationCap,
  User as UserIcon, LayoutDashboard, ShieldCheck, PenTool, BookOpen
} from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-main">
      <div className="nav-container">

        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-icon-bg">
            <GraduationCap size={24} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-title">
              Science<span className="text-purple">Platform</span>
            </span>
            <span className="logo-subtitle">Academic Portal</span>
          </div>
        </Link>

        {isMobile && (
          <div onClick={() => setIsOpen(!isOpen)} className="mobile-toggle">
            {isOpen ? <X size={24} /> : <Menu size={24} className="text-purple" />}
          </div>
        )}

        <div className={`nav-links-wrapper ${isMobile ? 'mobile-menu' : ''} ${isOpen ? 'active' : ''}`}>

          <div className={isMobile ? 'mobile-links-group' : 'main-links'}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
              Програми
            </Link>
            <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={closeMenu}>
              <div className="link-with-icon">
                Блог <BookOpen size={14} className="icon-opacity" />
              </div>
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>
              Про нас
            </Link>

            <div className="role-badges-group">
              {user?.role === 'admin' && (
                <Link to="/admin" className="badge-link admin" onClick={closeMenu}>
                  <LayoutDashboard size={14} /> Адмін
                </Link>
              )}
              {user?.role === 'reviewer' && (
                <Link to="/reviewer" className="badge-link reviewer" onClick={closeMenu}>
                  <ShieldCheck size={14} /> Рецензент
                </Link>
              )}
              {(user?.role === 'content-manager') && (
                <Link to="/content-management" className="badge-link manager" onClick={closeMenu}>
                  <PenTool size={14} /> Контент
                </Link>
              )}
            </div>
          </div>

          <div className={isMobile ? 'mobile-auth-section' : 'auth-section'}>
            {user ? (
              <div className="user-profile-wrapper">
                <Link to="/profile" className="profile-link" onClick={closeMenu}>
                  <div className="avatar-circle">
                    {user.name ? user.name[0].toUpperCase() : <UserIcon size={16} />}
                  </div>
                  <div className="profile-info">
                    <span className="user-name">{user.name}</span>
                    <span className="cabinet-text">Кабінет</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="logout-btn" title="Вийти">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="guest-btns">
                <button onClick={() => { navigate('/login'); closeMenu(); }} className="login-btn">Увійти</button>
                <button onClick={() => { navigate('/register'); closeMenu(); }} className="register-btn">Почати</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && isOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;