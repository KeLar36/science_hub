/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import { ChevronDown, UploadCloud, Send } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const quillStyles = (
  <style>{`
    .ql-toolbar.ql-snow { 
      border: none !important; 
      border-bottom: 1px solid var(--border-color) !important; 
      background: var(--bg-card); 
    }
    .ql-container.ql-snow { 
      border: none !important; 
      min-height: 160px; 
      font-family: inherit; 
    }
    .ql-editor { 
      font-size: 0.85rem; 
      color: var(--text-dark); 
    }
    .ql-editor.ql-blank::before { 
      color: var(--text-gray) !important; 
      font-style: normal; 
      opacity: 0.5; 
    }
  `}</style>
);

export default function SubmissionForm({
  data,
  setData,
  activePrograms = [],
  targetProgram = null,
  targetProgramTitle = "", // 🟢 Отримуємо нові пропси з ProfilePage
  targetProgramType = "", // 🟢 Отримуємо нові пропси з ProfilePage
  onSubmit,
  file,
  setFile,
  domains = [],
}) {
  // Визначаємо поточну програму для кастомізації написів
  const currentProgram = useMemo(() => {
    return (
      targetProgram ||
      activePrograms.find((p) => p._id === data.programId) ||
      null
    );
  }, [targetProgram, activePrograms, data.programId]);

  // Визначаємо тип програми: пріоритет у того, що прийшов з карток деталей
  const programType =
    targetProgramType || currentProgram?.type || "Науковий журнал";

  const contentText = useMemo(() => {
    switch (programType) {
      case "Грант":
        return {
          titleLabel: "Назва грантового проєкту",
          titlePlaceholder: "Введіть повну назву вашого проєкту на грант...",
          descLabel: "Опис та обґрунтування проєкту",
          descPlaceholder:
            "Опишіть актуальність, цілі, структуру витрат бюджету та очікувані результати проєкту...",
          buttonText: "Подати заявку на грант",
        };
      case "Конференція":
        return {
          titleLabel: "Тема доповіді / Тези",
          titlePlaceholder: "Введіть тему вашого виступу або тез...",
          descLabel: "Анотація доповіді (Abstract)",
          descPlaceholder:
            "Напишіть короткий зміст вашої майбутньої доповіді, ключові тези...",
          buttonText: "Зареєструватися на конференцію",
        };
      case "Курс":
        return {
          titleLabel: "Мотиваційний лист / Мета навчання",
          titlePlaceholder: "Чому ви хочете пройти цей курс?",
          descLabel: "Ваш поточний рівень та очікування",
          descPlaceholder:
            "Опишіть свій бекграунд у цій сфері та чого саме очікуєте від навчання...",
          buttonText: "Записатися на курс",
        };
      case "Набір даних":
        return {
          titleLabel: "Назва та призначення датасету",
          titlePlaceholder: "Введіть назву набору даних...",
          descLabel: "Методологія збору та структура даних",
          descPlaceholder:
            "Опишіть, як збиралися дані, які змінні вони містять та яка ліцензія використання...",
          buttonText: "Надіслати набір даних",
        };
      case "Науковий журнал":
      default:
        return {
          titleLabel: "Назва наукової статті",
          titlePlaceholder: "Введіть повну назву вашої статті...",
          descLabel: "Анотація статті (Abstract)",
          descPlaceholder:
            "Напишіть коротку анотацію вашої статті (актуальність, методи, ключові результати)...",
          buttonText: "Надіслати статтю на рецензію",
        };
    }
  }, [programType]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl space-y-5 animate-[fadeIn_0.3s_ease-out]"
    >
      {quillStyles}

      {/* 🟢 КЕЙС 1: Користувач перейшов з конкретної програми — показуємо монолітну плашку-контекст */}
      {targetProgramTitle ? (
        <div className="p-4 bg-purple-500/[0.03] border border-purple-500/15 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-left">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Контекст подачі ({programType})
            </span>
            <h4 className="text-sm font-black text-[var(--text-dark)] uppercase">
              {targetProgramTitle}
            </h4>
          </div>
          {data.domain && (
            <span className="text-[10px] font-mono px-2.5 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-gray)] font-semibold w-fit">
              {data.domain}
            </span>
          )}
        </div>
      ) : (
        /* 🟢 КЕЙС 2: Звичайний режим — користувач зайшов сам з профілю, рендеримо селектор вибору програми */
        activePrograms.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Оберіть програму / журнал
            </label>
            <div className="relative">
              <select
                value={data.programId || ""}
                required
                onChange={(e) =>
                  setData({ ...data, programId: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-dark)] font-semibold appearance-none outline-hidden focus:border-purple-500 transition-colors cursor-pointer"
              >
                <option value="">-- Оберіть зі списку --</option>
                {activePrograms.map((p) => (
                  <option key={p._id} value={p._id}>
                    [{p.type}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
              />
            </div>
          </div>
        )
      )}

      {/* Поле назви статті/матеріалу */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
          {contentText.titleLabel}
        </label>
        <input
          type="text"
          required
          placeholder={contentText.titlePlaceholder}
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-dark)] placeholder:opacity-40 outline-hidden focus:border-purple-500 transition-colors"
        />
      </div>

      {/* 🟢 СЕЛЕКТОР ГАЛУЗІ: Рендеримо його тільки якщо ми НЕ прийшли з конкретної картки програм */}
      {!targetProgramTitle && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
            Наукова галузь / Напрям
          </label>
          <div className="relative">
            <select
              value={data.domain || ""}
              required
              onChange={(e) => setData({ ...data, domain: e.target.value })}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-dark)] font-semibold appearance-none outline-hidden focus:border-purple-500 transition-colors cursor-pointer"
            >
              <option value="" disabled>
                -- Оберіть галузь --
              </option>
              {domains.map((dom, i) => (
                <option key={i} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
            />
          </div>
        </div>
      )}

      {/* Завантаження файлів */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
          Супровідний файл (Документ, Тези, Проєкт)
        </label>
        <label className="flex flex-col items-center justify-center w-full min-h-[110px] bg-[var(--bg-main)] border border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors group p-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloud
              size={24}
              className="text-[var(--text-gray)] opacity-60 group-hover:text-purple-600 transition-colors"
            />
            {file ? (
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 max-w-[280px] truncate">
                  {file.name}
                </p>
                <p className="font-mono text-[9px] text-[var(--text-gray)] opacity-60">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Натисніть, щоб
                  замінити
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[var(--text-dark)]">
                  Перетягніть файл або{" "}
                  <span className="text-purple-600 font-bold">
                    клацніть для пошуку
                  </span>
                </p>
                <p className="font-mono text-[9px] text-[var(--text-gray)] opacity-50 uppercase tracking-wider">
                  PDF, DOCX, ZIP до 15MB
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.zip,.rar"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Текстовий редактор ReactQuill */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
          {contentText.descLabel}
        </label>
        <div className="quill-wrapper rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
          <ReactQuill
            theme="snow"
            value={data.description}
            onChange={(v) => setData({ ...data, description: v })}
            placeholder={contentText.descPlaceholder}
          />
        </div>
      </div>

      {/* Динамічна кнопка відправки */}
      <button
        type="submit"
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 italic shadow-lg shadow-purple-600/10"
      >
        <Send size={14} />
        {contentText.buttonText}
      </button>
    </form>
  );
}
