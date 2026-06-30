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
  // 🟣 1. Новий стейт для фільтрації за типом матеріалу
  const [selectedType, setSelectedType] = useState("Всі типи");

  const fetchArchiveData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/projects/archive");

      console.log("Данні з архіву:", response.data);

      if (response.data && response.data.length === 0) {
        console.warn("Архів порожній, перевірте бекенд-фільтри");
      }

      setArticles(response.data);
    } catch (err) {
      console.error("Помилка:", err);
      setError(err.response?.data?.message || "Помилка завантаження архіву");
    } finally {
      setLoading(false);
    }
  }, []); // Якщо архів має оновлюватися, додай сюди залежності, якщо вони є

  useEffect(() => {
    fetchArchiveData();
  }, [fetchArchiveData]);

  const stats = useMemo(() => {
    return {
      total: articles.length,
      domainsCount: new Set(articles.map((a) => a.domain)).size,
    };
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.authorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain =
        selectedDomain === "Всі галузі" || art.domain === selectedDomain;

      const matchesType =
        selectedType === "Всі типи" ||
        (selectedType === "Статті" &&
          art.programId?.type === "Науковий журнал") ||
        (selectedType === "Конференції" &&
          art.programId?.type === "Конференція");

      return matchesSearch && matchesDomain && matchesType;
    });
  }, [articles, searchTerm, selectedDomain, selectedType]);

  const getDownloadUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\\/g, "/");
    return `/api/${cleanPath}`;
  };

  const filterDropdowns = [
    {
      value: selectedType,
      onChange: setSelectedType,
      options: ["Всі типи", "Статті", "Конференції"],
    },
    {
      value: selectedDomain,
      onChange: setSelectedDomain,
      options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDomain("Всі галузі");
    setSelectedType("Всі типи"); // Скидаємо також і тип
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
              searchPlaceholder="Швидкий пошук за назвою або автором..."
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
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        getDownloadUrl={getDownloadUrl}
      />
    </>
  );
}
