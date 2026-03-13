import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search, Clock, ChevronRight, BookOpen, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ["Всі", "Новини", "Поради", "Конференції", "Інтерв'ю", "Методологія"];

const Blog = () => {
   const [posts, setPosts] = useState([]);
   const [filteredPosts, setFilteredPosts] = useState([]);
   const [activeCategory, setActiveCategory] = useState("Всі");
   const [searchQuery, setSearchQuery] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/posts`);
            setPosts(res.data);
            setFilteredPosts(res.data);
         } catch (err) {
            console.error("Помилка при завантаженні блогу", err);
         } finally {
            setLoading(false);
         }
      };
      fetchPosts();
   }, []);

   const stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const text = doc.body.textContent || "";
      return text.replace(/\s+/g, ' ').trim();
   };

   useEffect(() => {
      let result = posts;
      if (activeCategory !== "Всі") {
         result = result.filter(post => post.category === activeCategory);
      }
      if (searchQuery) {
         result = result.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }
      setFilteredPosts(result);
   }, [activeCategory, searchQuery, posts]);

   return (
      <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300">
         <Navbar />

         <header className="py-20 px-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="max-w-4xl mx-auto text-center mt-5" data-aos="zoom-out-up">
               <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold uppercase tracking-wider mb-6">
                  Академічний журнал
               </span>
               <h1 className="text-4xl md:text-6xl font-black text-[var(--text-dark)] mb-6">
                  Блог <span className="text-[#6d28d9]">SciencePlatform</span>
               </h1>
               <p className="text-[var(--text-gray)] text-lg mb-10 max-w-2xl mx-auto">
                  Найновіші дослідження, поради для науковців та новини академічної спільноти.
               </p>

               <div className="relative max-w-xl mx-auto group">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-[#6d28d9] transition-colors" />
                  <input
                     type="text"
                     className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 text-[var(--text-dark)] font-bold transition-all"
                     placeholder="Пошук статей за назвою..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex overflow-x-auto no-scrollbar gap-3 mb-12 pb-2" data-aos="fade-right">
               {CATEGORIES.map((cat) => (
                  <button
                     key={cat}
                     className={`px-6 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all border ${activeCategory === cat
                           ? 'bg-[#6d28d9] text-white border-[#6d28d9] shadow-lg shadow-purple-500/20'
                           : 'bg-[var(--bg-card)] text-[var(--text-gray)] border-[var(--border-color)] hover:border-[#6d28d9] hover:text-[#6d28d9]'
                        }`}
                     onClick={() => setActiveCategory(cat)}
                  >
                     {cat}
                  </button>
               ))}
            </div>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-[var(--text-gray)] font-bold italic">Завантаження знань...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                     <article
                        key={post._id || post.id}
                        className="group bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col h-full"
                        data-aos="fade-up"
                        data-aos-delay={index % 3 * 100}
                     >
                        <div className="relative h-60 overflow-hidden">
                           <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase">
                              {post.category}
                           </div>
                           <img
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              src={post.coverImage || post.image || 'https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80'}
                              alt={post.title}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80'; }}
                           />
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                           <div className="flex items-center gap-4 text-[var(--text-gray)] text-xs font-bold mb-4">
                              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#6d28d9]" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#6d28d9]" /> 5 хв</span>
                           </div>

                           <h3 className="text-xl font-black text-[var(--text-dark)] mb-4 line-clamp-2 leading-snug group-hover:text-[#6d28d9] transition-colors">
                              {post.title}
                           </h3>

                           <p className="text-[var(--text-gray)] text-sm leading-relaxed mb-6 line-clamp-3">
                              {stripHtml(post.content).substring(0, 120)}...
                           </p>

                           <button
                              className="mt-auto flex items-center gap-2 text-[#6d28d9] font-black text-sm group/btn"
                              onClick={() => window.location.href = `/blog/${post._id || post.id}`}
                           >
                              Читати далі
                              <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                           </button>
                        </div>
                     </article>
                  ))}
               </div>
            )}

            {!loading && filteredPosts.length === 0 && (
               <div className="text-center py-20 bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] border-dashed" data-aos="zoom-in">
                  <BookOpen size={64} className="mx-auto text-[var(--border-color)] mb-4" />
                  <p className="text-[var(--text-gray)] text-xl font-bold">Статей у цій категорії поки немає</p>
               </div>
            )}
         </main>

         <Footer />
      </div>
   );
};

export default Blog;