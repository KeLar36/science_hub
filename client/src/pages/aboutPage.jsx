import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection from "../components/about/HeroSection";
import Features from "../components/about/Features";
import Steps from "../components/about/Steps";
import TechStack from "../components/about/TechStack";
import FinalCTA from "../components/about/FinalCTA";

const AboutPage = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-[var(--purple-main)] selection:text-white font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300">
      <Navbar />

      <main className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--text-dark) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <HeroSection isAuth={isAuth} onNavigate={navigate} />
        <Features />
        <Steps />
        <TechStack />
        <FinalCTA isAuth={isAuth} onNavigate={navigate} />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
