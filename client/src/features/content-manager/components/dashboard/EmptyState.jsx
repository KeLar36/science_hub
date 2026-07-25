export function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border-color text-center">
      <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border-color flex items-center justify-center text-text-secondary text-base mb-4 font-mono select-none">
        📄
      </div>
      <p className="text-text-muted font-mono text-xs max-w-sm leading-relaxed">
        {message ||
          "Тут поки що порожньо. Створіть новий матеріал або змініть налаштування фільтрації."}
      </p>
    </div>
  );
}
