import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios"; // твій налаштований axios

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection from "../components/about/HeroSection";
import Features from "../components/about/Features";
import Steps from "../components/about/Steps";
import TechStack from "../components/about/TechStack";
import FinalCTA from "../components/about/FinalCTA";

const AboutPage = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");

        if (res.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-[var(--purple-main)] selection:text-white font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(var(--text-dark)_1px,transparent_1px)] [background-size:24px_24px]" />

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
