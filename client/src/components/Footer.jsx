import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  ArrowUpRight,
  Shield,
  FileText,
  Boxes,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-24 pb-12 px-6 relative overflow-hidden text-left">
      {/* Велике фірмове фіолетове світіння внизу сторінки */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-purple-600 opacity-[0.03] dark:opacity-[0.05] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ГОЛОВНА СІТКА ФУТЕРА */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Блок 1: Логотип та бренд (4 колонки) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link
              to="/"
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="w-10 h-10 border border-[var(--border-color)] rounded-xl flex items-center justify-center bg-[var(--bg-card)]/50 group-hover:border-purple-600 group-hover:shadow-sm transition-all duration-300">
                <GraduationCap
                  size={20}
                  className="text-[var(--text-dark)] group-hover:text-purple-600 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-[0.18em] text-[var(--text-dark)] uppercase">
                  Science
                  <span className="text-purple-600 dark:text-purple-400 ml-1">
                    Platform
                  </span>
                </span>
                <span className="text-[7.5px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-1">
                  Екосистема відкритої науки
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-[var(--text-gray)] font-medium max-w-sm">
              Єдина цифрова інфраструктура для верифікації наукових установ,
              моніторингу міжнародних грантів, публікації відкритих датасетів та
              рецензування журналів.
            </p>

            {/* Соціальні мережі */}
            <div className="flex gap-2.5 items-center pt-2">
              {[
                { icon: <Github size={15} />, href: "https://github.com" },
                { icon: <Linkedin size={15} />, href: "https://linkedin.com" },
                { icon: <Globe size={15} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]/50 backdrop-blur-xs flex items-center justify-center text-[var(--text-gray)] hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 shadow-xs"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Блок 2: Навігація по сайту (2 колонки) */}
          <div className="lg:col-span-2 space-y-5 flex flex-col items-center lg:items-start">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-xs rotate-45"></span>
              Навігація
            </h4>
            <ul className="space-y-3 text-center lg:text-left w-full">
              {[
                { label: "Головна сторінка", path: "/" },
                { label: "Про проєкт", path: "/about" },
                { label: "Блог та Новини", path: "/blog" },
                { label: "Правила хабу", path: "/rules" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-[11px] font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors inline-flex items-center justify-center lg:justify-between gap-3 w-full max-w-[150px] lg:max-w-none"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-purple-600 transition-all duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Блок 3: Нові розширені можливості Open Science (3 колонки) */}
          <div className="lg:col-span-3 space-y-5 flex flex-col items-center lg:items-start">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-xs rotate-45"></span>
              Компоненти
            </h4>
            <ul className="space-y-3 text-center lg:text-left w-full">
              {[
                { label: "Наукові Гранти", path: "/" },
                { label: "Фахові Видання", path: "/" },
                { label: "Міжнародні Конференції", path: "/" },
                { label: "Профільні Курси", path: "/" },
                { label: "Відкриті Датасети", path: "/" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group text-[11px] font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors inline-flex items-center justify-center lg:justify-between gap-3 w-full max-w-[180px] lg:max-w-none"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-purple-600 transition-all duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Блок 4: Контакти та Фізична Локація (3 колонки) */}
          <div className="lg:col-span-3 space-y-5 flex flex-col items-center lg:items-start">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-xs rotate-45"></span>
              Контакти
            </h4>
            <ul className="space-y-4 w-full flex flex-col items-center lg:items-start">
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                <div className="w-8 h-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-center shrink-0">
                  <Mail
                    size={13}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-gray)] font-mono">
                    Help Desk Support
                  </p>
                  <a
                    href="mailto:support@scienceplatform.edu"
                    className="text-xs text-[var(--text-dark)] font-bold hover:text-purple-600 transition-colors mt-0.5"
                  >
                    support@scienceplatform.edu
                  </a>
                </div>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                <div className="w-8 h-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-center shrink-0">
                  <MapPin
                    size={13}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-gray)] font-mono">
                    Координація проєкту
                  </p>
                  <span className="text-xs text-[var(--text-dark)] font-bold mt-0.5">
                    Ужгород, Україна
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* НИЖНЯ ПАНЕЛЬ: Копірайт, юридичні лінки, відмітка роботи */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-[10px] font-black text-[var(--text-gray)] uppercase tracking-[0.18em] text-center md:text-left">
            <span>&copy; {currentYear} Science Platform</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xs">
              <Boxes size={12} className="text-purple-600" />
              <span className="text-[8.5px] text-[var(--text-dark)] font-black uppercase tracking-wider opacity-85 font-mono">
                Магістерська дисертація
              </span>
            </div>
          </div>

          {/* Політики конфіденційності */}
          <div className="flex gap-6">
            {[
              {
                text: "Конфіденційність",
                hash: "privacy",
                icon: <Shield size={12} />,
              },
              {
                text: "Умови використання",
                hash: "terms",
                icon: <FileText size={12} />,
              },
            ].map((item) => (
              <a
                key={item.text}
                href={`#${item.hash}`}
                className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest hover:text-[var(--text-dark)] transition-colors relative group flex items-center gap-1.5"
              >
                <span className="text-[var(--text-gray)] opacity-50 group-hover:text-purple-600 transition-colors">
                  {item.icon}
                </span>
                <span>{item.text}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
