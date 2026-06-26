/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ArchiveHeader from "../components/archive/ArchiveHeader";
import UniversalFilters from "../components/UniversalFilters";
import ArchiveGrid from "../components/archive/ArchiveGrid";
import ArticleDetailModal from "../components/archive/ArticleDetailModal";

import { SCIENTIFIC_DOMAINS } from "../constants/domains";

export default function ArchivePage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");

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

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDomain =
        selectedDomain === "Всі галузі" || article.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [articles, searchTerm, selectedDomain]);

  const stats = useMemo(() => {
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

  const filterDropdowns = [
    {
      value: selectedDomain,
      onChange: setSelectedDomain,
      options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDomain("Всі галузі");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-16 px-4 md:px-6 transition-colors duration-300">
        <ArchiveHeader stats={stats} loading={loading} />

        {!loading && !error && (
          <div className="max-w-7xl mx-auto mt-6">
            <UniversalFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceholder="Швидкий пошук за назвою статті або автором..."
              dropdowns={filterDropdowns}
              onReset={handleResetFilters}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto mt-4">
          <ArchiveGrid
            loading={loading}
            error={error}
            items={filteredArticles}
            onSelectArticle={setSelectedArticle}
            getDownloadUrl={getDownloadUrl}
          />
        </div>
      </div>

      <Footer />

      <ArticleDetailModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        getDownloadUrl={getDownloadUrl}
      />
    </>
  );
}
