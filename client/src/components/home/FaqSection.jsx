import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Хто може подавати заявки на фінансування?",
    a: "Подавати заявки можуть індивідуальні дослідники, аспіранти, докторанти, а також офіційні представники університетів та науково-дослідних інститутів України, які пройшли верифікацію профілю.",
  },
  {
    q: "Які документи потрібні для реєстрації організації?",
    a: "Для реєстрації юридичної особи необхідно вказати офіційну назву, організаційно-правову форму, місто базування та дійсний код ЄДРПОУ. Заявка проходить ручну модерацію суперадміном протягом 24 годин.",
  },
  {
    q: "Чи є платформа безкоштовною для науковців?",
    a: "Так, Open Science Platform є абсолютно безкоштовним агрегатором відкритих грантових можливостей у рамках європейських програм інтеграції української науки.",
  },
  {
    q: "Як стати незалежним рецензентом проєктів?",
    a: "Подайте заявку через особистий кабінет користувача, прикріпивши посилання на ваш профіль в Scopus або Google Scholar. Після перевірки наукового ступеня вам нададуть статус експерта.",
  },
];

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[var(--bg-main)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-600/10 px-3 py-1 rounded-full">
            Часті запитання
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-dark)] mt-3">
            Залишилися <span className="text-purple-600">запитання?</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wide text-[var(--text-dark)] hover:bg-purple-600/[0.01] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-purple-600" />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-[var(--text-gray)]"
                    />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-40 border-t border-[var(--border-color)]" : "max-h-0"}`}
                >
                  <p className="p-5 text-[11px] font-semibold text-[var(--text-gray)] leading-relaxed bg-purple-600/[0.01]">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
