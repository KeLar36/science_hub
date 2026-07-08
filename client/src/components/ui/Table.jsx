import React from "react";
import { Loader2, Inbox } from "lucide-react";

export const Table = ({ headers, data, renderRow, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#6d28d9]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[var(--text-gray)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xs gap-2">
        <Inbox className="w-8 h-8 text-[var(--text-gray)] opacity-50" />
        <span className="text-sm font-medium">Дані відсутні</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)] text-left text-sm text-[var(--text-gray)]">
          <thead className="bg-[var(--bg-main)] text-xs uppercase font-semibold text-[var(--text-main)] tracking-wider">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-3.5">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-dark)]">
            {data.map((item, idx) => renderRow(item, idx))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
