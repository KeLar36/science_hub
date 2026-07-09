import React, { useState, useEffect } from "react";
import {
  Search,
  Building2,
  X,
  CheckCircle2,
  Loader2,
  MapPin,
  Globe,
} from "lucide-react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export default function JoinOrganizationModal({
  isOpen,
  onClose,
  onRefreshProfile,
}) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/organizations/public/list");
      const approvedOrgs = (response.data || []).filter(
        (org) => org.status === "approved",
      );
      setOrganizations(approvedOrgs);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Не вдалося завантажити список організацій",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (orgId) => {
    setSubmittingId(orgId);
    try {
      const response = await axiosInstance.post("/organizations/join", {
        organizationId: orgId,
      });
      toast.success(
        response.data?.message || "Заявку на вступ успішно надіслано!",
      );

      if (onRefreshProfile) onRefreshProfile();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка при надсиланні заявки");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchName = org.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCity = org.city
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchName || matchCity;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/[0.03] blur-3xl rounded-full pointer-events-none" />

        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[var(--border-color)] rounded-xl flex items-center justify-center bg-[var(--bg-main)] text-purple-600 shadow-sm shadow-purple-600/5">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wide">
                Приєднання до установи
              </h3>
              <p className="text-[11px] text-[var(--text-gray)] font-medium mt-0.5">
                Оберіть вашу організацію для надсилання запиту адміністратору.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-gray)] hover:text-rose-500 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 bg-[var(--bg-main)]/60 border-b border-[var(--border-color)]">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
              size={14}
            />
            <input
              type="text"
              placeholder="Пошук установи за назвою або містом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] text-xs border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl focus:border-purple-500 focus:outline-none transition-all placeholder:text-[var(--text-gray)]/70 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[var(--bg-main)]/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--text-gray)]">
              <Loader2 size={24} className="animate-spin text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Шукаємо академічні простори...
              </span>
            </div>
          ) : filteredOrgs.length > 0 ? (
            filteredOrgs.map((org) => (
              <div
                key={org._id}
                className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-purple-500/20 group"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-md border border-purple-500/10">
                      {org.type}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--text-gray)]">
                      ЄДРПОУ: {org.edrpou}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[var(--text-dark)] leading-tight group-hover:text-purple-600 transition-colors">
                    {org.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--text-gray)] font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-purple-500/60" />{" "}
                      {org.city}
                    </span>
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-600 hover:underline"
                      >
                        <Globe size={11} /> Вебсайт
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(org._id)}
                  disabled={submittingId !== null}
                  className="sm:shrink-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                >
                  {submittingId === org._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  Вступити
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl p-6">
              <p className="text-xs text-[var(--text-gray)] font-bold">
                Організацій не знайдено
              </p>
              <p className="text-[10px] text-[var(--text-gray)]/70 mt-1">
                Можливо, введена вами установа ще не пройшла верифікацію
                суперадміном.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[var(--text-dark)] bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl transition-all"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
