/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PageHeader } from "../components/ui/PageHeader";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ProgramsExplorer from "../components/home/ProgramsExplorer";
import DigestSection from "../components/home/DigestSection";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../constants/domains";
import { Button } from "../components/ui/Button";
import { ArrowUpRight } from "lucide-react";

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");

  const fetchData = async (currentPage) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/programs?page=${currentPage}&limit=9`,
      );
      setPrograms(res.data.programs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        if (res.status === 200) setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.shortDescription &&
          p.shortDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (p.organizer &&
          p.organizer.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType =
        selectedType === "Всі типи" || p.type === selectedType;
      const matchesDomain =
        selectedDomain === "Всі галузі" || p.domain === selectedDomain;
      return matchesSearch && matchesType && matchesDomain;
    });
  }, [programs, searchTerm, selectedType, selectedDomain]);

  const filterDropdowns = [
    {
      value: selectedType,
      onChange: setSelectedType,
      options: ["Всі типи", ...PROGRAM_TYPES],
    },
    {
      value: selectedDomain,
      onChange: setSelectedDomain,
      options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("Всі типи");
    setSelectedDomain("Всі галузі");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] transition-colors duration-300">
      <Navbar />

      <PageHeader
        badge="Open Science Platform"
        animateBadge={true}
        title="Знайдіть фінансування"
        highlightedTitle="для своїх публікацій"
        description="Єдиний агрегатор актуальних наукових грантів, міжнародних стипендій та провідних фахових видань."
      >
        <Button
          onClick={() =>
            (window.location.href = isAuth ? "/profile" : "/register")
          }
          size="lg"
          className="font-bold tracking-wider uppercase group"
        >
          <span>Почати шлях</span>
          <ArrowUpRight
            size={14}
            className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
          />
        </Button>
      </PageHeader>

      <StatsSection totalCount={programs.length} />

      <FeaturesSection />

      <ProgramsExplorer
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDropdowns={filterDropdowns}
        onReset={handleResetFilters}
        items={filteredPrograms}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DigestSection />

      <Footer />
    </div>
  );
};

export default HomePage;
