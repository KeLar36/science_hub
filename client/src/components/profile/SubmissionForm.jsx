import React from "react";
import ReactQuill from "react-quill-new";
import { ChevronDown, UploadCloud, Send } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

export default function SubmissionForm({
  data,
  setData,
  activePrograms,
  onSubmit,
  file,
  setFile,
  domains,
}) {
  return (
    <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 md:p-12 border border-[var(--border-color)] rounded-3xl shadow-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Назва наукової праці
            </label>
            <input
              type="text"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              placeholder="Введіть повну назву роботи..."
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Активна програма
            </label>
            <div className="relative">
              <select
                value={data.programId}
                onChange={(e) =>
                  setData({ ...data, programId: e.target.value })
                }
                required
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm appearance-none cursor-pointer text-[var(--text-dark)] focus:border-purple-500/50 pr-10"
              >
                <option value="">Оберіть наукову програму...</option>
                {activePrograms.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}{" "}
                    {p.deadline
                      ? `(до ${new Date(p.deadline).toLocaleDateString("uk-UA")})`
                      : ""}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Наукова галузь
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm appearance-none cursor-pointer text-[var(--text-dark)] focus:border-purple-500/50 pr-10"
                value={data.domain}
                onChange={(e) => setData({ ...data, domain: e.target.value })}
                required
              >
                <option value="">Оберіть напрямок...</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Документ дослідження (PDF)
            </label>
            <div className="relative h-[46px] group">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={(e) => setFile(e.target.files[0])}
                required={!file}
              />
              <div
                className={`absolute inset-0 border border-dashed rounded-xl flex items-center px-4 gap-2.5 transition-all ${file ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-[var(--border-color)] bg-[var(--bg-main)]"}`}
              >
                <UploadCloud
                  size={16}
                  className={file ? "text-emerald-500" : "text-purple-600"}
                />
                <span className="text-xs font-medium truncate text-[var(--text-dark)]">
                  {file ? file.name : "Завантажити файл праці..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
            Анотація дослідження
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
              placeholder="Напишіть лаконічний опис, методологію та висновки вашої наукової роботи..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/10"
        >
          <Send size={15} /> Відправити роботу на рецензування
        </button>
      </form>
    </div>
  );
}
