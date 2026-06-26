import React from "react";
import ReactQuill from "react-quill-new";
import { ChevronDown, UploadCloud, Send } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

export default function SubmissionForm({
  data,
  setData,
  activePrograms = [],
  onSubmit,
  file,
  setFile,
  domains = [],
}) {
  const currentProgram = activePrograms.find((p) => p._id === data.programId);
  const programType = currentProgram?.type || "Науковий журнал"; // дефолтне значення

  const getLabelsAndPlaceholders = () => {
    switch (programType) {
      case "Грант":
        return {
          titleLabel: "Назва грантового проєкту",
          titlePlaceholder: "Введіть повну назву вашого проєкту на грант...",
          descLabel: "Опис та обґрунтування проєкту",
          descPlaceholder:
            "Опишіть актуальність, цілі, структуру витрат бюджету та очікувані результати проєкту...",
        };
      case "Конференція":
        return {
          titleLabel: "Назва доповіді / Тез",
          titlePlaceholder: "Введіть тему вашого виступу або тез...",
          descLabel: "Анотація доповіді (Abstract)",
          descPlaceholder:
            "Напишіть короткий зміст вашої майбутньої доповіді, ключові питання та методологію...",
        };
      case "Курс":
        return {
          titleLabel: "Мотиваційна тема / Напрям",
          titlePlaceholder: "Введіть назву курсу або вашу спеціалізацію...",
          descLabel: "Мотиваційний лист / Очікування",
          descPlaceholder:
            "Опишіть, чому ви бажаєте пройти цей курс та як плануєте застосувати отримані знання...",
        };
      case "Датасет":
        return {
          titleLabel: "Назва набору даних (Dataset)",
          titlePlaceholder:
            "Введіть назву вашого датасету (наприклад, 'Медичні знімки легень 2026')...",
          descLabel: "Специфікація та опис даних",
          descPlaceholder:
            "Опишіть структуру даних, метод збору, обсяг, формат файлів та правила цитування...",
        };
      case "Науковий журнал":
      case "Стаття":
      default:
        return {
          titleLabel: "Назва наукової праці",
          titlePlaceholder: "Введіть повну назву роботи...",
          descLabel: "Анотація дослідження",
          descPlaceholder:
            "Напишіть лаконічний опис, методологію та висновки вашої наукової роботи...",
        };
    }
  };

  const contentText = getLabelsAndPlaceholders();

  return (
    <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 md:p-12 border border-[var(--border-color)] rounded-3xl shadow-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              {contentText.titleLabel}
            </label>
            <input
              type="text"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              placeholder={contentText.titlePlaceholder}
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Оберіть активну програму
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors appearance-none pr-10 cursor-pointer"
                value={data.programId}
                onChange={(e) =>
                  setData({ ...data, programId: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Оберіть програму зі списку...
                </option>
                {activePrograms.map((p) => (
                  <option key={p._id} value={p._id}>
                    [{p.type}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Галузь науки / Напрям
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors appearance-none pr-10 cursor-pointer"
                value={data.domain}
                onChange={(e) => setData({ ...data, domain: e.target.value })}
                required
              >
                <option value="" disabled>
                  Оберіть відповідну галузь...
                </option>
                {domains.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
            Супровідний файл (Документ / Архів / Датасет)
          </label>
          <div className="relative border-2 border-dashed border-[var(--border-color)] hover:border-purple-500/40 rounded-2xl p-6 transition-colors bg-[var(--bg-main)]/30 group">
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <UploadCloud size={24} />
              </div>
              <div className="text-xs font-medium text-[var(--text-dark)]">
                {file ? (
                  <span className="text-purple-600 dark:text-purple-400 font-bold bg-purple-500/5 px-3 py-1 rounded-lg border border-purple-500/10">
                    📂 {file.name}
                  </span>
                ) : (
                  "Перетягніть файл сюди або клікніть для вибору"
                )}
              </div>
              <p className="text-[10px] text-[var(--text-gray)]">
                Підтримуються формати PDF, DOCX, ZIP, RAR, CSV (до 50MB)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
            {contentText.descLabel}
          </label>
          <div className="quill-wrapper rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
            <style>{`
              .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); }
              .ql-container.ql-snow { border: none !important; min-height: 160px; font-family: inherit; }
              .ql-editor { font-size: 0.85rem; color: var(--text-dark); }
              .ql-editor.ql-blank::before { color: var(--text-gray) !important; font-style: normal; opacity: 0.5; }
            `}</style>
            <ReactQuill
              theme="snow"
              value={data.description}
              onChange={(v) => setData({ ...data, description: v })}
              placeholder={contentText.descPlaceholder}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2 italic"
        >
          <Send size={14} />
          Надіслати на розгляд ресурсу
        </button>
      </form>
    </div>
  );
}
