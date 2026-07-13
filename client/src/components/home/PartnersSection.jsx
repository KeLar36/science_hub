/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const PartnersSection = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultPartners = [
    { name: "МОН України", logo: null, website: "https://mon.gov.ua" },
    { name: "НАН України", logo: null, website: "https://www.nas.gov.ua" },
    {
      name: "Ужгородський національний університет",
      logo: null,
      website: "https://www.uzhnu.edu.ua",
    },
    { name: "КНУ ім. Шевченка", logo: null, website: "https://knu.ua" },
    { name: "ЛНУ ім. Франка", logo: null, website: "https://lnu.edu.ua" },
  ];

  const fetchPublicOrganizations = async () => {
    try {
      const response = await axios.get("/organizations/public/list");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setOrganizations(response.data);
      } else {
        setOrganizations(defaultPartners);
      }
    } catch (err) {
      console.error("💥 Помилка завантаження публічних організацій:", err);
      setOrganizations(defaultPartners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicOrganizations();
  }, []);

  const marqueeItems = [...organizations, ...organizations];

  if (loading) {
    return (
      <div className="py-6 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[var(--text-gray)] opacity-60">
          Ініціалізація доріжки партнерів...
        </span>
      </div>
    );
  }

  return (
    <section className="py-12 border-b border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] relative mb-20">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center lg:text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)]">
          Офіційні установи та наукові спільноти на платформі
        </p>
      </div>

      <div className="flex w-full overflow-hidden select-none relative before:absolute before:left-0 before:top-0 before:w-24 before:h-full before:bg-gradient-to-r before:from-[var(--bg-card)] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-24 after:h-full after:bg-gradient-to-l after:from-[var(--bg-card)] after:to-transparent after:z-10 py-2">
        <div className="flex gap-16 animate-[marquee_45s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center">
          {marqueeItems.map((org, idx) => (
            <a
              key={`${org._id || "static"}-${idx}`}
              href={org.website || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-10 shrink-0 group transition-all mx-4"
              title={org.name}
            >
              {org.logo ? (
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-full w-auto max-w-[130px] object-contain opacity-35 dark:opacity-45 grayscale contrast-125 dark:mix-blend-lighten group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-300"
                />
              ) : (
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)]/40 group-hover:text-purple-600 transition-colors font-mono whitespace-nowrap">
                  ✦ {org.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default PartnersSection;
