/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import RulesHeader from "../components/rules/RulesHeader";
import RulesAccordion from "../components/rules/RulesAccordion";
import VerificationWorkflow from "../components/rules/VerificationWorkflow";
import RulesFaq from "../components/rules/RulesFaq";

const RulesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scanned =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(scanned);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)] transition-colors duration-300 overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <div
        className="fixed top-0 left-0 h-1 bg-purple-600 z-[100] transition-all duration-150 will-change-transform"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-4 md:px-6 relative">
        <div className="absolute inset-0 opacity-25 pointer-events-none z-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-600/[0.02] blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <RulesHeader />

          <RulesAccordion />

          <VerificationWorkflow />

          {/* 4. Блок FAQ */}
          <RulesFaq />

          <div className="rounded-3xl bg-gradient-to-b from-purple-600 to-purple-800 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden text-left">
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">
                Готові розпочати публікацію?
              </h3>
              <p className="text-purple-100 text-xs max-w-md opacity-90 leading-relaxed font-medium">
                Завантажуйте офіційний стартовий пакет метаданих та шаблонів для
                коректного оформлення відкритих датасетів.
              </p>
            </div>
            <button className="relative z-10 flex items-center gap-2.5 bg-white text-purple-700 px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all active:scale-98 shrink-0 shadow-md cursor-pointer">
              <Download size={13} />
              Скачати стартер-пак
            </button>

            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RulesPage;
