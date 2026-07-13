import React, { useState } from "react";
import { X, ShieldAlert, Check, BookOpen, Layers } from "lucide-react";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";

const AssignReviewerModal = ({ isOpen, onClose, user, onSave }) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Тогл вибору галузей
  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDomains.length === 0 || selectedTypes.length === 0) {
      alert("Будь ласка, оберіть хоча б одну галузь та один тип програм!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(user._id, {
        role: "reviewer",
        allowedDomains: selectedDomains,
        allowedTypes: selectedTypes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-left">
        <div className="p-6 border-b border-[var(--border-color)]/60 flex items-center justify-between bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/10 border border-purple-500/20 text-purple-600 rounded-xl flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-[var(--text-dark)]">
                Акредитація рецензента
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-gray)] font-bold">
                Налаштування профілю: {user?.name || "Користувач"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[var(--border-color)] hover:border-rose-500 rounded-xl text-[var(--text-gray)] hover:text-rose-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8"
        >
          {/* СЕКЦІЯ 1: ТИПИ ПРОГРАМ */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-dark)] flex items-center gap-2 border-b border-[var(--border-color)]/40 pb-2">
              <Layers size={14} className="text-purple-600" />
              01 / Дозволені типи програм ({selectedTypes.length})
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {PROGRAM_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/10"
                        : "bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-dark)] hover:border-purple-600"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* СЕКЦІЯ 2: НАУКОВІ ГАЛУЗІ */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-dark)] flex items-center gap-2 border-b border-[var(--border-color)]/40 pb-2">
              <BookOpen size={14} className="text-purple-600" />
              02 / Спеціалізація за галузями знань ({selectedDomains.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCIENTIFIC_DOMAINS.map((domain) => {
                const isSelected = selectedDomains.includes(domain);
                return (
                  <button
                    type="button"
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`p-3 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/5 border-purple-600 text-purple-600 font-black"
                        : "bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:border-[var(--text-dark)]/40"
                    }`}
                  >
                    <span className="truncate">{domain}</span>
                    <div
                      className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-[var(--border-color)]"
                      }`}
                    >
                      {isSelected && <Check size={10} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Футер модалки з кнопками */}
        <div className="p-6 border-t border-[var(--border-color)]/60 flex items-center justify-end gap-3 bg-[var(--bg-main)]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-[var(--border-color)] text-[var(--text-dark)] font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-md shadow-purple-600/10 cursor-pointer"
          >
            {isSubmitting ? "Збереження..." : "Затвердити Протокол"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewerModal;
