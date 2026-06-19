/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import MiniStatCard from "../components/profile/MiniStatCard";
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileModal from "../components/profile/EditProfileModal";
import ArticlesList from "../components/profile/ArticlesList";
import BookmarksList from "../components/profile/BookmarksList";
import SubmissionForm from "../components/profile/SubmissionForm";
import { FileText, Bookmark, Award, Target } from "lucide-react";

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

export default function ProfilePage() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const location = useLocation();

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resMe = await axios.get(`${apiUrl}/api/users/me`);
      const user = resMe.data.user;
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

      if (!user || !user._id) {
        throw new Error("User ID is missing");
      }

      const [resArticles, resPrograms, resSaved] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/user/${user._id}`),
        axios.get(`${apiUrl}/api/programs`),
        // Додаємо ?_t=... щоб URL завжди був унікальним і не кешувався
        axios.get(
          `${apiUrl}/api/users/bookmarks/all?_t=${new Date().getTime()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          },
        ),
      ]);

      setArticles(resArticles.data);
      setPrograms(resPrograms.data);
      setSavedPosts(resSaved.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
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
      await axios.post(`${apiUrl}/api/users/bookmarks/toggle/${postId}`);
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
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
          data-aos="fade-down"
        >
          <ProfileHeader
            userData={userData}
            apiUrl={apiUrl}
            navigate={navigate}
            onOpenEdit={() => setIsEditModalOpen(true)}
          />

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

        <ProfileTabs activeView={view} onViewChange={setView} />

        <div className="min-h-[300px]">
          {!loading && view === "list" && (
            <ArticlesList items={articles} onRefresh={fetchData} />
          )}
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
              onSubmit={handleSubmitArticle}
              file={file}
              setFile={setFile}
              domains={SCIENTIFIC_DOMAINS}
            />
          )}
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSubmit={handleUpdateProfile}
      />

      <Footer />
    </div>
  );
}
