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
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-28 pb-12 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-[#6d28d9] opacity-[0.03] dark:opacity-[0.05] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 border border-[var(--border-color)] rounded-xl flex items-center justify-center bg-[var(--bg-card)] group-hover:border-[#6d28d9] group-hover:shadow-lg group-hover:shadow-purple-500/5 transition-all duration-500">
                <GraduationCap
                  size={22}
                  className="text-[var(--text-dark)] group-hover:text-[#6d28d9] transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl font-black tracking-tighter text-[var(--text-dark)] leading-none uppercase">
                  Science{" "}
                  <span className="text-[#6d28d9] dark:text-[#a78bfa] italic font-light lowercase">
                    Platform
                  </span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--text-gray)] mt-1.5 font-black">
                  Innovating Research
                </span>
              </div>
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-[var(--text-gray)] font-medium max-w-sm">
              Цифрова екосистема для моніторингу наукових грантів, управління
              відкритими даними та автоматизації публікацій. Створено для
              трансформації академічної спільноти.
            </p>

            <div className="flex gap-3 items-center justify-center lg:justify-start pt-2">
              {[
                { icon: <Github size={16} />, href: "https://github.com" },
                { icon: <Linkedin size={16} />, href: "https://linkedin.com" },
                { icon: <Globe size={16} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]/50 backdrop-blur-xs flex items-center justify-center text-[var(--text-gray)] hover:text-white hover:bg-[#6d28d9] hover:border-[#6d28d9] hover:shadow-md hover:shadow-purple-500/15 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-start">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#6d28d9] rounded-xs rotate-45"></span>
              Навігація
            </h4>
            <ul className="space-y-3.5 text-center lg:text-left w-full">
              {[
                { label: "Головна", path: "/" },
                { label: "Про проєкт", path: "/about" },
                { label: "Блог / Новини", path: "/blog" },
                { label: "Кабінет", path: "/profile" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors inline-flex items-center justify-center lg:justify-between gap-4 w-full max-w-[140px] lg:max-w-none"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#6d28d9] transition-all duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-start">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#6d28d9] rounded-xs rotate-45"></span>
              Можливості
            </h4>
            <ul className="space-y-3.5 text-center lg:text-left w-full">
              {[
                { label: "Пошук Грантів", path: "/grants" },
                { label: "Аналітика публікацій", path: "/analytics" },
                { label: "Рецензування", path: "/review" },
                { label: "База знань", path: "/docs" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors inline-flex items-center justify-center lg:justify-between gap-4 w-full max-w-[140px] lg:max-w-none"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#6d28d9] transition-all duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Секція Зв'язку (4 колонки) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-dark)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#6d28d9] rounded-xs rotate-45"></span>
              Контакти
            </h4>
            <ul className="space-y-6 w-full flex flex-col items-center lg:items-start">
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-center shrink-0">
                  <Mail
                    size={14}
                    className="text-[#6d28d9] dark:text-[#a78bfa]"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-gray)] mb-1">
                    Support & Help Desk
                  </p>
                  <a
                    href="mailto:support@scienceplatform.edu"
                    className="text-sm text-[var(--text-dark)] font-bold hover:text-[#6d28d9] transition-colors"
                  >
                    support@scienceplatform.edu
                  </a>
                </div>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]/50 flex items-center justify-center shrink-0">
                  <MapPin
                    size={14}
                    className="text-[#6d28d9] dark:text-[#a78bfa]"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-gray)] mb-1">
                    Розробка та координація
                  </p>
                  <span className="text-sm text-[var(--text-dark)] font-medium italic">
                    Україна
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижня панель копірайту та юридичних лінків */}
        <div className="pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[10px] font-black text-[var(--text-gray)] uppercase tracking-[0.2em] text-center md:text-left">
            <span>&copy; {currentYear} Science Platform</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md">
              <span className="w-1.5 h-1.5 bg-[#6d28d9] rotate-45" />
              <span className="text-[9px] text-[var(--text-dark)] font-black uppercase tracking-wider opacity-80">
                Магістерська робота
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            {[
              {
                text: "Конфіденційність",
                hash: "privacy",
                icon: <Shield size={11} />,
              },
              {
                text: "Умови використання",
                hash: "terms",
                icon: <FileText size={11} />,
              },
            ].map((item) => (
              <a
                key={item.text}
                href={`#${item.hash}`}
                className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest hover:text-[var(--text-dark)] transition-colors relative group flex items-center gap-2"
              >
                <span className="text-[var(--text-gray)] opacity-40 group-hover:text-[#6d28d9] transition-colors">
                  {item.icon}
                </span>
                <span>{item.text}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#6d28d9] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
