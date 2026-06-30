import React from "react";
import { Check, X, Clock, Mail } from "lucide-react";

export default function OrgJoinRequestsTab({
  requests = [],
  onAccept,
  onReject,
  loadingAction,
}) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)]">
          📬 Черга активних заявок на вступ
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-black bg-purple-600 text-white rounded-md">
          {requests.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.length === 0 ? (
          <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
            🕊️ Наразі нових нерозглянутих заявок на вступ немає. Всі вчені
            верифіковані!
          </div>
        ) : (
          requests.map((req) => {
            const u = req.userId;
            if (!u) return null;
            return (
              <div
                key={u._id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-3xl shadow-xs flex items-center justify-between gap-4 transition-all hover:border-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 font-extrabold text-sm flex items-center justify-center uppercase">
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-dark)] leading-tight">
                      {u.name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-gray)] font-medium mt-0.5 flex items-center gap-1">
                      <Mail size={11} /> {u.email}
                    </p>
                    <div className="text-[9px] font-bold text-amber-600 flex items-center gap-1 mt-1 uppercase">
                      <Clock size={10} /> Очікує апруву
                    </div>
                  </div>
                </div>

                {/* ДІЇ */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onAccept(u._id)}
                    disabled={loadingAction === u._id}
                    className="p-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl transition-all shadow-xs"
                    title="Прийняти в організацію"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => onReject(u._id)}
                    disabled={loadingAction === u._id}
                    className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-600 rounded-xl transition-all shadow-xs"
                    title="Відхилити запит"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
