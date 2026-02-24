import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast, { Toaster } from 'react-hot-toast';
import {
  FileText, User as UserIcon, ShieldAlert, PlusCircle,
  Tag, ClipboardCheck, Star, Calendar, ArrowUpRight, UploadCloud,
  MessageSquare, FileUp, History, Eye, CircleFadingPlus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token] = useState(() => localStorage.getItem('token')); // Отримуємо токен
  const [view, setView] = useState(location.state?.programId ? 'form' : 'list');

  const [articles, setArticles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [articleData, setArticleData] = useState({
    title: '',
    abstract: '',
    programId: location.state?.programId || '',
    domain: ''
  });

  const deepPurple = "#6d28d9";
  const darkIndigo = "#1e1b4b";

  // Конфігурація для axios з токеном
  const authConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchData = async () => {
    if (!user?.id || !token) return;
    try {
      const [resArticles, resPrograms] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/user/${user.id}`, authConfig),
        axios.get('http://localhost:5000/api/programs')
      ]);

      setArticles(resArticles.data);
      setPrograms(resPrograms.data);

      if (location.state?.programId) {
        const selected = resPrograms.data.find(p => p._id === location.state.programId);
        if (selected) {
          setArticleData(prev => ({ ...prev, domain: selected.domain }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Помилка завантаження даних профілю");
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user?.id, token]);

  const handleProgramChange = (e) => {
    const selectedId = e.target.value;
    const prog = programs.find(p => p._id === selectedId);
    setArticleData({
      ...articleData,
      programId: selectedId,
      domain: prog?.domain || ''
    });
  };

  const handleUploadRevision = async (projectId, revisionFile) => {
    if (!revisionFile) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(revisionFile.type)) {
      return toast.error("Дозволено лише PDF або DOCX файли!");
    }

    const data = new FormData();
    data.append('file', revisionFile);
    data.append('authorComment', 'Виправлено згідно із зауваженнями рецензента');

    toast.promise(
      axios.patch(`http://localhost:5000/api/projects/revision/${projectId}`, data, {
        headers: {
          ...authConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      }),
      {
        loading: 'Надсилаємо оновлений файл...',
        success: () => {
          fetchData();
          return <b>Версію успішно оновлено! ✨</b>;
        },
        error: <b>Помилка при оновленні версії.</b>,
      },
      {
        style: { borderRadius: '14px', background: darkIndigo, color: '#fff' },
        success: { iconTheme: { primary: deepPurple, secondary: '#fff' } }
      }
    );
  };

  // Подача нової роботи
  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Будь ласка, оберіть файл!");

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Дозволено лише PDF або DOCX файли!");
    }

    const data = new FormData();
    data.append('title', articleData.title);
    data.append('description', articleData.abstract);
    data.append('programId', articleData.programId);
    data.append('domain', articleData.domain);
    data.append('authorId', user.id);
    data.append('file', file);

    setLoading(true);

    toast.promise(
      axios.post('http://localhost:5000/api/projects/create', data, {
        headers: {
          ...authConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      }),
      {
        loading: 'Публікуємо вашу працю...',
        success: () => {
          setTimeout(() => {
            setView('list');
            fetchData();
            // Очищення стейту форми
            setArticleData({ title: '', abstract: '', programId: '', domain: '' });
            setFile(null);
          }, 1500);
          return <b>Статтю успішно надіслано! 🚀</b>;
        },
        error: (err) => <b>{err.response?.data?.error || "Помилка завантаження статті"}</b>,
      },
      {
        style: { borderRadius: '14px', background: darkIndigo, color: '#fff' },
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      <Toaster position="top-center" />
      <Navbar />

      <main className="py-10 px-4 max-w-6xl mx-auto w-full flex-grow">

        {/* Profile Info Card */}
        <div className="mb-8 bg-white p-6 rounded-[32px] shadow-sm border border-purple-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#f5f3ff] border border-purple-100">
              <UserIcon size={32} className="text-[#6d28d9]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1e1b4b] flex items-center gap-3">
                {user?.name}
                <span className="bg-[#6d28d9] text-white px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider">
                  {user?.role}
                </span>
              </h1>
              <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {user?.role === 'admin' && (
              <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all" onClick={() => navigate('/admin')}>
                <ShieldAlert size={18} /> Адмін
              </button>
            )}
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-[#6d28d9] text-white shadow-xl shadow-purple-100' : 'bg-white text-gray-500 border border-gray-100'}`}
              onClick={() => setView('list')}
            >
              <FileText size={18} /> Мої статті
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'form' ? 'bg-[#6d28d9] text-white shadow-xl shadow-purple-100' : 'bg-white text-gray-500 border border-gray-100'}`}
              onClick={() => setView('form')}
            >
              <PlusCircle size={18} /> Подати роботу
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-5 bg-white rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f5f3ff] rounded-xl flex items-center justify-center text-[#6d28d9]"><FileText size={24} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Всього робіт</p>
                  <p className="text-2xl font-black text-[#1e1b4b]">{articles.length}</p>
                </div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><ClipboardCheck size={24} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Прийнято</p>
                  <p className="text-2xl font-black text-[#1e1b4b]">{articles.filter(a => a.status === 'Прийнято').length}</p>
                </div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Star size={24} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Доопрацювання</p>
                  <p className="text-2xl font-black text-[#1e1b4b]">{articles.filter(a => a.status === 'На доопрацюванні').length}</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-black text-[#1e1b4b] mb-6">Ваші публікації</h3>

            {articles.length === 0 ? (
              <div className="bg-white p-16 rounded-[40px] border border-dashed border-gray-200 text-center text-gray-400">
                Ви ще не подали жодної статті.
              </div>
            ) : (
              articles.map(art => (
                <div key={art._id} className="mb-6 p-8 bg-white rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${art.status === 'Прийнято' ? 'bg-emerald-100 text-emerald-700' :
                      art.status === 'На доопрацюванні' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                      {art.status}
                    </span>
                    <button onClick={() => navigate(`/project/${art._id}`)} className="text-gray-300 hover:text-[#6d28d9] transition-all">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                  <h4 className="text-xl font-bold text-[#1e1b4b] mb-4">{art.title}</h4>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 font-bold text-[#6d28d9] bg-[#f5f3ff] px-3 py-1 rounded-lg">
                      <Tag size={14} /> {art.domain}
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(art.createdAt).toLocaleDateString()}</span>
                  </div>

                  {art.status === 'На доопрацюванні' && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex justify-end">
                      <label className="flex items-center gap-3 bg-[#6d28d9] text-white px-6 py-3 rounded-2xl text-sm font-black cursor-pointer hover:bg-[#5b21b6] transition-all">
                        <FileUp size={18} /> Оновити PDF
                        <input type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => handleUploadRevision(art._id, e.target.files[0])} />
                      </label>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* FORM VIEW */
          <div className="bg-white p-10 rounded-[40px] border border-gray-50 shadow-sm animate-fade-in">
            <h3 className="text-2xl font-black text-[#1e1b4b] mb-8">Нова публікація</h3>
            <form onSubmit={handleSubmitArticle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Наукова програма</label>
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#6d28d9]"
                    value={articleData.programId}
                    onChange={handleProgramChange}
                    required
                  >
                    <option value="">Оберіть програму...</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="w-full p-4 bg-[#f5f3ff] text-[#6d28d9] rounded-2xl text-sm font-bold border border-purple-50">
                    Галузь: {articleData.domain || 'Автоматично'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Назва статті</label>
                <input
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#6d28d9] font-bold"
                  placeholder="Введіть повну назву вашої роботи..."
                  value={articleData.title}
                  onChange={e => setArticleData({ ...articleData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Анотація</label>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <ReactQuill theme="snow" value={articleData.abstract} onChange={(val) => setArticleData({ ...articleData, abstract: val })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Файл (PDF)</label>
                <div className={`relative border-2 border-dashed rounded-[32px] p-10 text-center transition-all ${file ? 'border-[#6d28d9] bg-[#f8f7ff]' : 'border-gray-200 bg-gray-50'}`}>
                  <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <UploadCloud size={48} className={`mx-auto mb-2 ${file ? 'text-[#6d28d9]' : 'text-gray-300'}`} />
                  <p className="font-bold text-[#1e1b4b]">{file ? file.name : "Оберіть PDF/DOCX файл"}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black text-xl hover:bg-[#5b21b6] transition-all disabled:opacity-50"
              >
                {loading ? "Завантаження..." : "Відправити на рецензію"}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;