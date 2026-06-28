/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, FileText, Bookmark, Award, Target } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import MiniStatCard from "../components/profile/MiniStatCard";
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileModal from "../components/profile/EditProfileModal";
import SubmissionForm from "../components/profile/SubmissionForm";
import UniversalCard from "../components/UniversalCard";
import { SCIENTIFIC_DOMAINS } from "../constants/domains";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserState, user: contextUser } = useAuth();

  const [userData, updateUserStateData] = useState(null);
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

  const targetProgram = location.state?.targetProgram || null;

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    programId: location.state?.programId || "",
    domain:
      targetProgram?.domain ||
      (SCIENTIFIC_DOMAINS && SCIENTIFIC_DOMAINS[0]) ||
      "Інше",
  });

  useEffect(() => {
    if (location.state?.programId) {
      setArticleData((prev) => ({
        ...prev,
        programId: location.state.programId,
        domain:
          targetProgram?.domain ||
          location.state.domain ||
          (SCIENTIFIC_DOMAINS && SCIENTIFIC_DOMAINS[0]) ||
          "Інше",
      }));
      setView("form");
    }
  }, [location.state, targetProgram]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resMe = await axiosInstance.get("/users/me");
      const user = resMe.data.user;

      updateUserState(user);
      updateUserStateData(user);

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

      const [resArticles, resPrograms, resBookmarks] = await Promise.all([
        axiosInstance.get(`/projects/user/${user._id}`),
        axiosInstance.get("/programs"),
        axiosInstance.get("/users/bookmarks/all"),
      ]);

      setArticles(resArticles.data);
      setPrograms(resPrograms.data);
      setSavedPosts(resBookmarks.data);
    } catch (err) {
      console.error("Fetch data error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        toast.error("Помилка завантаження даних");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch("/users/update-profile", editForm);
      updateUserStateData(res.data);
      updateUserState(res.data);
      setIsEditModalOpen(false);
      toast.success("Профіль оновлено!");
    } catch (err) {
      toast.error("Не вдалося оновити профіль");
    }
  };

  const handleToggleBookmark = async (e, postId) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/users/bookmarks/toggle/${postId}`);
      setSavedPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Закладку видалено");
    } catch (err) {
      toast.error("Помилка при оновленні закладок");
    }
  };

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
      await axiosInstance.post("/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Роботу подано!");

      setFile(null);
      setArticleData({
        title: "",
        description: "",
        programId: "",
        domain: (SCIENTIFIC_DOMAINS && SCIENTIFIC_DOMAINS[0]) || "Інше",
      });

      setView("list");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка подачі");
    } finally {
      setLoading(false);
    }
  };

  const activePrograms = useMemo(() => {
    return programs.filter((p) => {
      if (!p.deadline) return true;
      return new Date(p.deadline) >= new Date();
    });
  }, [programs]);

  const topDomain = useMemo(() => {
    if (!articles || articles.length === 0) return "Немає даних";
    const counts = articles.reduce((acc, curr) => {
      if (curr.domain) {
        acc[curr.domain] = (acc[curr.domain] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sortedEntries[0]?.[0] || "Немає даних";
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] antialiased">
      <Toaster position="bottom-right" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-36 pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <ProfileHeader
            userData={userData}
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
              label="Прийнято"
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
          {view === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
              {articles.length === 0 ? (
                <div className="col-span-full text-center py-12 border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-gray)] text-sm">
                  У вас немає поданих статей.
                </div>
              ) : (
                articles.map((art) => (
                  <UniversalCard
                    key={art._id}
                    item={art}
                    variant="profileArticle"
                    onActionClick={(e, item) => {
                      toast(`Ревізія для програми: ${item.title}`);
                    }}
                  />
                ))
              )}
            </div>
          )}

          {view === "bookmarks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
              {savedPosts.length === 0 ? (
                <div className="col-span-full text-center py-12 border border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-gray)] text-sm">
                  У вас немає збережених закладок.
                </div>
              ) : (
                savedPosts.map((post) => (
                  <UniversalCard
                    key={post._id}
                    item={post}
                    variant="profileBookmark"
                    onRemoveBookmark={handleToggleBookmark}
                  />
                ))
              )}
            </div>
          )}

          {view === "form" && (
            <SubmissionForm
              data={articleData}
              setData={setArticleData}
              activePrograms={activePrograms}
              targetProgram={targetProgram}
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
