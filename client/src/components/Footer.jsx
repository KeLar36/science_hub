import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
} from "lucide-react";
import "../index.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "1.0.1";

  return (
    <footer className="main-footer" data-aos="fade-up" data-aos-offset="0">
      <div className="footer-container">
        <div
          className="footer-section brand-column"
          data-aos="fade-in"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-delay="100"
        >
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <GraduationCap size={24} color="white" />
            </div>
            <div className="footer-logo-text">
              <span className="footer-logo-title">
                Science<span className="text-purple">Platform</span>
              </span>
              <span className="footer-logo-subtitle">Academic Portal</span>
            </div>
          </Link>
          <p className="footer-description">
            Інноваційна система для моніторингу наукових програм та спрощення
            публікацій. Побудовано для майбутнього української науки.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="px-2 py-0.5 mb-1.5 bg-purple-500/10 text-purple-600 text-[10px] font-black rounded border border-purple-500/20 uppercase tracking-widest">
              v {version}
            </span>
          </div>

          <div className="footer-socials">
            <a
              href="https://github.com"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://google.com"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>

        <div
          className="footer-section"
          data-aos="fade-in"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-delay="200"
        >
          <h4 className="footer-heading text-center md:text-left">Навігація</h4>
          <ul className="footer-list">
            <li>
              <Link to="/" className="footer-link">
                Головна
              </Link>
            </li>
            <li>
              <Link to="/blog" className="footer-link">
                Блог
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                Про нас
              </Link>
            </li>
            <li>
              <Link to="/profile" className="footer-link">
                Кабінет
              </Link>
            </li>
          </ul>
        </div>

        <div
          className="footer-section"
          data-aos="fade-in"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-delay="300"
        >
          <h4 className="footer-heading text-center md:text-left">Контакти</h4>
          <ul className="footer-list">
            <li className="footer-contact-item">
              <div className="contact-icon-bg">
                <Mail size={14} />
              </div>
              <span>support@scienceplatform.edu</span>
            </li>
            <li className="footer-contact-item">
              <div className="contact-icon-bg">
                <MapPin size={14} />
              </div>
              <span>м. Київ, пр. Науки, 42</span>
            </li>
            <li className="footer-contact-item">
              <div className="contact-icon-bg">
                <Phone size={14} />
              </div>
              <span>+380 (44) 123-45-67</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="bottom-bar-content">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>&copy; {currentYear} Science Platform. Магістерська робота.</p>
          </div>
          <div className="legal-links">
            <a href="#privacy">Конфіденційність</a>
            <a href="#terms">Умови</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
