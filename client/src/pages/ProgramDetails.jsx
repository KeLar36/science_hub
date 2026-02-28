import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { theme } from '../styles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await axios.get(`http://51.21.180.152/api/programs/${id}`);
        setProgram(res.data);
      } catch (err) {
        console.error("Помилка завантаження програми:", err);
        toast.error("Не вдалося завантажити деталі програми");
      } finally {
        setLoading(false);
      }
    };
    fetchProgramDetails();
  }, [id]);

  const handleApply = () => {
    if (!user || !token) {
      toast.error("Будь ласка, увійдіть у систему, щоб подати заявку", {
        style: { borderRadius: '15px', background: '#1e1b4b', color: '#fff' }
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
      <div className="loader-container min-h-screen flex items-center justify-center">
        <div className="custom-loader"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="loader-container min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-black text-gray-400 uppercase">Програму не знайдено</h2>
        <button onClick={() => navigate('/')} className="text-[#6d28d9] font-bold underline">
          Повернутися на головну
        </button>
      </div>
    );
  }

  return (
    <div className="program-details-layout">
      <Toaster position="top-right" />
      <Navbar />

      <main className="program-main-container max-w-5xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="back-btn flex items-center gap-2 mb-8 text-gray-500 hover:text-[#6d28d9] transition-all font-bold">
          <ArrowLeft size={18} /> Назад до списку
        </button>

        <div className="program-content-card bg-white rounded-[40px] shadow-sm border border-purple-50 overflow-hidden p-8 md:p-12">
          <div className="header-section mb-8">
            <span className="category-badge bg-purple-50 text-[#6d28d9] px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-4">
              {program.category || 'Наукова програма'}
            </span>
            <h1 className="program-title text-3xl md:text-4xl font-black text-[#1e1b4b] mb-6 leading-tight">
              {program.title}
            </h1>

            <div className="meta-info flex flex-wrap gap-6">
              <div className="info-item flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <Calendar size={18} className="text-[#6d28d9]" />
                <span className="text-sm font-medium">Крайній термін: <b className="text-[#1e1b4b]">{new Date(program.deadline).toLocaleDateString()}</b></span>
              </div>
              <div className="info-item flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                <CheckCircle size={18} className="text-emerald-600" />
                <span className="text-sm font-black text-emerald-700 uppercase tracking-tighter">Статус: Активна</span>
              </div>
            </div>
          </div>

          <div className="program-divider h-[1px] bg-purple-50 w-full mb-8" />

          <div className="description-container mb-12">
            <h3 className="program-section-label text-gray-400 font-black uppercase text-xs tracking-[2px] mb-4">
              Опис та вимоги програми:
            </h3>
            <div
              className="rich-content text-gray-700 leading-relaxed font-medium prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </div>

          <div className="program-action-section flex justify-center border-t border-purple-50 pt-10">
            <button
              className="apply-btn bg-[#6d28d9] text-white px-10 py-5 rounded-[24px] font-black text-xl shadow-xl shadow-purple-100 hover:bg-[#5b21b6] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              onClick={handleApply}
            >
              <Send size={20} /> Подати заявку на участь
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramDetails;