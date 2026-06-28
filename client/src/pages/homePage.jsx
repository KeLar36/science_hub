/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ProgramsExplorer from "../components/home/ProgramsExplorer";
import DigestSection from "../components/home/DigestSection";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../constants/domains";

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/programs");
        setPrograms(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
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
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] transition-colors duration-300">
      <Navbar />

      {/* Викликаємо підключений HeroSection та передаємо авторизацію */}
      <HeroSection isAuth={isAuth} />

      <StatsSection totalCount={programs.length} />

      <FeaturesSection />

      <ProgramsExplorer
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDropdowns={filterDropdowns}
        onReset={handleResetFilters}
        items={filteredPrograms}
        loading={loading}
      />

      <DigestSection />

      <Footer />
    </div>
  );
};

export default HomePage;
