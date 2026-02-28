import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, GraduationCap,
  User as UserIcon, LayoutDashboard, ShieldCheck, PenTool, BookOpen, ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

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

  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`nav-main ${scrolled ? 'nav-scrolled' : ''} ${isOpen ? 'nav-open' : ''}`}>
      <div className="nav-container">
        
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-icon-bg">
            <GraduationCap  size={24} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Science<span className="text-purple">Platform</span></span>
            <span className="logo-subtitle">Academic Portal</span>
          </div>
        </Link>

        {isMobile && (
          <button onClick={() => setIsOpen(!isOpen)} className="mobile-toggle" aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}

        <div className={`nav-links-wrapper ${isOpen ? 'active' : ''}`}>
          <div className="nav-links-inner">
            
            <div className="main-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
                Програми
              </Link>
              <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={closeMenu}>
                Блог
              </Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>
                Про нас
              </Link>
            </div>

            <div className="divider" />

            <div className="auth-section">
              {user ? (
                <div className="user-profile-group">
                  <Link to="/profile" className="profile-card" onClick={closeMenu}>
                    <div className="avatar">
                      {user.name ? user.name[0].toUpperCase() : <UserIcon size={18} />}
                    </div>
                    <div className="profile-meta">
                      <span className="user-name">{user.name}</span>
                      <span className="user-role">{user.role}</span>
                    </div>
                    <ChevronRight size={16} className="mobile-only-icon" />
                  </Link>
                  
                  <div className="role-actions">
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="badge-link admin" onClick={closeMenu}>
                        <LayoutDashboard size={16} /> Адмін
                      </Link>
                    )}
                    {user?.role === 'reviewer' && (
                      <Link to="/reviewer" className="badge-link reviewer" onClick={closeMenu}>
                        <ShieldCheck size={16} /> Рецензент
                      </Link>
                    )}
                  </div>

                  <button onClick={handleLogout} className="logout-btn-new">
                    <LogOut size={18} />
                    <span>Вийти</span>
                  </button>
                </div>
              ) : (
                <div className="guest-group">
                  <button onClick={() => { navigate('/login'); closeMenu(); }} className="btn-secondary">Увійти</button>
                  <button onClick={() => { navigate('/register'); closeMenu(); }} className="btn-primary">Почати</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;