/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, FileText, Bookmark, Target, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import MiniStatCard from "../components/profile/MiniStatCard";
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileModal from "../components/profile/EditProfileModal";
import SubmissionForm from "../components/profile/SubmissionForm";
import CreateOrganizationModal from "../components/profile/CreateOrganizationModal";
import UniversalCard from "../components/UniversalCard";
import { SCIENTIFIC_DOMAINS } from "../constants/domains";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserState } = useAuth();

  const [userData, updateUserStateData] = useState(null);
  const [view, setView] = useState(location.state?.programId ? "form" : "list");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    city: "",
    topics: "",
  });
  const [file, setFile] = useState(null);

  const [articleData, setArticleData] = useState({
    title: "",
    annotation: "",
    domain: SCIENTIFIC_DOMAINS[0],
    programId: location.state?.programId || "",
    keywords: "",
    authors: "",
  });

  const targetProgram = useMemo(() => {
    if (!articleData.programId || !activePrograms.length) return null;
    return activePrograms.find((p) => p._id === articleData.programId) || null;
  }, [articleData.programId, activePrograms]);

  const fetchProfileData = useCallback(async (signal) => {
    try {
      setLoading(true);
      const [userRes, projectsRes, programsRes] = await Promise.all([
        axiosInstance.get("/users/me", { signal }),
        axiosInstance.get("/projects/my", { signal }),
        axiosInstance.get("/programs", { signal }),
      ]);

      const fetchedUser = userRes.data.user;
      updateUserStateData(fetchedUser);

      setEditForm({
        name: fetchedUser?.name || "",
        bio: fetchedUser?.bio || "",
        city: fetchedUser?.city || "",
        topics: fetchedUser?.topics || "",
      });

      setMyPosts(projectsRes.data || []);
      setActivePrograms(programsRes.data || []);
      setSavedPosts(fetchedUser?.bookmarks || []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Помилка завантаження профілю:", err);
        toast.error("Не вдалося оновити дані профілю");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfileData(controller.signal);
    return () => controller.abort();
  }, [fetchProfileData]);

  const handleViewChange = (targetView) => {
    if (targetView === "form") {
      setView("form");
    } else if (targetView === "bookmarks") {
      setView("list");
      setActiveTab("bookmarks");
    } else {
      setView("list");
      setActiveTab("posts");
    }
  };

  const currentActiveView = useMemo(() => {
    if (view === "form") return "form";
    return activeTab === "bookmarks" ? "bookmarks" : "list";
  }, [view, activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction("profile");
      const res = await axiosInstance.patch("/users/update-profile", editForm);
      const updated = res.data.user || res.data;
      updateUserStateData(updated);
      updateUserState(updated);
      setIsEditModalOpen(false);
      toast.success("Профіль успешно оновлено!");
    } catch {
      toast.error("Помилка оновлення профілю");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreateOrganization = async (formData) => {
    try {
      setLoadingAction("createOrg");
      await axiosInstance.post("/organizations/create", formData);
      toast.success("Заявку на реєстрацію установи надіслано на модерацію!");
      setIsCreateOrgModalOpen(false);
      const controller = new AbortController();
      fetchProfileData(controller.signal);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Помилка реєстрації організації",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleBookmark = async (e, id) => {
    const targetId = id || e;

    try {
      await axiosInstance.post(`/users/bookmarks/toggle/${targetId}`);

      setSavedPosts((prev) => prev.filter((post) => post._id !== targetId));
      toast.success("Закладку видалено");
    } catch (err) {
      console.error("Помилка оновлення закладок:", err);
      toast.error("Помилка оновлення закладок");
    }
  };

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    if (!file)
      return toast.error("Будь ласка, завантажте PDF-файл вашої праці");

    const formData = new FormData();
    Object.keys(articleData).forEach((key) =>
      formData.append(key, articleData[key]),
    );
    formData.append("file", file);

    try {
      setLoadingAction("submit");
      await axiosInstance.post("/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Вашу наукову працю успішно подано на модерацію!");
      setView("list");
      setActiveTab("posts");
      setFile(null);
      setArticleData({
        title: "",
        annotation: "",
        domain: SCIENTIFIC_DOMAINS[0],
        programId: "",
        keywords: "",
        authors: "",
      });
      const controller = new AbortController();
      fetchProfileData(controller.signal);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка відправки статті");
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col">
      <Toaster />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 mt-14">
        {/* 🟢 СТРУКТУРА ЗМІНЕНА НА FLEX-COL ДЛЯ СТАБІЛЬНОГО ВЕРТИКАЛЬНОГО БУДІВНИЦТВА */}
        <div className="flex flex-col gap-6 text-left items-stretch w-full">
          {/* 1. ПРОФІЛЬНА ШАПКА */}
          <ProfileHeader
            userData={userData}
            navigate={navigate}
            onOpenEdit={() => setIsEditModalOpen(true)}
            onOpenCreateOrg={() => setIsCreateOrgModalOpen(true)}
          />

          {/* 2. ЛІЧИЛЬНИКИ ТА КНОПКИ ДІЙ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <MiniStatCard
              label="Мої праці"
              val={myPosts.length}
              icon={FileText}
              color="text-purple-600"
              bg="bg-purple-500/5"
              onClick={() => {
                setView("list");
                setActiveTab("posts");
              }}
            />
            <MiniStatCard
              label="Збережено закладок"
              val={savedPosts.length}
              icon={Bookmark}
              color="text-amber-600"
              bg="bg-amber-500/5"
              onClick={() => {
                setView("list");
                setActiveTab("bookmarks");
              }}
            />
            <MiniStatCard
              label="Подати статтю"
              val="Нова публікація"
              icon={Target}
              color="text-emerald-600"
              bg="bg-emerald-500/5"
              onClick={() => setView("form")}
            />
          </div>

          {/* 3. НАВІГАЦІЙНІ ТАБИ СТОРІНКИ */}
          <div className="w-full mt-2">
            <ProfileTabs
              activeView={currentActiveView}
              onViewChange={handleViewChange}
            />
          </div>

          {/* 4. ГОЛОВНИЙ КОНТЕНТ */}
          {view === "list" && (
            <div className="w-full">
              {activeTab === "posts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPosts.length === 0 ? (
                    <div className="col-span-full p-12 text-center border border-dashed border-[var(--border-color)] rounded-3xl text-[var(--text-gray)] text-sm font-medium bg-[var(--bg-card)]">
                      Ви ще не завантажували власних наукових робіт.
                    </div>
                  ) : (
                    myPosts.map((post) => (
                      <UniversalCard
                        key={post._id}
                        item={post}
                        variant="profile"
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === "bookmarks" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  {!Array.isArray(savedPosts) || savedPosts.length === 0 ? (
                    <div className="col-span-full p-12 text-center border border-dashed border-[var(--border-color)] rounded-3xl text-[var(--text-gray)] text-sm font-medium bg-[var(--bg-card)]">
                      У вас немає збережених закладок.
                    </div>
                  ) : (
                    savedPosts.map((post) =>
                      post && post.title ? (
                        <UniversalCard
                          key={post._id}
                          item={post}
                          variant="profileBookmark" // Твій системний варіант
                          onRemoveBookmark={handleToggleBookmark}
                        />
                      ) : null,
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {view === "form" && (
            <div className="w-full">
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
            </div>
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

      <CreateOrganizationModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
        onSubmit={handleCreateOrganization}
        loadingAction={loadingAction}
      />

      <Footer />
    </div>
  );
}
