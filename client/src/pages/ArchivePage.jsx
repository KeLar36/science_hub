import React, { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ArchiveHeader from "../components/archive/ArchiveHeader";
import ArchiveFilter from "../components/archive/ArchiveFilter";
import ArchiveGrid from "../components/archive/ArchiveGrid";
import ArticleDetailModal from "../components/archive/ArticleDetailModal";

export default function ArchivePage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("Всі");

  const fetchArchiveData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/projects/archive");
      setArticles(response.data);
    } catch (err) {
      console.error("Error fetching archived projects:", err);
      setError(
        err.response?.data?.message || "Не вдалося завантажити архів статей",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchiveData();
  }, [fetchArchiveData]);

  const domains = useMemo(() => {
    if (!articles.length) return ["Всі"];
    const unique = new Set(articles.map((a) => a.domain).filter(Boolean));
    return ["Всі", ...Array.from(unique)];
  }, [articles]);

  // Відфільтровані статті
  const filteredArticles = useMemo(() => {
    if (selectedDomain === "Всі") return articles;
    return articles.filter((a) => a.domain === selectedDomain);
  }, [articles, selectedDomain]);

  const stats = useMemo(() => {
    if (!articles.length) return { total: 0, domains: 0, authors: 0 };

    const uniqueDomains = new Set(
      articles.map((a) => a.domain).filter(Boolean),
    );
    const uniqueAuthors = new Set(
      articles.map((a) => a.authorId?._id || a.authorId?.name).filter(Boolean),
    );

    return {
      total: articles.length,
      domains: uniqueDomains.size,
      authors: uniqueAuthors.size || 1,
    };
  }, [articles]);

  const getDownloadUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/api/${cleanPath}`;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] pt-28 pb-16 px-6 transition-colors duration-300">
        <ArchiveHeader stats={stats} loading={loading} />

        {!loading && !error && (
          <ArchiveFilter
            domains={domains}
            selectedDomain={selectedDomain}
            onSelectDomain={setSelectedDomain}
          />
        )}

        <div className="max-w-7xl mx-auto">
          <ArchiveGrid
            loading={loading}
            error={error}
            items={filteredArticles}
            onSelectArticle={setSelectedArticle}
            getDownloadUrl={getDownloadUrl}
          />
        </div>

        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          getDownloadUrl={getDownloadUrl}
        />
      </div>

      <Footer />
    </>
  );
}
