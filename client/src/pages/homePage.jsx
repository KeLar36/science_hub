import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import PartnersSection from "../components/home/PartnersSection";
import FaqSection from "../components/home/FaqSection";
import DigestSection from "../components/home/DigestSection";

const HomePage = () => {
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalOrgs, setTotalOrgs] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [programsRes, orgsRes] = await Promise.all([
          axiosInstance.get("/programs?page=1&limit=1"),
          axiosInstance.get("/organizations/public/list"),
        ]);
        setTotalPrograms(programsRes.data?.totalItems || 0);
        setTotalOrgs(orgsRes.data?.length || 0);
      } catch (err) {
        console.error("Помилка статистики:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)]">
      <Navbar />
      <HeroSection />
      <PartnersSection /> {/* Партнерів можна кинути вище, під Hero */}
      <StatsSection
        totalPrograms={totalPrograms}
        totalOrganizations={totalOrgs}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <DigestSection />
      <Footer />
    </div>
  );
};

export default HomePage;
