/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import UniversalFilters from "../UniversalFilters";
import AdminPostRow from "./AdminPostRow";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { CATEGORIES } from "../../constants/categories";
import toast from "react-hot-toast";

export default function AdminPostsTab({
  currentUser,
  isOrganizationMode = false,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [activeStatus, setActiveStatus] = useState("Всі");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdminPosts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };

      if (activeCategory !== "Всі") params.category = activeCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      if (activeStatus !== "Всі") {
        params.status = activeStatus === "Активні" ? "published" : "draft";
      }

      if (isOrganizationMode && currentUser?.organizationId) {
        params.organizationId = currentUser.organizationId;
      }

      const res = await axiosInstance.get("/posts", { params });

      if (res.data && Array.isArray(res.data.posts)) {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("💥 Помилка завантаження адмін-постів:", err);
      toast.error("Не вдалося завантажити реєстр публікацій");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPosts();
  }, [activeCategory, activeStatus, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchAdminPosts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDeletePost = async (id) => {
    if (
      !window.confirm(
        "🚨 НАЗАВЖДИ видалити цю публікацію та її медіа з системи?",
      )
    )
      return;
    try {
      await axiosInstance.delete(`/posts/${id}`);
      toast.success("Публікацію успішно знесено! 🗑️");
      if (posts.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchAdminPosts();
      }
    } catch (err) {
      toast.error("Не вдалося видалити публікацію");
    }
  };

  const tableHeaders = [
    "Публікація",
    "Автор",
    "Категорія",
    "Дата створення",
    "Статус",
    "Дії",
  ];

  const renderRow = (post) => (
    <tr
      key={post._id}
      className="hover:bg-[var(--bg-main)]/40 transition-colors group"
    >
      <AdminPostRow post={post} onDelete={handleDeletePost} />
    </tr>
  );

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-black text-[var(--text-dark)] uppercase tracking-tight m-0">
          Керування медіа-блогом
        </h2>
        <p className="text-xs text-[var(--text-gray)] font-medium mt-1 m-0 opacity-80">
          Повний моніторинг публікацій платформи: перевірка чернеток, аналіз
          авторів та видалення контенту.
        </p>
      </div>

      <UniversalFilters
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        searchPlaceholder="Шукати публікацію за назвою або ключовим словом..."
        dropdowns={[
          {
            value: activeCategory,
            onChange: (val) => {
              setPage(1);
              setActiveCategory(val);
            },
            options: CATEGORIES,
          },
          {
            value: activeStatus,
            onChange: (val) => {
              setPage(1);
              setActiveStatus(val);
            },
            options: ["Всі", "Активні", "Чернетки"],
          },
        ]}
        onReset={() => {
          setSearchQuery("");
          setActiveCategory("Всі");
          setActiveStatus("Всі");
          setPage(1);
        }}
      />

      <Table
        headers={tableHeaders}
        data={posts}
        renderRow={renderRow}
        isLoading={loading}
      />

      <div className="pt-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
