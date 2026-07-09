/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  FileText,
  Bookmark,
  Target,
  Trash2,
  FileCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import MiniStatCard from "../components/profile/MiniStatCard";
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileModal from "../components/profile/EditProfileModal";
import SubmissionForm from "../components/profile/SubmissionForm";
import CreateOrganizationModal from "../components/profile/CreateOrganizationModal";
import JoinOrganizationModal from "../components/profile/JoinOrganizationModal";
import UniversalCard from "../components/ui/UniversalCard";
import { SCIENTIFIC_DOMAINS } from "../constants/domains";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserState } = useAuth();

  const [userData, setUserData] = useState(null);
  const [view, setView] = useState(location.state?.programId ? "form" : "list");

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const [myProjects, setMyProjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [isJoinOrgModalOpen, setIsJoinOrgModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    bio: "",
    socials: { linkedin: "", github: "" },
  });

  const targetProgram = location.state?.programId || null;
  const targetProgramTitle = location.state?.programTitle || "";
  const targetProgramType = location.state?.programType || "";
  const targetProgramDomain = location.state?.programDomain || null;

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    programId: targetProgram || "",
    domain: targetProgramDomain || SCIENTIFIC_DOMAINS[0],
  });

  const [file, setFile] = useState(null);

  const initProfile = useCallback(async (signal) => {
    try {
      setLoading(true);

      const userRes = await axiosInstance.get("/users/me", { signal });
      const currentSubUser = userRes.data.user || userRes.data;
      setUserData(currentSubUser);

      setEditForm({
        name: currentSubUser.name || "",
        city: currentSubUser.city || "",
        bio: currentSubUser.bio || "",
        socials: {
          linkedin: currentSubUser.socials?.linkedin || "",
          github: currentSubUser.socials?.github || "",
        },
      });
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Не вдалося завантажити профіль");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const userId = userData?._id;
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    if (view === "list") {
      setTabLoading(true);
      axiosInstance
        .get("/projects/my", { signal: controller.signal })
        .then((res) => setMyProjects(res.data || []))
        .catch(() => toast.error("Помилка завантаження ваших робіт"))
        .finally(() => setTabLoading(false));
    }

    if (view === "bookmarks") {
      setTabLoading(true);
      axiosInstance
        .get("/users/bookmarks/all", { signal: controller.signal })
        .then((res) => setBookmarks(res.data || []))
        .catch(() => toast.error("Помилка завантаження закладок"))
        .finally(() => setTabLoading(false));
    }

    if (view === "form") {
      setTabLoading(true);
      axiosInstance
        .get("/programs/public?limit=100", { signal: controller.signal })
        .then((res) => {
          const programsList =
            res.data?.programs || res.data?.items || res.data || [];
          setActivePrograms(programsList);

          if (targetProgram && programsList.length > 0) {
            const matchedProgram = programsList.find(
              (p) => p._id === targetProgram,
            );
            if (matchedProgram) {
              setArticleData((prev) => ({
                ...prev,
                programId: matchedProgram._id,
                domain: matchedProgram.domain || prev.domain,
              }));
            }
          }
        })
        .catch(() => toast.error("Помилка завантаження активних конкурсів"))
        .finally(() => setTabLoading(false));
    }

    return () => controller.abort();
  }, [view, userId]);

  useEffect(() => {
    const controller = new AbortController();
    initProfile(controller.signal);
    return () => controller.abort();
  }, [initProfile]);

  useEffect(() => {
    if (targetProgram && activePrograms.length > 0) {
      const found = activePrograms.find((p) => p._id === targetProgram);
      if (found) {
        setArticleData((prev) => ({
          ...prev,
          programId: found._id,
          domain: found.domain || prev.domain,
        }));
      }
    }
  }, [targetProgram, activePrograms]);

  const stats = useMemo(() => {
    return {
      total: myProjects.length,
      approved: myProjects.filter((p) => p.status === "Прийнято").length,
    };
  }, [myProjects]);

  const renderedProjects = useMemo(() => {
    if (myProjects.length === 0) {
      return (
        <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center rounded-3xl text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
          📁 Ви ще не подали жодної наукової праці.
        </div>
      );
    }
    return myProjects.map((project) => (
      <UniversalCard key={project._id} item={project} isAdminMode={false} />
    ));
  }, [myProjects]);

  const renderedBookmarks = useMemo(() => {
    if (bookmarks.length === 0) {
      return (
        <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center rounded-3xl text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
          🔖 Списку закладок немає або він порожній.
        </div>
      );
    }
    return bookmarks.map((post) =>
      post && post.title ? (
        <UniversalCard key={post._id} item={post} variant="profileBookmark" />
      ) : null,
    );
  }, [bookmarks]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch("/users/update-profile", editForm);
      const updatedUser = res.data.user || res.data;
      setUserData(updatedUser);
      updateUserState(updatedUser);
      setIsEditModalOpen(false);
      toast.success("Профіль успішно оновлено!");
    } catch {
      toast.error("Помилка оновлення профілю");
    }
  };

  const handleCreateOrganization = async (formData) => {
    try {
      setLoadingAction("createOrg");
      const res = await axiosInstance.post("/organizations/create", formData);
      setUserData((prev) => ({
        ...prev,
        organizationId: res.data.organization,
      }));
      setIsCreateOrgModalOpen(false);
      toast.success("Заявку на реєстрацію установи надіслано на модерацію!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Помилка створення організації",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    if (!file)
      return toast.error("Будь ласка, завантажте файл вашої наукової праці!");

    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("description", articleData.description);
    formData.append("domain", articleData.domain);
    formData.append("file", file);
    if (targetProgram) formData.append("programId", targetProgram);

    try {
      setLoadingAction("submitArticle");
      await axiosInstance.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Вашу працю успішно надіслано на рецензування!");
      setArticleData({
        title: "",
        description: "",
        programId: targetProgram || "",
        domain: targetProgramDomain || SCIENTIFIC_DOMAINS[0],
      });

      setFile(null);
      setView("list");

      const projectsRes = await axiosInstance.get("/projects/my");
      setMyProjects(projectsRes.data || []);
    } catch {
      toast.error("Помилка під час відправки праці");
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col text-[var(--text-dark)]">
      <Toaster />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        <div className="lg:col-span-4 top-28">
          <ProfileHeader
            userData={userData}
            navigate={navigate}
            onOpenEdit={() => setIsEditModalOpen(true)}
            onOpenCreateOrg={() => setIsCreateOrgModalOpen(true)}
            onOpenJoinOrg={() => setIsJoinOrgModalOpen(true)} // 🟢 ПЕРЕДАЛИ ФУНКЦІЮ ВІДКРИТТЯ З ПРOПСАМИ
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniStatCard
              label="Усіх публікацій"
              val={stats.total}
              icon={FileText}
              bg="bg-purple-500/5"
              color="text-purple-600"
            />
            <MiniStatCard
              label="Схвалено праць"
              val={stats.approved}
              icon={FileCheck}
              bg="bg-emerald-500/5"
              color="text-emerald-500"
            />
            <MiniStatCard
              label="У закладках"
              val={bookmarks.length}
              icon={Bookmark}
              bg="bg-blue-500/5"
              color="text-blue-500"
            />
          </div>

          <ProfileTabs activeView={view} onViewChange={setView} />

          <div className="w-full">
            {tabLoading ? (
              <div className="py-20 flex justify-center items-center">
                <Loader2 size={24} className="animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                {view === "list" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderedProjects}
                  </div>
                )}

                {view === "bookmarks" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderedBookmarks}
                  </div>
                )}

                {view === "form" && (
                  <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs">
                    <SubmissionForm
                      data={articleData}
                      setData={setArticleData}
                      activePrograms={activePrograms}
                      targetProgram={targetProgram}
                      targetProgramTitle={targetProgramTitle}
                      targetProgramType={targetProgramType}
                      onSubmit={handleSubmitArticle}
                      file={file}
                      setFile={setFile}
                      domains={SCIENTIFIC_DOMAINS}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
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

      <JoinOrganizationModal
        isOpen={isJoinOrgModalOpen}
        onClose={() => setIsJoinOrgModalOpen(false)}
        onRefreshProfile={() => initProfile()}
      />

      <Footer />
    </div>
  );
}
