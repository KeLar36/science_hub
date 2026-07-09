import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import ProgramsExplorer from "../components/home/ProgramsExplorer";
import PartnersSection from "../components/home/PartnersSection";
import FaqSection from "../components/home/FaqSection";
import DigestSection from "../components/home/DigestSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] transition-colors duration-300">
      <Navbar />

      <HeroSection />

      <StatsSection />

      <FeaturesSection />

      <HowItWorksSection />

      <div id="explorer">
        <ProgramsExplorer />
      </div>

      <PartnersSection />

      <FaqSection />

      <DigestSection />

      <Footer />
    </div>
  );
};

export default HomePage;
