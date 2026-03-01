import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowLeft, Send, CheckCircle, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/programs/${id}`);
        setProgram(res.data);
      } catch (err) {
        console.error("Помилка завантаження програми:", err);
        toast.error("Не вдалося завантажити деталі програми");
      } finally {
        setLoading(false);
      }
    };
    fetchProgramDetails();
  }, [id, apiUrl]);

  const handleApply = () => {
    if (!user || !token) {
      toast.error("Будь ласка, увійдіть у систему, щоб подати заявку", {
        style: {
          borderRadius: '15px',
          background: 'var(--text-dark)',
          color: 'var(--bg-main)',
          border: '1px solid var(--border-color)'
        }
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    navigate('/profile', {
      state: {
        programId: id,
        programTitle: program?.title
      }
    });
  };

  if (loading) {
    return (
      <div className="loader-container min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="custom-loader border-t-[#6d28d9]"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="loader-container min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-main)]">
        <h2 className="text-2xl font-black text-[var(--text-gray)] uppercase">Програму не знайдено</h2>
        <button onClick={() => navigate('/')} className="text-[#6d28d9] font-bold underline hover:opacity-80 transition-opacity">
          Повернутися на головну
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500">
      <Toaster position="top-right" />
      <Navbar />

      {/* Стилі для відтворення HTML-контенту програми */}
      <style>{`
        .rich-content { color: var(--text-main); }
        .rich-content h2, .rich-content h3 { color: var(--text-dark); font-weight: 800; margin-top: 1.5rem; }
        .rich-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .rich-content li { margin-bottom: 0.5rem; }
        .rich-content strong { color: #6d28d9; }
      `}</style>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 w-full flex-grow">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-[var(--text-gray)] hover:text-[#6d28d9] transition-all font-bold group"
          data-aos="fade-right"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Назад до списку
        </button>

        <div
          className="bg-[var(--bg-card)] rounded-[40px] shadow-sm border border-[var(--border-color)] overflow-hidden p-8 md:p-14"
          data-aos="zoom-in-up"
        >
          <div className="mb-10">
            <span
              className="inline-block bg-[var(--purple-light)] text-[#6d28d9] px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider mb-6 border border-[var(--border-color)]"
              data-aos="fade-down"
            >
              {program.category || 'Наукова програма'}
            </span>
            <h1
              className="text-3xl md:text-5xl font-black text-[var(--text-dark)] mb-8 leading-tight"
              data-aos="fade-up"
            >
              {program.title}
            </h1>

            <div className="flex flex-wrap gap-4 md:gap-6" data-aos="fade-up">
              <div className="flex items-center gap-2 bg-[var(--bg-main)] px-5 py-3 rounded-2xl border border-[var(--border-color)]">
                <Calendar size={18} className="text-[#6d28d9]" />
                <span className="text-sm font-medium text-[var(--text-gray)]">
                  Крайній термін: <b className="text-[var(--text-dark)] ml-1">{new Date(program.deadline).toLocaleDateString()}</b>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/20">
                <CheckCircle size={18} className="text-emerald-500" />
                <span className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Статус: Активна</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[var(--border-color)] w-full mb-10" />

          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Info size={16} className="text-[#6d28d9] opacity-60" />
              <h3 className="text-[var(--text-gray)] font-black uppercase text-xs tracking-[2px]">
                Опис та вимоги програми:
              </h3>
            </div>
            <div
              className="rich-content text-lg leading-relaxed font-medium prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </div>

          <div
            className="flex justify-center border-t border-[var(--border-color)] pt-12"
            data-aos="fade-up"
          >
            <button
              className="bg-[#6d28d9] text-white px-12 py-5 rounded-[24px] font-black text-xl shadow-xl shadow-purple-500/20 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              onClick={handleApply}
            >
              <Send size={22} /> Подати заявку на участь
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramDetails;