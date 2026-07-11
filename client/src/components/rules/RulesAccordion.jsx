import React from "react";
import {
  ShieldCheck,
  Database,
  Scale,
  Fingerprint,
  FileCode,
  CheckCircle2,
  Network,
  Key,
  FileSpreadsheet,
  FileLock2,
} from "lucide-react";

const RulesAccordion = () => {
  const sections = [
    {
      title: "01 / Академічні та Рецензійні Протоколи",
      subtitle: "Нормативна база доброчесності та Double-Blind скринінгу",
      icon: <ShieldCheck size={22} />,
      bgClass: "bg-gradient-to-br from-[var(--bg-card)] to-purple-600/[0.01]",
      rules: [
        {
          icon: <Scale size={14} className="text-purple-600" />,
          label: "Суворий контроль плагіату (Anti-Plagiarism)",
          text: "Кожен текстовий файл, опис програми чи анотація автоматично проходять скрізь алгоритми внутрішнього скринінгу. Мінімально допустимий поріг унікальності для публікації — 85%. Будь-які форми штучного роздування тексту чи маніпуляцій з символами караються блокуванням.",
        },
        {
          icon: <Fingerprint size={14} className="text-purple-600" />,
          label: "Політика Відкритого Доступу (Open Access & CC)",
          text: "Депонуючи наукові журнали, датасети чи матеріали конференцій, автори безповоротно погоджуються на їх поширення під вільними ліцензіями Creative Commons (зокрема CC-BY 4.0). Це дозволяє спільноті вільно читати, копіювати та цитувати матеріали із зазначенням авторства.",
        },
        {
          icon: <CheckCircle2 size={14} className="text-purple-600" />,
          label: "Двостороннє Сліпе Рецензування (Double-Blind)",
          text: "Для забезпечення абсолютної незалежності оцінки, рецензування грантових заявок та статей координується модераторами в анонімному режимі. Рецензент не знає імені автора, а автор не знає, хто проводить експертизу матеріалу.",
        },
      ],
    },
    {
      title: "02 / Технічний Регламент та FAIR-Стандарти",
      subtitle: "Архітектура метаданих, цифрова валідація та депонування",
      icon: <Database size={22} />,
      bgClass: "bg-gradient-to-br from-[var(--bg-card)] to-indigo-600/[0.01]",
      rules: [
        {
          icon: <FileCode size={14} className="text-indigo-500" />,
          label: "Машиночитаність та Принципи FAIR",
          text: "Усі завантажені структуровані набори даних (датасети) повинні відповідати міжнародним стандартам FAIR: Findable (доступні для пошуку), Accessible (доступні за лінком), Interoperable (сумісні через API) та Reusable (придатні для повторного використання).",
        },
        {
          icon: <FileSpreadsheet size={14} className="text-indigo-500" />,
          label: "Обов'язкове DOI та УДК Маркування",
          text: "Подача матеріалу вимагає заповнення розширених метаданих: індексів УДК, міжнародних ідентифікаторів DOI (за наявності), а також дублювання основних тегів, списку літератури (APA/ДСТУ) та розгорнутої анотації англійською мовою.",
        },
        {
          icon: <FileLock2 size={14} className="text-indigo-500" />,
          label: "Верифікація Організацій за кодом ЄДРПОУ",
          text: "Публікація офіційного контенту, грантових програм чи фахових журналів від імені закладу вищої освіти (ЗВО) або НДІ дозволена строго після успішної цифрової верифікації профілю та синхронізації з державним реєстром ЄДРПОУ.",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left w-full relative z-10">
      {sections.map((section, idx) => (
        <div
          key={idx}
          className={`border border-[var(--border-color)] ${section.bgClass} rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-purple-600 dark:hover:border-purple-400 hover:shadow-xl hover:shadow-purple-600/[0.02] transition-all duration-300 relative overflow-hidden`}
        >
          {/* Декоративний великий фоновий індекс блоку */}
          <div className="absolute -right-4 -top-6 text-[120px] font-black font-mono text-purple-600/[0.02] select-none pointer-events-none">
            0{idx + 1}
          </div>

          <div>
            {/* Шапка картки регламенту */}
            <div className="flex items-center gap-4 border-b border-[var(--border-color)]/60 pb-6 mb-6">
              <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] text-purple-600 dark:text-purple-400 rounded-xl shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                {section.icon}
              </div>
              <div>
                <h2 className="text-md font-black uppercase tracking-tight text-[var(--text-dark)]">
                  {section.title}
                </h2>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-gray)] mt-0.5 font-bold">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Щільний список жорстко виведених правил (контент одразу на екрані) */}
            <div className="space-y-6">
              {section.rules.map((rule, rIdx) => (
                <div key={rIdx} className="flex gap-4 items-start group/item">
                  <div className="mt-1 p-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg shrink-0 transform group-item-hover:scale-110 transition-transform">
                    {rule.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] block font-black uppercase tracking-wider text-[var(--text-dark)]">
                      {rule.label}
                    </span>
                    <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                      {rule.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RulesAccordion;
