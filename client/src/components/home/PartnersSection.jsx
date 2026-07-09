/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";

const PartnersSection = () => {
  const [partnerNames, setPartnerNames] = useState([]);

  useEffect(() => {
    const fetchApprovedOrgs = async () => {
      try {
        const response = await axiosInstance.get("/organizations/public/list");
        const orgs = response.data || [];

        if (Array.isArray(orgs) && orgs.length > 0) {
          const names = orgs.map((org) => org.name);
          setPartnerNames(names);
        }
      } catch (err) {
        console.error(
          "💥 Не вдалося завантажити реальних партнерів з бази:",
          err,
        );
      }
    };

    fetchApprovedOrgs();
  }, []);

  const displayPartners =
    partnerNames.length > 0
      ? partnerNames
      : [
          "МОН України",
          "НАН України",
          "Ужгородський національний університет",
          "КНУ ім. Шевченка",
          "ЛНУ ім. Франка",
        ];

  return (
    <section className="py-12 border-b border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)] relative">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center lg:text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)]">
          Офіційні установи та наукові спільноти на платформі
        </p>
      </div>

      <div className="flex w-full overflow-hidden select-none relative before:absolute before:left-0 before:top-0 before:w-24 before:h-full before:bg-gradient-to-r before:from-[var(--bg-card)] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-24 after:h-full after:bg-gradient-to-l after:from-[var(--bg-card)] after:to-transparent after:z-10">
        <div className="flex gap-16 animate-[marquee_35s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center">
          {displayPartners.concat(displayPartners).map((partner, idx) => (
            <span
              key={idx}
              className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)]/40 hover:text-purple-600 transition-colors font-mono cursor-default"
            >
              ✦ {partner}
            </span>
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
