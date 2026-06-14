/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";
import {
  FileText,
  PlusCircle,
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
  Info,
  Zap,
  Eye,
  Target,
  Award,
  Send,
  ChevronDown,
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

const UKRAINIAN_CITIES = [
  "Київ",
  "Харків",
  "Одеса",
  "Дніпро",
  "Донецьк",
  "Запоріжжя",
  "Львів",
  "Кривий Ріг",
  "Миколаїв",
  "Севастополь",
  "Маріуполь",
  "Луганськ",
  "Вінниця",
  "Макіївка",
  "Сімферополь",
  "Херсон",
  "Полтава",
  "Чернігів",
  "Черкаси",
  "Хмельницький",
  "Житомир",
  "Чернівці",
  "Суми",
  "Рівне",
  "Івано-Франківськ",
  "Кам'янське",
  "Кропивницький",
  "Тернопіль",
  "Кременчук",
  "Луцьк",
  "Біла Церква",
  "Керч",
  "Мелітополь",
  "Ужгород",
].sort();

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
      const config = {
        headers: { Authorization: `Bearer ${currentToken}` },
      };

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
    AOS.init({ duration: 800, once: true });
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

  const activePrograms = programs.filter((p) => {
    if (!p.deadline) return true;
    const deadlineDate = new Date(p.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate >= new Date();
  });

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

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] font-['Plus_Jakarta_Sans']">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-44 pb-20 relative">
        <header
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          data-aos="fade-down"
        >
          <div className="lg:col-span-2 bento-card p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-[4.5rem] bg-gradient-to-br from-purple-600 to-indigo-700 overflow-hidden shadow-2xl flex items-center justify-center">
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
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                ) : null}
                <div className="text-white text-4xl font-black">
                  {userData.name?.charAt(0)}
                </div>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                  {userData.name}
                </h1>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-lg text-[9px] font-black uppercase border border-purple-500/20">
                  {userData.role}
                </span>
              </div>
              <p className="text-[var(--text-gray)] text-sm font-medium mb-6 max-w-xl">
                {userData.bio || "Дослідник відкритої науки..."}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-[var(--text-gray)]">
                  <MapPin size={14} className="text-purple-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {userData.city || "Україна"}
                  </span>
                </div>
                <div className="flex gap-4">
                  {userData.socials?.github && (
                    <a
                      href={userData.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--text-gray)] hover:text-purple-600 transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {userData.socials?.linkedin && (
                    <a
                      href={userData.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--text-gray)] hover:text-purple-600 transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {userData.socials?.website && (
                    <a
                      href={userData.socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--text-gray)] hover:text-purple-600 transition-colors"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:border-purple-600 transition-all shadow-sm"
                title="Налаштування"
              >
                <Settings size={22} />
              </button>
            </div>
            <div className="flex flex-col flex-wrap items-center gap-4">
              {(userData.role === "admin" ||
                userData.role === "superadmin") && (
                <button
                  onClick={() => navigate("/admin")}
                  className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:border-purple-600 transition-all shadow-sm"
                >
                  <Settings
                    size={14}
                    className="group-hover:rotate-90 transition-transform"
                  />
                </button>
              )}

              {(userData.role === "content-manager" ||
                userData.role === "superadmin") && (
                <button
                  onClick={() => navigate("/content-panel")}
                  className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:border-purple-600 transition-all shadow-sm"
                >
                  <FileText size={14} />
                </button>
              )}

              {(userData.role === "reviewer" ||
                userData.role === "superadmin") && (
                <button
                  onClick={() => navigate("/reviewer")}
                  className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:border-purple-600 transition-all shadow-sm"
                >
                  <FileCheck size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatBox
              label="Мої статті"
              val={articles.length}
              icon={FileText}
              color="text-blue-500"
              onClick={() => setView("list")}
            />
            <StatBox
              label="Збережених постів"
              val={savedPosts.length}
              icon={Bookmark}
              color="text-purple-600"
              onClick={() => setView("bookmarks")}
            />
            <StatBox
              label="ПРИЙНЯТО ЗАЯВОК"
              val={`${articles.filter((a) => a.status === "Прийнято").length}/${articles.length}`}
              icon={Award}
              color="text-emerald-500"
            />
            <StatBox
              label="Топ галузь"
              val={
                articles.length > 0
                  ? Object.entries(
                      // Use Object.entries here
                      articles.reduce((acc, curr) => {
                        acc[curr.domain] = (acc[curr.domain] || 0) + 1;
                        return acc;
                      }, {}),
                    ).sort((a, b) => b[1] - a[1])[0][0]
                  : "IT Research"
              }
              icon={Target}
              color="text-amber-500"
            />
          </div>
        </header>

        <div className="flex justify-center mb-12">
          <nav className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm backdrop-blur-md">
            {[
              { id: "list", label: "Мої роботи" },
              { id: "bookmarks", label: "Закладки" },
              { id: "form", label: "Нова публікація" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  view === t.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25 scale-[1.02]"
                    : "text-[var(--text-gray)] hover:text-purple-500 hover:bg-purple-500/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="min-h-[400px]">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-purple-600" />
            </div>
          )}

          {!loading && view === "list" && (
            <ArticlesList items={articles} navigate={navigate} />
          )}
          {!loading && view === "bookmarks" && (
            <BookmarksList items={savedPosts} onToggle={handleToggleBookmark} />
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] p-10 overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Налаштування <span className="text-purple-600">профілю</span>
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Ім'я"
                  value={editForm.name}
                  onChange={(v) => setEditForm({ ...editForm, name: v })}
                />

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                    Місто
                  </label>
                  <select
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-6 py-4 outline-none focus:border-purple-600 transition-all text-sm appearance-none"
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
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                  Про мене
                </label>
                <textarea
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-6 outline-none focus:border-purple-600 min-h-[120px] text-sm resize-none"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Розкажіть про свої наукові інтереси..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-purple-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition-all"
              >
                <Save size={18} /> Зберегти зміни
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const StatBox = ({ label, val, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="bento-card p-6 flex flex-col justify-between hover:border-purple-600/30 transition-all cursor-pointer group relative overflow-hidden"
  >
    <div
      className={`absolute -right-2 -top-2 w-12 h-12 rounded-full blur-2xl opacity-10 ${color.replace("text", "bg")}`}
    />

    <div className="w-10 h-10 rounded-xl bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-color)] group-hover:scale-110 transition-transform relative z-10">
      <Icon size={20} className={color} />
    </div>
    <div className="relative z-10">
      <div className="text-xl font-black tracking-tighter">{val}</div>
      <div className="text-[8px] uppercase font-black text-[var(--text-gray)] mt-1 tracking-widest">
        {label}
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
      {label}
    </label>
    <input
      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-6 py-4 outline-none focus:border-purple-600 transition-all text-sm"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ArticlesList = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.length === 0 ? (
      <div className="col-span-full text-center py-20 text-[var(--text-gray)] uppercase font-black text-xs tracking-widest">
        Робіт поки немає
      </div>
    ) : (
      items.map((art) => (
        <div
          key={art._id}
          className="bento-card p-8 hover:border-purple-600/40 transition-all flex flex-col h-[320px]"
        >
          <div className="flex justify-between mb-6">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-lg text-[8px] font-black uppercase">
              {art.domain}
            </span>
          </div>
          <h3 className="text-xl font-bold uppercase italic leading-tight line-clamp-3 mb-4">
            {art.title}
          </h3>
          <div className="mt-auto pt-6 border-t border-[var(--border-color)] flex items-center justify-between text-[var(--text-gray)]">
            <span className="text-[10px] font-bold italic">
              {new Date(art.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`text-[10px] font-black uppercase ${art.status === "Approved" ? "text-emerald-500" : "text-purple-600"}`}
            >
              {art.status || "Pending"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

const BookmarksList = ({ items, onToggle, navigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.length === 0 ? (
      <div className="col-span-full text-center py-20 text-[var(--text-gray)] uppercase font-black text-xs tracking-widest">
        Закладок немає
      </div>
    ) : (
      items.map((post) => (
        <div
          key={post._id}
          onClick={() => navigate(`/blog/${post._id}`)}
          className="bento-card p-8 group relative h-[320px] flex flex-col transition-all hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-600/10 cursor-pointer overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />

          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Bookmark size={20} className="text-purple-600" />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle(e, post._id);
              }}
              className="absolute top-6 right-6 p-2.5 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20"
              title="Видалити"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 rounded text-[7px] font-black uppercase tracking-wider border border-purple-500/10">
                {post.domain}
              </span>
              <span className="text-[7px] font-bold text-[var(--text-gray)] uppercase tracking-widest flex items-center gap-1">
                <History size={8} />{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-black uppercase italic leading-tight line-clamp-3 group-hover:text-purple-600 transition-colors">
              {post.title}
            </h3>

            {post.abstract && (
              <div
                className="text-[10px] text-[var(--text-gray)] line-clamp-2 font-medium leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: post.abstract.substring(0, 100) + "...",
                }}
              />
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-2"></div>

            <div className="flex items-center gap-1 text-purple-600">
              <span className="text-[8px] font-black uppercase tracking-widest">
                Читати
              </span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

const SubmissionForm = ({
  data,
  setData,
  programs,
  activePrograms = [],
  onSubmit,
  file,
  setFile,
  domains = [],
}) => (
  <div
    className="max-w-4xl mx-auto bento-card p-10 md:p-16 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-[40px] shadow-2xl"
    data-aos="zoom-in"
  >
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
            Назва роботи
          </label>
          <input
            type="text"
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm focus:border-purple-600/50 transition-colors"
            placeholder="Введіть назву..."
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
            Програма (Активні дедлайни)
          </label>
          <div className="relative">
            <select
              value={data.programId}
              onChange={(e) => setData({ ...data, programId: e.target.value })}
              required
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm appearance-none cursor-pointer focus:border-purple-600/50 transition-colors pr-12"
            >
              <option value="" className="bg-[var(--bg-card)]">
                Оберіть програму...
              </option>
              {activePrograms.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                  className="bg-[var(--bg-card)]"
                >
                  {p.title}{" "}
                  {p.deadline
                    ? `(до ${new Date(p.deadline).toLocaleDateString("uk-UA")})`
                    : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600"
              size={18}
            />
          </div>
          {activePrograms.length === 0 && (
            <p className="text-[9px] text-amber-500 mt-2 ml-2 uppercase font-bold italic">
              Наразі немає активних програм
            </p>
          )}
        </div>

        {/* Галузь */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
            Галузь
          </label>
          <div className="relative">
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm appearance-none cursor-pointer focus:border-purple-600/50 transition-colors"
              value={data.domain}
              onChange={(e) => setData({ ...data, domain: e.target.value })}
              required
            >
              <option value="" className="bg-[var(--bg-card)]">
                Оберіть галузь...
              </option>
              {domains.map((d) => (
                <option key={d} value={d} className="bg-[var(--bg-card)]">
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600"
              size={18}
            />
          </div>
        </div>

        {/* Завантаження PDF */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
            Файл (PDF)
          </label>
          <div className="relative h-[56px] group">
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              onChange={(e) => setFile(e.target.files[0])}
              required={!file}
            />
            <div
              className={`absolute inset-0 border-2 border-dashed rounded-2xl flex items-center px-6 gap-3 transition-all ${
                file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-[var(--border-color)] bg-[var(--bg-main)] group-hover:border-purple-600/30"
              }`}
            >
              <UploadCloud
                size={18}
                className={file ? "text-emerald-500" : "text-purple-600"}
              />
              <span className="text-[10px] font-black uppercase truncate text-[var(--text-dark)]">
                {file ? file.name : "Завантажити документ..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Редактор Анотації */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
          Анотація (Опис роботи)
        </label>
        <div className="quill-wrapper rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-dark)]">
          <style>{`
              .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); }
              .ql-container.ql-snow { border: none !important; min-height: 200px; font-family: inherit; }
              .ql-editor { font-size: 0.875rem; color: var(--text-dark); }
              .ql-editor.ql-blank::before { color: var(--text-gray) !important; font-style: normal; opacity: 0.5; }
              .ql-snow .ql-stroke { stroke: var(--text-dark) !important; }
              .ql-snow .ql-fill { fill: var(--text-dark) !important; }
              .ql-snow .ql-picker { color: var(--text-dark) !important; }
              .ql-snow .ql-picker-options { background-color: var(--bg-card) !important; border: 1px solid var(--border-color) !important; }
            `}</style>
          <ReactQuill
            theme="snow"
            value={data.description}
            onChange={(v) => setData({ ...data, description: v })}
            placeholder="Напишіть коротку анотацію до вашого дослідження..."
          />
        </div>
      </div>

      {/* Кнопка відправки */}
      <button
        type="submit"
        className="w-full py-6 bg-purple-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-600/20 hover:bg-black dark:hover:bg-purple-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 italic"
      >
        <Send size={18} />
        Подати роботу на рецензію
      </button>
    </form>
  </div>
);

export default ProfilePage;
