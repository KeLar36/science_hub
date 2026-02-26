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
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [myProjects, setMyProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const api = axios.create({
    baseURL: 'http://51.21.180.152/api',
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
    });
  };

  const filteredProjects = myProjects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaff]">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full py-10 px-4">

        {/* HERO SECTION */}
        <div className="relative mb-12 p-8 md:p-12 bg-[#1e1b4b] rounded-[40px] overflow-hidden shadow-2xl shadow-purple-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6d28d9] to-transparent opacity-20 blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-10 blur-3xl ml-10 mb-10"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-200 text-xs font-black uppercase tracking-[2px] mb-4 border border-purple-500/30">
                <Stars size={14} /> Експертна оцінка
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Ваша черга <br /><span className="text-[#a78bfa]">вершити науку</span> ✍️
              </h1>
              <p className="text-purple-200/70 font-medium max-w-md">
                Опрацюйте подані заявки, щоб допомогти авторам досягти досконалості. У вас <span className="text-white font-bold">{myProjects.length} активних завдань</span>.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-white transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Швидкий пошук роботи..."
                  className="w-full md:w-80 pl-14 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-[24px] text-white placeholder-purple-300/50 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all font-bold"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-[#6d28d9] rounded-full animate-spin mb-4"></div>
            <p className="text-[#1e1b4b] font-black uppercase tracking-widest text-xs">Завантаження бази...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-purple-100">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#6d28d9]">
              <Bookmark size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-[#1e1b4b]">Горизонт чистий!</h3>
            <p className="text-gray-400 mt-2 font-medium">Нові завдання з'являться тут після призначення модератором.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredProjects.map((proj, index) => (
              <div key={proj._id}
                className="relative group bg-white rounded-[35px] border border-purple-50 p-6 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}>

                {/* Status Float */}
                <div className="absolute -top-4 left-10 flex gap-2">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg border-2 ${proj.status === 'На розгляді' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-amber-500 border-amber-300 text-white'
                    }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[#6d28d9] text-[10px] font-black uppercase tracking-[2px] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        {proj.domain}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">ID: {proj._id.slice(-6)}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-[#1e1b4b] leading-tight transition-colors group-hover:text-[#6d28d9]">
                      {proj.title}
                    </h3>

                    <div className="flex items-center gap-4 py-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <User size={24} className="text-[#1e1b4b]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Автор публікації</p>
                        <p className="text-lg font-black text-[#1e1b4b]">{proj.authorId?.name || 'Незареєстрований автор'}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50/50 rounded-[28px] p-6 text-gray-700 leading-relaxed font-medium relative border border-purple-50">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={40} /></div>
                      <div dangerouslySetInnerHTML={{ __html: proj.description }} className="prose prose-purple max-w-none text-sm md:text-base" />
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full lg:w-72 space-y-4">
                    <a
                      href={proj.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn w-full flex items-center justify-between bg-[#1e1b4b] text-white p-5 rounded-[24px] font-black hover:bg-[#6d28d9] transition-all shadow-xl shadow-purple-100 active:scale-95"
                    >
                      <span>Переглянути працю</span>
                      <FileDown size={22} className="group-hover/btn:translate-y-1 transition-transform" />
                    </a>

                    <button
                      onClick={() => {
                        setActiveCommentId(activeCommentId === proj._id ? null : proj._id);
                        setCommentText('');
                      }}
                      className={`w-full flex items-center justify-between p-5 rounded-[24px] font-black border-2 transition-all active:scale-95 ${activeCommentId === proj._id
                          ? 'bg-purple-100 border-purple-200 text-[#6d28d9]'
                          : 'bg-white border-purple-50 text-[#6d28d9] hover:border-purple-200'
                        }`}
                    >
                      <span>Винести рішення</span>
                      <MessageSquare size={22} />
                    </button>
                  </div>
                </div>

                {/* Verdict Form */}
                {activeCommentId === proj._id && (
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-purple-100 animate-scale-in">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-3 ml-2">Рецензія та зауваження</label>
                    <textarea
                      className="w-full border-2 border-purple-50 rounded-[24px] p-6 text-base focus:border-[#6d28d9] focus:ring-4 focus:ring-purple-500/5 outline-none transition-all bg-gray-50/30 font-bold placeholder:text-gray-300"
                      rows="4"
                      placeholder="Опишіть сильні сторони та помилки роботи..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <button onClick={() => handleSubmitDecision(proj._id, 'Відхилено')}
                        className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-4 rounded-[20px] font-black hover:bg-rose-600 hover:text-white transition-all group/v">
                        <XCircle size={20} /> Відхилити
                      </button>
                      <button onClick={() => handleSubmitDecision(proj._id, 'На доопрацюванні')}
                        className="flex items-center justify-center gap-2 bg-amber-50 text-amber-600 py-4 rounded-[20px] font-black hover:bg-amber-600 hover:text-white transition-all group/v">
                        <Clock size={20} /> На доопрацювання
                      </button>
                      <button onClick={() => handleSubmitDecision(proj._id, 'Прийнято')}
                        className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-4 rounded-[20px] font-black hover:bg-emerald-600 hover:text-white transition-all group/v shadow-lg shadow-emerald-100/50">
                        <CheckCircle size={20} /> Схвалити працю
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