import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  PlusCircle, CheckCircle, BarChart3, ShieldCheck,
  Ban, XCircle, Users, Search, Layers, Calendar, FileText, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'react-quill-new/dist/quill.snow.css';

const SCIENTIFIC_DOMAINS = [
  "Штучний інтелект & IT", "Медицина та фармація", "Економіка та фінанси",
  "Право та юриспруденція", "Природничі науки", "Гуманітарні науки", "Технічні науки & Інженерія"
];

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ],
};

const AdminPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const [formData, setFormData] = useState({
    title: '', description: '', deadline: '', category: 'Науковий журнал', domain: 'Штучний інтелект & IT'
  });

  const darkIndigo = "#1e1b4b";
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      toast.error("Доступ заборонено!");
      navigate('/');
      return;
    }
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProj, resUsers] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/all`, authConfig),
        axios.get(`${apiUrl}/api/users/all`, authConfig)
      ]);
      setProjects(resProj.data);
      setUsersList(resUsers.data);
    } catch (err) {
      toast.error("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = (activeTab === 'projects' ? projects : usersList).filter(item => {
    const search = searchTerm.toLowerCase();
    if (activeTab === 'projects') {
      return item.title?.toLowerCase().includes(search) || item.authorId?.name?.toLowerCase().includes(search);
    }
    return item.name?.toLowerCase().includes(search) || item.email?.toLowerCase().includes(search);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!formData.description || formData.description === '<p><br></p>') {
      return toast.error("Додайте опис програми");
    }
    const creation = axios.post(`${apiUrl}/api/programs/create`, formData, authConfig);
    toast.promise(creation, {
      loading: 'Створення програми...',
      success: <b>Програму опубліковано! 📋</b>,
      error: <b>Помилка створення</b>,
    });
  };

  const toggleBan = async (targetUser) => {
    if (targetUser.role === 'admin') {
      toast.error("Неможливо змінити доступ іншому адміністратору", { icon: '🛡️' });
      return;
    }
    try {
      await axios.patch(`${apiUrl}/api/users/ban/${targetUser._id}`, { isBanned: !targetUser.isBanned }, authConfig);
      setUsersList(usersList.map(u => u._id === targetUser._id ? { ...u, isBanned: !targetUser.isBanned } : u));
      !targetUser.isBanned ? toast.error("Користувача заблоковано") : toast.success("Доступ поновлено");
    } catch (err) {
      toast.error("Помилка доступу до бази");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${apiUrl}/api/projects/status/${id}`, { status }, authConfig);
      toast.success(`Статус оновлено: ${status}`);
      loadData();
    } catch (err) { toast.error("Помилка зміни статусу"); }
  };

  const changeRole = async (targetUser, newRole) => {
    if (targetUser.role === 'admin' && targetUser._id !== user.id) {
      toast.error("Ви не можете змінювати роль іншого адміністратора");
      return;
    }
    try {
      await axios.patch(`${apiUrl}/api/users/role/${targetUser._id}`, { role: newRole }, authConfig);
      setUsersList(usersList.map(u => u._id === targetUser._id ? { ...u, role: newRole } : u));
      toast.success(`Роль змінена на ${newRole}`);
    } catch (err) { toast.error("Помилка зміни ролі"); }
  };

  const assignReviewer = async (projectId, reviewerId) => {
    try {
      await axios.patch(`${apiUrl}/api/projects/assign/${projectId}`, { reviewerId }, authConfig);
      toast.success("Рецензента призначено");
      loadData();
    } catch (err) { toast.error("Помилка призначення"); }
  };

  const reviewers = usersList.filter(u => u.role === 'reviewer');

  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="p-6 border-t border-purple-50 flex items-center justify-between bg-gray-50/30">
        <span className="text-xs font-bold text-gray-400">
          Сторінка {currentPage} з {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'border-gray-100 text-gray-300' : 'border-purple-100 text-[#6d28d9] hover:bg-[#6d28d9] hover:text-white'}`}
          >
            <ChevronLeft size={18} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-[#6d28d9] text-white' : 'bg-white text-gray-400 hover:bg-purple-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'border-gray-100 text-gray-300' : 'border-purple-100 text-[#6d28d9] hover:bg-[#6d28d9] hover:text-white'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: darkIndigo,
            color: '#fff',
            padding: '16px',
            fontWeight: 'bold',
          }
        }}
      />
      <Navbar />

      <div className="bg-white border-b border-purple-50 sticky top-[70px] z-20 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex sm:justify-center gap-2 sm:gap-8 min-w-max">
          {[
            { id: 'projects', label: 'Заявки', icon: BarChart3 },
            { id: 'create', label: 'Нова програма', icon: PlusCircle },
            { id: 'users', label: 'Користувачі', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-5 px-4 border-b-2 transition-all font-bold text-sm ${activeTab === tab.id ? 'border-[#6d28d9] text-[#6d28d9]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap py-15 gap-4 md:gap-6 mb-10 w-[90%] lg:w-[80%] self-center m-3">
        {[
          { label: 'Усього заявок', value: projects.length, color: 'bg-blue-600', shadow: 'shadow-blue-100', icon: FileText },
          { label: 'На розгляді', value: projects.filter(p => p.status === 'На розгляді').length, color: 'bg-amber-500', shadow: 'shadow-amber-100', icon: Clock },
          { label: 'Прийнято', value: projects.filter(p => p.status === 'Прийнято').length, color: 'bg-emerald-500', shadow: 'shadow-emerald-100', icon: CheckCircle },
          { label: 'Користувачів', value: usersList.length, color: 'bg-[#6d28d9]', shadow: 'shadow-purple-100', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="flex-1 min-w-[200px] bg-white p-6 rounded-[32px] border border-purple-50 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl group">
            <div className={`w-12 h-12 ${stat.color} rounded-[18px] flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-xl font-black text-[#1e1b4b]">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full py-6 px-4">
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-sm border border-purple-50 p-6 md:p-10 animate-fade-in">
            <div className="flex items-center gap-4 mb-8 text-[#1e1b4b]">
              <PlusCircle size={32} />
              <h2 className="text-2xl font-black">Нова наукова програма</h2>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 mb-2 ml-1 uppercase">Назва програми</label>
                <input className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-purple-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#1e1b4b]" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Наприклад: AI у медицині 2026" required />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 mb-2 ml-1 uppercase">Опис та умови</label>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <ReactQuill theme="snow" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} modules={quillModules} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="date" className="p-4 bg-gray-50 rounded-2xl font-bold" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
                <select className="p-4 bg-gray-50 rounded-2xl font-bold appearance-none" value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })}>
                  {SCIENTIFIC_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button className="w-full py-5 bg-[#6d28d9] text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-[0.98]">
                Опублікувати програму
              </button>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-purple-50 overflow-hidden">
            <div className="p-8 border-b border-purple-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-black text-[#1e1b4b]">Керування доступом</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 font-bold" placeholder="Пошук..." onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] uppercase font-black text-gray-400">
                    <th className="px-8 py-5">Статус</th>
                    <th className="px-8 py-5">Ім'я та Email</th>
                    <th className="px-8 py-5">Роль</th>
                    <th className="px-8 py-5 text-right">Управління</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {currentItems.map((item) => (
                    <tr key={item._id} className={`hover:bg-purple-50/30 transition-all ${item.isBanned ? 'bg-rose-50/20' : ''}`}>
                      <td className="px-8 py-6">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.isBanned ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {item.isBanned ? <Ban size={20} /> : <ShieldCheck size={20} />}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`font-black text-[#1e1b4b] ${item.isBanned ? 'line-through opacity-40' : ''}`}>{item.name}</div>
                        <div className="text-xs text-gray-400 font-bold">{item.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <select
                          className="bg-white border border-purple-50 rounded-xl px-3 py-2 text-xs font-black text-[#6d28d9] outline-none"
                          value={item.role}
                          onChange={(e) => changeRole(item, e.target.value)}
                          disabled={item._id === user.id}
                        >
                          <option value="user">User</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${item._id === user.id || item.role === 'admin'
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : item.isBanned
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                            }`}
                          onClick={() => toggleBan(item)}
                          disabled={item._id === user.id || item.role === 'admin'}
                        >
                          {item.role === 'admin' ? "Admin Protected" : item.isBanned ? "Розблокувати" : "Заблокувати"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-purple-50 overflow-hidden">
            <div className="p-8 border-b border-purple-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-black text-[#1e1b4b]">Моніторинг заявок</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 font-bold" placeholder="Пошук публікацій..." onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] uppercase font-black text-gray-400">
                    <th className="px-8 py-5">Автор та тема</th>
                    <th className="px-6 py-5">Галузь</th>
                    <th className="px-6 py-5">Рецензент</th>
                    <th className="px-6 py-5 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {currentItems.map(item => (
                    <tr key={item._id} className="hover:bg-purple-50/20 transition-all">
                      <td className="px-8 py-6">
                        <div className="font-black text-[#1e1b4b] text-sm">{item.authorId?.name || 'Анонім'}</div>
                        <div className="text-xs text-gray-400 font-bold italic">{item.title}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-purple-50 text-[#6d28d9] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-purple-100 whitespace-nowrap">{item.domain}</span>
                      </td>
                      <td className="px-6 py-6">
                        <select className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:ring-2 focus:ring-purple-100 text-gray-600 cursor-pointer" value={item.reviewerId?._id || ""} onChange={(e) => assignReviewer(item._id, e.target.value)}>
                          <option value="">Не призначено</option>
                          {reviewers.map(rev => <option key={rev._id} value={rev._id}>{rev.name}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${item.status === 'Прийнято' ? 'text-emerald-600 bg-emerald-50' : item.status === 'Відхилено' ? 'text-rose-600 bg-rose-50' : 'text-indigo-600 bg-indigo-50'}`}>
                            {item.status}
                          </span>
                          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" onClick={() => updateStatus(item._id, 'Прийнято')}><CheckCircle size={18} /></button>
                          <button className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" onClick={() => updateStatus(item._id, 'Відхилено')}><XCircle size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;