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
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--purple-main)] opacity-[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24 items-center lg:items-start text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start space-y-10 max-w-sm">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-[var(--border-color)] flex items-center justify-center group-hover:border-[var(--purple-main)] transition-colors duration-500">
                <GraduationCap
                  size={20}
                  className="text-[var(--text-dark)] group-hover:text-[var(--purple-main)] transition-colors"
                />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl font-medium tracking-tighter text-[var(--text-dark)] leading-none">
                  Science{" "}
                  <span className="text-[var(--purple-main)]">Platform</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-gray)] mt-1 font-bold">
                  Innovating Research
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[var(--text-gray)] font-normal opacity-80">
              Цифрова екосистема для моніторингу наукових грантів та
              автоматизації публікацій. Створено для розвитку академічної
              спільноти.
            </p>

            <div className="flex gap-4 items-center justify-center lg:justify-start">
              {[
                { icon: <Github size={18} />, href: "#" },
                { icon: <Linkedin size={18} />, href: "#" },
                { icon: <Globe size={18} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-gray)] hover:text-[var(--purple-main)] hover:border-[var(--purple-main)] transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start space-y-8 min-w-[150px]">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dark)] flex items-center gap-2">
              <span className="hidden lg:block w-4 h-px bg-[var(--purple-main)]"></span>
              Навігація
              <span className="lg:hidden w-4 h-px bg-[var(--purple-main)]"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Головна", path: "/" },
                { label: "Про нас", path: "/about" },
                { label: "Блог", path: "/blog" },
                { label: "Кабінет", path: "/profile" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-sm text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors flex items-center justify-center lg:justify-between gap-2 lg:gap-8"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 group-hover:text-[var(--purple-main)] transition-all -translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dark)] flex items-center gap-2">
              <span className="hidden lg:block w-4 h-px bg-[var(--purple-main)]"></span>
              Зв'язок
              <span className="lg:hidden w-4 h-px bg-[var(--purple-main)]"></span>
            </h4>
            <ul className="space-y-8">
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                <Mail
                  size={16}
                  className="text-[var(--purple-main)] shrink-0"
                />
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-gray)] mb-1">
                    Електронна пошта
                  </p>
                  <a
                    href="mailto:support@scienceplatform.edu"
                    className="text-sm text-[var(--text-dark)] font-medium hover:text-[var(--purple-main)] transition-colors"
                  >
                    support@scienceplatform.edu
                  </a>
                </div>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                <MapPin
                  size={16}
                  className="text-[var(--purple-main)] shrink-0"
                />
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-gray)] mb-1">
                    Локація
                  </p>
                  <span className="text-sm text-[var(--text-dark)] font-medium italic">
                    Київ, вул. Головна, буд. 1, Україна
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-[0.2em] text-center md:text-left">
            <span>&copy; {currentYear} Science Platform</span>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[var(--purple-main)] rotate-45" />
              <span className="text-[var(--text-dark)] opacity-60  normal-case font-medium">
                Магістерська робота
              </span>
            </div>
          </div>

          <div className="flex gap-10">
            {["Конфіденційність", "Умови"].map((item) => (
              <a
                key={item}
                href={`#${item === "Умови" ? "terms" : "privacy"}`}
                className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest hover:text-[var(--purple-main)] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--purple-main)] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
