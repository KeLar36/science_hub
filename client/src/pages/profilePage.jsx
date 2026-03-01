import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast, { Toaster } from 'react-hot-toast';
import {
  FileText, User as UserIcon, ShieldAlert, PlusCircle,
  Tag, ClipboardCheck, Star, Calendar, ArrowUpRight, UploadCloud,
  FileUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const ProfilePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const location = useLocation();

  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token] = useState(() => localStorage.getItem('token'));
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

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchData = async () => {
    if (!user?.id || !token) return;
    try {
      const [resArticles, resPrograms] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/user/${user.id}`, authConfig),
        axios.get(`${apiUrl}/api/programs`)
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
    const data = new FormData();
    data.append('file', revisionFile);
    data.append('authorComment', 'Виправлено згідно із зауваженнями рецензента');

    toast.promise(
      axios.patch(`${apiUrl}/api/projects/revision/${projectId}`, data, {
        headers: { ...authConfig.headers, 'Content-Type': 'multipart/form-data' }
      }),
      {
        loading: 'Надсилаємо оновлений файл...',
        success: () => { fetchData(); return <b>Версію успішно оновлено! ✨</b>; },
        error: <b>Помилка при оновленні версії.</b>,
      }
    );
  };

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Будь ласка, оберіть файл!");
    const data = new FormData();
    data.append('title', articleData.title);
    data.append('description', articleData.abstract);
    data.append('programId', articleData.programId);
    data.append('domain', articleData.domain);
    data.append('authorId', user.id);
    data.append('file', file);

    setLoading(true);
    toast.promise(
      axios.post(`${apiUrl}/api/projects/create`, data, {
        headers: { ...authConfig.headers, 'Content-Type': 'multipart/form-data' }
      }),
      {
        loading: 'Публікуємо вашу працю...',
        success: () => {
          setTimeout(() => {
            setView('list');
            fetchData();
            setArticleData({ title: '', abstract: '', programId: '', domain: '' });
            setFile(null);
          }, 1500);
          return <b>Статтю успішно надіслано! 🚀</b>;
        },
        error: (err) => <b>{err.response?.data?.error || "Помилка завантаження статті"}</b>,
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-500">
      <Toaster position="top-center" />
      <Navbar />

      <style>{`
        .ql-container { background: var(--bg-card); color: var(--text-main); border-color: var(--border-color) !important; border-radius: 0 0 16px 16px; }
        .ql-toolbar { background: var(--bg-main); border-color: var(--border-color) !important; border-radius: 16px 16px 0 0; }
        .ql-editor.ql-blank::before { color: var(--text-gray); opacity: 0.5; }
        .ql-snow .ql-stroke { stroke: var(--text-dark); }
      `}</style>

      <main className="py-24 px-4 max-w-6xl mx-auto w-full flex-grow">

        <div
          className="mb-8 bg-[var(--bg-card)] p-6 rounded-[32px] shadow-sm border border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6"
          data-aos="fade-down"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--purple-light)] border border-[var(--border-color)]">
              <UserIcon size={32} className="text-[#6d28d9]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--text-dark)] flex items-center gap-3">
                {user?.name}
                <span className="bg-[#6d28d9] text-white px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider">
                  {user?.role}
                </span>
              </h1>
              <p className="text-[var(--text-gray)] text-sm font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">

            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--purple-light)] text-[#6d28d9] border border-[var(--border-color)] rounded-2xl text-sm font-black hover:bg-[#6d28d9] hover:text-white transition-all group"
              >
                <ShieldAlert size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Адмін</span>
              </button>
            )}

            {(user?.role === 'reviewer') && (
              <button
                onClick={() => navigate('/reviewer')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--purple-light)] text-[#6d28d9] border border-[var(--border-color)] rounded-2xl text-sm font-black hover:bg-[#6d28d9] hover:text-white transition-all group"
              >
                <ClipboardCheck size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Рецензент</span>
              </button>
            )}

            {(user?.role === 'content-manager') && (
              <button
                onClick={() => navigate('/content-manager')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--purple-light)] text-[#6d28d9] border border-[var(--border-color)] rounded-2xl text-sm font-black hover:bg-[#6d28d9] hover:text-white transition-all group"
              >
                <FileText size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Контент</span>
              </button>
            )}

            <div className="h-8 w-[1px] bg-[var(--border-color)] mx-2 hidden md:block self-center opacity-50"></div>

            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${view === 'list'
                  ? 'bg-[#6d28d9] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-transparent text-[var(--text-gray)] border border-[var(--border-color)] hover:border-[#6d28d9] hover:text-[#6d28d9]'
                }`}
              onClick={() => setView('list')}
            >
              <FileText size={18} /> Мої статті
            </button>

            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${view === 'form'
                  ? 'bg-[#6d28d9] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-transparent text-[var(--text-gray)] border border-[var(--border-color)] hover:border-[#6d28d9] hover:text-[#6d28d9]'
                }`}
              onClick={() => setView('form')}
            >
              <PlusCircle size={18} /> Подати роботу
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div key="list-view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Всього робіт', value: articles.length, icon: <FileText size={24} />, color: 'text-[#6d28d9]', bg: 'bg-[var(--purple-light)]' },
                { label: 'Прийнято', value: articles.filter(a => a.status === 'Прийнято').length, icon: <ClipboardCheck size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Доопрацювання', value: articles.filter(a => a.status === 'На доопрацюванні').length, icon: <Star size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm flex items-center gap-4 hover:translate-y-[-5px] transition-transform"
                >
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-[var(--text-gray)] tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-[var(--text-dark)]">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-black text-[var(--text-dark)] mb-6">Ваші публікації</h3>

            <div className="space-y-6">
              {articles.length === 0 ? (
                <div className="bg-[var(--bg-card)] p-16 rounded-[40px] border border-dashed border-[var(--border-color)] text-center text-[var(--text-gray)]">
                  Ви ще не подали жодної статті.
                </div>
              ) : (
                articles.map((art, index) => (
                  <div
                    key={art._id}
                    className="p-8 bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${art.status === 'Прийнято' ? 'bg-emerald-500/20 text-emerald-500' :
                        art.status === 'На доопрацюванні' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                        {art.status}
                      </span>
                      <button onClick={() => navigate(`/project/${art._id}`)} className="text-[var(--text-gray)] hover:text-[#6d28d9] transition-all">
                        <ArrowUpRight size={24} />
                      </button>
                    </div>
                    <h4 className="text-xl font-bold text-[var(--text-dark)] mb-4">{art.title}</h4>
                    <div className="flex gap-4 text-xs text-[var(--text-gray)]">
                      <span className="flex items-center gap-1.5 font-bold text-[#6d28d9] bg-[var(--purple-light)] px-3 py-1 rounded-lg">
                        <Tag size={14} /> {art.domain}
                      </span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>

                    {art.status === 'На доопрацюванні' && (
                      <div className="mt-6 pt-6 border-t border-dashed border-[var(--border-color)] flex justify-end">
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
          </div>
        ) : (
          <div key="form-view" className="bg-[var(--bg-card)] p-10 rounded-[40px] border border-[var(--border-color)] shadow-sm">
            <h3 className="text-2xl font-black text-[var(--text-dark)] mb-8">Нова публікація</h3>
            <form onSubmit={handleSubmitArticle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-gray)] mb-2">Наукова програма</label>
                  <select
                    className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl outline-none focus:border-[#6d28d9]"
                    value={articleData.programId}
                    onChange={handleProgramChange}
                    required
                  >
                    <option value="">Оберіть програму...</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="w-full p-4 bg-[var(--purple-light)] text-[#6d28d9] rounded-2xl text-sm font-bold border border-[var(--border-color)]">
                    Галузь: {articleData.domain || 'Автоматично'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-gray)] mb-2">Назва статті</label>
                <input
                  className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl outline-none focus:border-[#6d28d9] font-bold"
                  placeholder="Введіть повну назву вашої роботи..."
                  value={articleData.title}
                  onChange={e => setArticleData({ ...articleData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-gray)] mb-2">Анотація</label>
                <div className="rounded-2xl overflow-hidden">
                  <ReactQuill theme="snow" value={articleData.abstract} onChange={(val) => setArticleData({ ...articleData, abstract: val })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-gray)] mb-2">Файл (PDF)</label>
                <div className={`relative border-2 border-dashed rounded-[32px] p-10 text-center transition-all ${file ? 'border-[#6d28d9] bg-[var(--purple-light)]' : 'border-[var(--border-color)] bg-[var(--bg-main)]'}`}>
                  <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <UploadCloud size={48} className={`mx-auto mb-2 ${file ? 'text-[#6d28d9]' : 'text-[var(--text-gray)]'}`} />
                  <p className="font-bold text-[var(--text-dark)]">{file ? file.name : "Оберіть PDF/DOCX файл"}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black text-xl hover:bg-[#5b21b6] shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
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