import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "@/shared/api/axios";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import Skeleton from "@/shared/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/features/content-manager/components/dashboard/FilterBar";
import { PostTable } from "@/features/content-manager/components/dashboard/PostTable";
import { EmptyState } from "@/features/content-manager/components/dashboard/EmptyState";
import Button from "@/shared/ui/Button";
import Pagination from "@/shared/ui/Pagination";

export default function ContentManagerPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Особистий кабінет", href: "/profile" },
    { label: "Контент-менеджер", active: true },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/posts/my-dashboard", {
          params: {
            page: page,
            limit: 8,
            status: statusFilter !== "all" ? statusFilter : undefined,
            search: searchTerm.trim() || undefined,
          },
          withCredentials: true,
        });

        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.totalItems || 0);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.error || "Помилка завантаження робочої зони",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [page, statusFilter, searchTerm]);
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/post-form/${id}`);
  };

  const handleAddPost = () => {
    navigate("/post-form");
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете НАЗАВЖДИ видалити цю публікацію? Цю дію не можна скасувати.",
      )
    )
      return;

    try {
      await axios.delete(`/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      setTotalItems((prev) => prev - 1);
      alert("Публікацію успішно видалено.");
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити статтю");
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        <Skeleton variant="line" width="200px" height="16px" />
        <div className="space-y-2">
          <Skeleton variant="rectangle" height="40px" />
          <p className="text-text-muted font-mono text-[10px] animate-pulse">
            Завантаження системних даних з сервера...
          </p>
        </div>
        <div className="space-y-3">
          <Skeleton variant="rectangle" height="240px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-mono">
          Критичний збій системи: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto mt-20">
        <div className="max-w-6xl mx-auto p-6 space-y-6 bg-bg-primary text-text-primary min-h-screen">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border-color pb-4">
            <div>
              <h1 className="text-xl font-bold font-sans tracking-tight">
                Робоча зона менеджера
              </h1>
              <p className="text-text-muted text-xs mt-1">
                Керування науковими публікаціями та контентом організації.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-secondary bg-bg-secondary border border-border-color px-3 py-1.5 mb-2 rounded-sm text-center">
                Знайдено елементів: {totalItems}
              </div>
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={handleAddPost}
              >
                Додати публікацію
              </Button>
            </div>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
          />

          {posts.length === 0 ? (
            <EmptyState
              message={
                searchTerm
                  ? "За вказаними параметрами пошуку нічого не знайдено."
                  : "У вашій робочій зоні ще немає жодної публікації."
              }
            />
          ) : (
            <>
              <div
                className={`transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
              >
                <PostTable
                  posts={posts}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
