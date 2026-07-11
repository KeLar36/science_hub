import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  FileText,
  Mail,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "./ui/Button";

const MobileMenu = ({
  isOpen,
  closeMenu,
  navLinks,
  user,
  handleLogout,
  navigate,
}) => {
  return (
    <div
      className={`fixed inset-0 h-[100dvh] bg-[var(--bg-main)] flex flex-col justify-between transition-all duration-500 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100 visible z-[99999]"
          : "-translate-y-full opacity-0 invisible z-[-1]"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between border-b border-[var(--border-color)]/40 bg-[var(--bg-main)] z-[100000]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[var(--text-dark)]">
            меню навігації
          </span>
        </div>
        <Button
          variant="secondary"
          onClick={closeMenu}
          className="p-2.5 rounded-xl text-[var(--text-dark)] bg-[var(--bg-card)] border border-[var(--border-color)] hover:text-rose-500 transition-colors"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Список лінків */}
      <div className="flex-1 overflow-y-auto pt-24 px-8 pb-6 space-y-8">
        <div className="flex flex-col gap-5 text-left">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={closeMenu}
              className="text-2xl font-black uppercase tracking-tight flex justify-between items-center group py-0.5 text-[var(--text-dark)]"
            >
              <span>{link.label}</span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 transition-all"
              />
            </Link>
          ))}
        </div>

        {user &&
          ["superadmin", "reviewer", "content-manager"].includes(user.role) && (
            <div className="pt-4 space-y-2 text-left">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-gray)] border-b border-[var(--border-color)] pb-2 mb-2">
                Керування системними ролями
              </p>
              {user.role === "superadmin" && (
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/superadmin");
                  }}
                  className="w-full px-4 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic flex items-center gap-2.5 cursor-pointer"
                >
                  <ShieldAlert size={14} /> SuperAdmin Панель
                </button>
              )}
              {(user.role === "superadmin" || user.role === "reviewer") && (
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/reviewer");
                  }}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic flex items-center gap-2.5 cursor-pointer"
                >
                  <FileCheck size={14} /> Панель рецензента
                </button>
              )}
              {(user.role === "superadmin" ||
                user.role === "content-manager") && (
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/content-panel");
                  }}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic flex items-center gap-2.5 cursor-pointer"
                >
                  <FileText size={14} /> Менеджер контенту
                </button>
              )}
            </div>
          )}
      </div>

      <div className="p-8 pb-10 border-t border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-md">
        {user && user.name ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-9 h-9 rounded-xl border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-main)] font-bold text-xs text-[var(--text-dark)]">
                <User size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                  Кабінет
                </span>
                <span className="text-sm font-bold text-[var(--text-dark)] truncate max-w-[150px]">
                  {user.name}
                </span>
              </div>
            </Link>
            <Button
              variant="danger"
              onClick={handleLogout}
              className="py-3 px-5 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut size={12} /> Вийти
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/login"
              onClick={closeMenu}
              className="py-3.5 border border-[var(--border-color)] text-[var(--text-dark)] text-center text-[9px] font-black uppercase tracking-widest rounded-xl bg-[var(--bg-main)]"
            >
              Увійти
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="py-3.5 bg-[#6d28d9] text-white text-center text-[9px] font-black uppercase tracking-widest rounded-xl"
            >
              Реєстрація
            </Link>
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]/50 flex justify-between items-center text-[8px] text-[var(--text-gray)] font-bold tracking-wide">
          <span className="flex items-center gap-1">
            <Mail size={10} className="text-purple-600" />{" "}
            support@scienceplatform.edu
          </span>
          <span>v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
