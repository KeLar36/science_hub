import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  ClipboardCheck, FileText, CheckCircle, AlertCircle,
  Clock, FileDown, XCircle, MessageSquare, Search,
  User, Bookmark, ArrowRight, Stars
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ReviewerPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [myProjects, setMyProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const api = axios.create({
    baseURL: `${apiUrl}/api`,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    if (user?.id) loadMyAssignments();
  }, [user?.id]);

  const loadMyAssignments = async () => {
    try {
      const res = await api.get(`/projects/reviewer/${user.id}`);
      const activeProjects = res.data.filter(proj =>
        proj.status === 'На розгляді' || proj.status === 'На доопрацюванні'
      );
      setMyProjects(activeProjects);
    } catch (err) {
      toast.error("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async (projectId, newStatus) => {
    if (!commentText && newStatus !== 'Прийнято') {
      toast.error("Додайте обґрунтування рішення");
      return;
    }

    const decisionPromise = api.patch(`/projects/submit-review/${projectId}`, {
      status: newStatus,
      reviewerComments: commentText,
    });

    toast.promise(decisionPromise, {
      loading: 'Надсилаємо вердикт...',
      success: () => {
        setMyProjects(prev => prev.filter(p => p._id !== projectId));
        setActiveCommentId(null);
        setCommentText('');
        return <b>Рішення зафіксовано! ✨</b>;
      },
      error: <b>Помилка відправки.</b>
    }, {
      style: { borderRadius: '15px', background: 'var(--text-dark)', color: 'var(--bg-main)' }
    });
  };

  const filteredProjects = myProjects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full py-12 px-4 md:py-20 mt-5">

        <div
          className="relative mb-16 p-10 md:p-16 bg-[#1e1b4b] rounded-[48px] overflow-hidden shadow-2xl shadow-purple-500/10"
          data-aos="zoom-in"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#6d28d9] to-transparent opacity-30 blur-[80px] -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div data-aos="fade-right" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-200 text-xs font-black uppercase tracking-[2px] mb-6 border border-purple-500/30">
                <Stars size={14} /> Експертна оцінка
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]">
                Ваша черга <br /><span className="text-[#a78bfa]">вершити науку</span> ✍️
              </h1>
              <p className="text-purple-200/70 font-medium max-w-md text-lg">
                Опрацюйте подані заявки. У вас <span className="text-white font-bold">{myProjects.length} активних завдань</span>.
              </p>
            </div>

            <div className="w-full lg:w-auto" data-aos="fade-left">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-white transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Швидкий пошук роботи..."
                  className="w-full lg:w-96 pl-14 pr-6 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] text-white placeholder-purple-300/50 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all font-bold text-lg"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="custom-loader !border-t-[#6d28d9]"></div>
            <p className="text-[var(--text-gray)] font-black uppercase tracking-widest text-xs mt-6">Синхронізація проектів...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-32 bg-[var(--bg-card)] rounded-[48px] border-2 border-dashed border-[var(--border-color)]" data-aos="fade-up">
            <div className="w-24 h-24 bg-[var(--purple-light)] rounded-full flex items-center justify-center mx-auto mb-6 text-[#6d28d9]">
              <Bookmark size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-dark)] uppercase">Горизонт чистий!</h3>
            <p className="text-[var(--text-gray)] mt-2 font-medium">Нові завдання з'являться тут автоматично.</p>
          </div>
        ) : (
          <div className="grid gap-10">
            {filteredProjects.map((proj, index) => (
              <div key={proj._id}
                className="relative group bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] p-8 md:p-12 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="absolute -top-4 left-10">
                  <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg border-2 ${proj.status === 'На розгляді'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-amber-500 border-amber-300 text-white'
                    }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="flex-grow space-y-6">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="text-[#6d28d9] text-[11px] font-black uppercase tracking-[2px] bg-[var(--purple-light)] px-4 py-1.5 rounded-xl border border-[var(--border-color)]">
                        {proj.domain}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-gray)] opacity-30"></div>
                      <span className="text-[var(--text-gray)] text-xs font-bold uppercase tracking-widest opacity-60">ID: {proj._id.slice(-6)}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-[var(--text-dark)] leading-tight group-hover:text-[#6d28d9] transition-colors">
                      {proj.title}
                    </h3>

                    <div className="flex items-center gap-4 py-2">
                      <div className="w-14 h-14 bg-[var(--bg-main)] rounded-2xl flex items-center justify-center border border-[var(--border-color)]">
                        <User size={28} className="text-[var(--text-dark)]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-[2px]">Автор публікації</p>
                        <p className="text-xl font-black text-[var(--text-dark)]">{proj.authorId?.name || 'Незареєстрований автор'}</p>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-main)] rounded-[32px] p-8 text-[var(--text-main)] leading-relaxed font-medium relative border border-[var(--border-color)]">
                      <div className="absolute top-0 right-0 p-6 opacity-5 text-[#6d28d9]"><FileText size={60} /></div>
                      <div
                        dangerouslySetInnerHTML={{ __html: proj.description }}
                        className="prose prose-purple dark:prose-invert max-w-none text-base md:text-lg text-[var(--text-main)]"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-80 space-y-4 shrink-0">
                    <a
                      href={proj.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn w-full flex items-center justify-between bg-[var(--text-dark)] text-[var(--bg-main)] p-6 rounded-[28px] font-black hover:bg-[#6d28d9] hover:text-white transition-all shadow-xl shadow-purple-500/5 active:scale-95"
                    >
                      <span>Читати працю</span>
                      <FileDown size={22} className="group-hover/btn:translate-y-1 transition-transform" />
                    </a>

                    <button
                      onClick={() => {
                        setActiveCommentId(activeCommentId === proj._id ? null : proj._id);
                        setCommentText('');
                      }}
                      className={`w-full flex items-center justify-between p-6 rounded-[28px] font-black border-2 transition-all active:scale-95 ${activeCommentId === proj._id
                        ? 'bg-[#6d28d9] border-[#6d28d9] text-white'
                        : 'bg-transparent border-[var(--border-color)] text-[var(--text-dark)] hover:border-[#6d28d9]'
                        }`}
                    >
                      <span>{activeCommentId === proj._id ? 'Скасувати' : 'Винести рішення'}</span>
                      <MessageSquare size={22} />
                    </button>
                  </div>
                </div>

                {activeCommentId === proj._id && (
                  <div className="mt-12 pt-12 border-t-2 border-dashed border-[var(--border-color)] animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="block text-[11px] font-black text-[var(--text-gray)] uppercase tracking-[3px] mb-4 ml-2">Експертний висновок</label>
                    <textarea
                      className="w-full border-2 border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-dark)] rounded-[32px] p-8 text-lg focus:border-[#6d28d9] focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-bold placeholder:text-[var(--text-gray)] opacity-60"
                      rows="5"
                      placeholder="Детально опишіть ваші зауваження або рекомендації для автора..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                      <button onClick={() => handleSubmitDecision(proj._id, 'Відхилено')}
                        className="flex items-center justify-center gap-3 bg-rose-500/10 text-rose-500 py-5 rounded-[24px] font-black hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5">
                        <XCircle size={22} /> Відхилити
                      </button>
                      <button onClick={() => handleSubmitDecision(proj._id, 'На доопрацюванні')}
                        className="flex items-center justify-center gap-3 bg-amber-500/10 text-amber-500 py-5 rounded-[24px] font-black hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/5">
                        <Clock size={22} /> Доопрацювання
                      </button>
                      <button onClick={() => handleSubmitDecision(proj._id, 'Прийнято')}
                        className="flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 rounded-[24px] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                        <CheckCircle size={22} /> Схвалити працю
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ReviewerPage;