/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";
import {
  FileText,
  ArrowUpRight,
  UploadCloud,
  Bookmark,
  Trash2,
  Settings,
  FileCheck,
  History,
  X,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Loader2,
  Save,
  Target,
  Award,
  Send,
  ChevronDown,
  UserCheck,
  FolderOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const SCIENTIFIC_DOMAINS = [
  "Штучний інтелект & IT",
  "Медицина та фармація",
  "Економіка та фінанси",
  "Право та юриспруденція",
  "Природничі науки",
  "Гуманітарні науки",
  "Технічні науки & Інженерія",
  "Інше",
];

import { UKRAINIAN_CITIES } from "../constants/cities";

const ProfilePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const location = useLocation();

  const [token] = useState(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState(location.state?.programId ? "form" : "list");
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    city: "",
    socials: { github: "", linkedin: "", instagram: "", website: "" },
  });

  const [articles, setArticles] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [file, setFile] = useState(null);
  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    abstract: "",
    programId: location.state?.programId || "",
    domain: location.state?.domain || "Інше",
  });

  const authConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token],
  );

  const fetchData = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${currentToken}` } };
      const resMe = await axios.get(`${apiUrl}/api/users/me`, config);
      const user = resMe.data;
      setUserData(user);

      localStorage.setItem("user", JSON.stringify(user));

      setEditForm({
        name: user.name || "",
        bio: user.bio || "",
        city: user.city || "",
        socials: {
          github: user.socials?.github || "",
          linkedin: user.socials?.linkedin || "",
          instagram: user.socials?.instagram || "",
          website: user.socials?.website || "",
        },
      });

      const [resArticles, resPrograms, resSaved] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/user/${user._id}`, config),
        axios.get(`${apiUrl}/api/programs`),
        axios.get(`${apiUrl}/api/users/bookmarks/all`, config),
      ]);

      setArticles(resArticles.data);
      setPrograms(resPrograms.data);
      setSavedPosts(resSaved.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Помилка завантаження даних");
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, navigate]);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${apiUrl}/api/users/update-profile`,
        editForm,
        authConfig,
      );
      setUserData(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditModalOpen(false);
      toast.success("Профіль оновлено!");
    } catch (err) {
      toast.error("Не вдалося оновити профіль");
    }
  };

  const handleToggleBookmark = async (e, postId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${apiUrl}/api/users/bookmarks/toggle/${postId}`,
        {},
        authConfig,
      );
      setSavedPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Закладку видалено");
    } catch (err) {
      toast.error("Помилка закладок");
    }
  };

  const activePrograms = useMemo(() => {
    return programs.filter((p) => {
      if (!p.deadline) return true;
      const deadlineDate = new Date(p.deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      return deadlineDate >= new Date();
    });
  }, [programs]);

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Додайте PDF файл!");

    const formData = new FormData();
    Object.keys(articleData).forEach((key) =>
      formData.append(key, articleData[key]),
    );
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/projects/create`, formData, {
        headers: {
          ...authConfig.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Роботу подано!");
      setView("list");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка подачі");
    } finally {
      setLoading(false);
    }
  };

  const topDomain = useMemo(() => {
    if (articles.length === 0) return "IT Research";
    const counts = articles.reduce((acc, curr) => {
      acc[curr.domain] = (acc[curr.domain] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [articles]);

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] antialiased selection:bg-purple-500/20">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-36 pb-24 relative">
        {/* ХЕДЕР ПРОФІЛЮ (Оновлена Bento-структура) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
          data-aos="fade-down"
        >
          {/* Головна картка дослідника */}
          <div className="lg:col-span-3 bento-card p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem]">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10" />

            {/* Аватар */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 overflow-hidden shadow-xl flex items-center justify-center ring-4 ring-purple-500/10">
                {userData.image ? (
                  <img
                    src={
                      userData.image.startsWith("http")
                        ? userData.image
                        : `${apiUrl}${userData.image}`
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-white text-4xl font-extrabold uppercase">
                    {userData.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Інформація про користувача */}
            <div className="text-center md:text-left flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-dark)]">
                    {userData.name}
                  </h1>
                  <span className="px-2.5 py-1 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-md text-[10px] font-bold tracking-wider uppercase border border-purple-500/10">
                    {userData.role}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1.5 text-[var(--text-gray)] text-xs font-semibold">
                  <MapPin size={14} className="text-purple-500" />
                  <span>{userData.city || "Україна"}</span>
                </div>
              </div>

              <p className="text-[var(--text-gray)] text-sm leading-relaxed max-w-2xl font-medium">
                {userData.bio ||
                  "Дослідник відкритої науки. Інформація про наукові інтереси поки не заповнена."}
              </p>

              {/* Соцмережі та Панелі Керування в один ряд */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                <div className="flex gap-3">
                  {userData.socials?.github && (
                    <a
                      href={userData.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {userData.socials?.linkedin && (
                    <a
                      href={userData.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {userData.socials?.website && (
                    <a
                      href={userData.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
                    title="Налаштування профілю"
                  >
                    <Settings size={18} />
                  </button>
                </div>

                {/* Адмін-кнопки (Тепер виглядають нативно) */}
                {(userData.role === "admin" ||
                  userData.role === "superadmin" ||
                  userData.role === "content-manager" ||
                  userData.role === "reviewer") && (
                  <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />
                )}

                <div className="flex items-center gap-2">
                  {(userData.role === "admin" ||
                    userData.role === "superadmin") && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-3 py-2 bg-purple-600/5 hover:bg-purple-600 hover:text-white border border-purple-500/10 text-purple-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck size={14} /> Адмінка
                    </button>
                  )}
                  {(userData.role === "content-manager" ||
                    userData.role === "superadmin") && (
                    <button
                      onClick={() => navigate("/content-panel")}
                      className="px-3 py-2 bg-blue-500/5 hover:bg-blue-500 hover:text-white border border-blue-500/10 text-blue-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <FileText size={14} /> Контент
                    </button>
                  )}
                  {(userData.role === "reviewer" ||
                    userData.role === "superadmin") && (
                    <button
                      onClick={() => navigate("/reviewer")}
                      className="px-3 py-2 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <FileCheck size={14} /> Рецензії
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Експрес Статистика поруч */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <MiniStatCard
              label="Мої статті"
              val={articles.length}
              icon={FileText}
              color="text-blue-500"
              bg="bg-blue-500/5"
              onClick={() => setView("list")}
            />
            <MiniStatCard
              label="Збережено"
              val={savedPosts.length}
              icon={Bookmark}
              color="text-purple-600"
              bg="bg-purple-600/5"
              onClick={() => setView("bookmarks")}
            />
            <MiniStatCard
              label="Прийнято заявок"
              val={`${articles.filter((a) => a.status === "Прийнято").length}/${articles.length}`}
              icon={Award}
              color="text-emerald-500"
              bg="bg-emerald-500/5"
            />
            <MiniStatCard
              label="Топ галузь"
              val={topDomain}
              icon={Target}
              color="text-amber-500"
              bg="bg-amber-500/5"
            />
          </div>
        </div>

        {/* НАВІГАЦІЯ ТАБІВ */}
        <div className="flex justify-center mb-10">
          <nav className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm backdrop-blur-md">
            {[
              { id: "list", label: "Мої роботи" },
              { id: "bookmarks", label: "Закладки" },
              { id: "form", label: "Нова публікація" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-6 md:px-8 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  view === t.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/15"
                    : "text-[var(--text-gray)] hover:text-purple-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ОСНОВНИЙ КОНТЕНТ */}
        <div className="min-h-[300px]">
          {!loading && view === "list" && <ArticlesList items={articles} />}
          {!loading && view === "bookmarks" && (
            <BookmarksList
              items={savedPosts}
              onToggle={handleToggleBookmark}
              navigate={navigate}
            />
          )}
          {!loading && view === "form" && (
            <SubmissionForm
              data={articleData}
              setData={setArticleData}
              activePrograms={activePrograms}
              programs={programs}
              onSubmit={handleSubmitArticle}
              file={file}
              setFile={setFile}
              domains={SCIENTIFIC_DOMAINS}
            />
          )}
        </div>
      </main>

      {/* МОДАЛКА РЕДАГУВАННЯ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                Редагування профілю
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <InputField
                label="Ваше ім'я / Установа"
                value={editForm.name}
                onChange={(v) => setEditForm({ ...editForm, name: v })}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
                  Місто
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm appearance-none cursor-pointer"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm({ ...editForm, city: e.target.value })
                    }
                  >
                    <option value="">Оберіть місто...</option>
                    {UKRAINIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
                  />
                </div>
              </div>

              <InputField
                label="LinkedIn URL"
                value={editForm.socials.linkedin || ""}
                onChange={(v) =>
                  setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, linkedin: v },
                  })
                }
              />
              <InputField
                label="GitHub URL"
                value={editForm.socials.github || ""}
                onChange={(v) =>
                  setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, github: v },
                  })
                }
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
                  Про мене
                </label>
                <textarea
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 outline-none focus:border-purple-600 text-sm min-h-[100px] resize-none"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Опишіть вашу наукову діяльність, досягнення чи сферу досліджень..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 transition-all"
              >
                <Save size={16} /> Зберегти налаштування
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* СТИЛЬНІ КОМПОНЕНТИ (ОПТИМІЗОВАНІ) */
const MiniStatCard = ({ label, val, icon: Icon, color, bg, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center gap-4 hover:border-purple-500/20 transition-all ${onClick ? "cursor-pointer select-none" : ""}`}
  >
    <div
      className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
    >
      <Icon size={18} className={color} />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-bold tracking-tight text-[var(--text-dark)] truncate">
        {val}
      </div>
      <div className="text-[10px] font-medium text-[var(--text-gray)] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
      {label}
    </label>
    <input
      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)]"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ArticlesList = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] border-dashed p-8">
        <FolderOpen
          size={40}
          className="text-[var(--text-gray)] mb-3 opacity-60"
        />
        <span className="text-sm font-bold text-[var(--text-gray)]">
          Наукових публікацій не знайдено
        </span>
        <p className="text-xs text-[var(--text-gray)] opacity-70 mt-1">
          Всі ваші подані роботи відображатимуться тут.
        </p>
      </div>
    ) : (
      items.map((art) => (
        <div
          key={art._id}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-[240px] hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-600/[0.02] transition-all"
        >
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold uppercase tracking-wider mb-4">
              {art.domain}
            </span>
            <h3 className="text-base font-bold text-[var(--text-dark)] line-clamp-3 leading-snug">
              {art.title}
            </h3>
          </div>
          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-medium text-[var(--text-gray)]">
            <span>{new Date(art.createdAt).toLocaleDateString("uk-UA")}</span>
            <span
              className={`font-bold ${art.status === "Прийнято" || art.status === "Approved" ? "text-emerald-500" : "text-amber-500"}`}
            >
              {art.status || "Очікує"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

const BookmarksList = ({ items, onToggle, navigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] border-dashed p-8">
        <Bookmark
          size={40}
          className="text-[var(--text-gray)] mb-3 opacity-60"
        />
        <span className="text-sm font-bold text-[var(--text-gray)]">
          У вас немає збережених закладок
        </span>
      </div>
    ) : (
      items.map((post) => (
        <div
          key={post._id}
          onClick={() => navigate(`/blog/${post._id}`)}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-[240px] relative group cursor-pointer hover:border-purple-500/30 hover:shadow-lg transition-all"
        >
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <span className="px-2.5 py-0.5 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                {post.domain}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle(e, post._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all z-10"
                title="Видалити з закладок"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <h3 className="text-base font-bold text-[var(--text-dark)] line-clamp-3 leading-snug group-hover:text-purple-600 transition-colors">
              {post.title}
            </h3>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-gray)]">
            <span className="flex items-center gap-1">
              <History size={12} />{" "}
              {new Date(post.createdAt).toLocaleDateString("uk-UA")}
            </span>
            <span className="text-purple-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-0.5">
              Читати <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

const SubmissionForm = ({
  data,
  setData,
  activePrograms,
  onSubmit,
  file,
  setFile,
  domains,
}) => (
  <div
    className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 md:p-12 border border-[var(--border-color)] rounded-3xl shadow-sm"
    data-aos="zoom-in"
  >
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
              onChange={(e) => setData({ ...data, programId: e.target.value })}
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
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-600/10 transition-all flex items-center justify-center gap-2"
      >
        <Send size={15} /> Відправити роботу на рецензування
      </button>
    </form>
  </div>
);

export default ProfilePage;
