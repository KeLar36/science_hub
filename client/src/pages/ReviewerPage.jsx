/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FileText,
  CheckCircle,
  Clock,
  FileDown,
  XCircle,
  MessageSquare,
  Search,
  User,
  ShieldCheck,
  Inbox,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ReviewerPage = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const userData = useMemo(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      return {
        user: parsedUser,
        userId: parsedUser?._id || parsedUser?.id,
        token,
      };
    } catch (e) {
      console.error("Помилка парсингу користувача:", e);
      return { user: null, userId: null, token: null };
    }
  }, []);

  const loadMyAssignments = async () => {
    const { userId, token } = userData;

    if (!userId || !token) {
      console.warn("Синхронізація сесії: ID або токен не знайдено");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/projects/reviewer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const activeProjects = res.data.filter(
        (proj) =>
          proj.status === "На розгляді" || proj.status === "На доопрацюванні",
      );
      setMyProjects(activeProjects);
    } catch (err) {
      console.error("Деталі помилки:", err);
      if (err.response?.status !== 404) {
        const errorMessage =
          err.response?.data?.message || "Не вдалося завантажити чергу";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.userId) {
      loadMyAssignments();
    }
  }, [userData.userId]);

  const handleSubmitDecision = async (projectId, newStatus) => {
    if (
      newStatus !== "Прийнято" &&
      (!commentText || commentText.trim() === "")
    ) {
      toast.error("Будь ласка, додайте обґрунтування для цього рішення");
      return;
    }

    const { token } = userData;

    const decisionPromise = axios.patch(
      `/projects/submit-review/${projectId}`,
      { status: newStatus, reviewerComments: commentText },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    toast.promise(decisionPromise, {
      loading: "Фіксація вердикту...",
      success: () => {
        setMyProjects((prev) => prev.filter((p) => p._id !== projectId));
        setActiveCommentId(null);
        setCommentText("");
        return <b>Рішення успішно збережено! 🟣</b>;
      },
      error: (err) => {
        console.error(err);
        return `Помилка: ${err.response?.data?.error || "Спробуйте пізніше"}`;
      },
    });
  };

  const filteredProjects = myProjects.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full py-12 px-6 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-[var(--border-color)] pb-10">
          <div>
            <div className="flex items-center gap-2 text-[var(--purple-main)] mb-2">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Expert Terminal v.2.0
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] tracking-tight uppercase italic leading-none">
              Рецензування<span className="text-[var(--purple-main)]">.</span>
            </h1>
            <p className="text-[var(--text-gray)] font-bold mt-3 max-w-sm text-sm">
              Аналіз та верифікація наукових праць. Активних завдань:{" "}
              {myProjects.length}.
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-[var(--purple-main)] transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Пошук за назвою..."
              className="w-full py-4 pl-12 pr-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-sm font-medium outline-none focus:border-[var(--purple-main)] focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--purple-main)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)]">
              Синхронізація даних...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] border-dashed">
            <Inbox
              className="mx-auto mb-4 text-[var(--border-color)]"
              size={48}
            />
            <p className="text-xs font-black text-[var(--text-gray)] uppercase tracking-widest">
              Черга перевірки порожня
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                            proj.status === "На розгляді"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {proj.status}
                        </span>
                        <span className="text-[var(--purple-main)] text-[10px] font-black uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-lg">
                          {proj.domain}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black text-[var(--text-dark)] leading-tight tracking-tight uppercase italic group-hover:text-[var(--purple-main)] transition-colors">
                        {proj.title}
                      </h3>

                      <div className="flex items-center gap-3 py-2 border-l-2 border-[var(--purple-main)] pl-4">
                        <div className="w-10 h-10 bg-[var(--bg-main)] rounded-xl flex items-center justify-center border border-[var(--border-color)]">
                          <User size={20} className="text-[var(--text-dark)]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-[var(--text-gray)] uppercase">
                            Автор праці
                          </p>
                          <p className="text-sm font-bold text-[var(--text-dark)]">
                            {proj.authorId?.name || "Анонімний дослідник"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[var(--bg-main)]/50 rounded-2xl p-6 border border-[var(--border-color)]">
                        <div
                          className="prose prose-sm max-w-none text-[var(--text-dark)] opacity-80 italic font-medium line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: proj.description }}
                        />
                      </div>
                    </div>

                    <div className="lg:w-64 shrink-0 flex flex-col gap-3">
                      <a
                        href={proj.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-[var(--text-dark)] text-white p-4 rounded-xl font-bold text-xs hover:bg-[var(--purple-main)] transition-all shadow-lg"
                      >
                        <FileDown size={16} /> Читати документ
                      </a>

                      <button
                        onClick={() => {
                          setActiveCommentId(
                            activeCommentId === proj._id ? null : proj._id,
                          );
                          setCommentText("");
                        }}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-xs border transition-all ${
                          activeCommentId === proj._id
                            ? "bg-rose-50 border-rose-200 text-rose-500"
                            : "bg-white border-[var(--border-color)] text-[var(--text-dark)] hover:border-[var(--purple-main)]"
                        }`}
                      >
                        {activeCommentId === proj._id ? (
                          <XCircle size={16} />
                        ) : (
                          <MessageSquare size={16} />
                        )}
                        {activeCommentId === proj._id
                          ? "Скасувати"
                          : "Прийняти рішення"}
                      </button>
                    </div>
                  </div>

                  {activeCommentId === proj._id && (
                    <div className="mt-10 pt-10 border-t border-[var(--border-color)] animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="max-w-3xl">
                        <label className="text-[10px] font-black text-[var(--purple-main)] uppercase tracking-[0.2em] mb-4 block">
                          Експертний висновок (обов'язково для
                          відхилення/доопрацювання)
                        </label>
                        <textarea
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-6 text-sm font-bold outline-none focus:border-[var(--purple-main)] transition-all min-h-[150px] placeholder:opacity-30"
                          placeholder="Напишіть ваші зауваження до роботи..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                          <button
                            onClick={() =>
                              handleSubmitDecision(proj._id, "Відхилено")
                            }
                            className="flex items-center justify-center gap-2 bg-rose-500 text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all"
                          >
                            <XCircle size={14} /> Відхилити
                          </button>
                          <button
                            onClick={() =>
                              handleSubmitDecision(proj._id, "На доопрацюванні")
                            }
                            className="flex items-center justify-center gap-2 bg-amber-500 text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all"
                          >
                            <Clock size={14} /> Доопрацювання
                          </button>
                          <button
                            onClick={() =>
                              handleSubmitDecision(proj._id, "Прийнято")
                            }
                            className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all"
                          >
                            <CheckCircle size={14} /> Схвалити
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ReviewerPage;
