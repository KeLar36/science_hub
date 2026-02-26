import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, ChevronRight, BookOpen, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

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
            const res = await axios.get('http://51.21.180.152/api/posts');
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
      <div className="blog-page">
         <Navbar />

         <header className="blog-header">
            <div className="header-content">
               <span className="header-badge">Академічний журнал</span>
               <h1>Блог <span className="text-purple">SciencePlatform</span></h1>
               <p>Найновіші дослідження, поради для науковців та новини академічної спільноти.</p>

               <div className="search-bar">
                  <Search size={20} className="search-icon" />
                  <input
                     type="text"
                     placeholder="Пошук статей за назвою..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>
         </header>

         <main className="blog-container">
            <div className="categories-scroll">
               <div className="categories-list">
                  {CATEGORIES.map(cat => (
                     <button
                        key={cat}
                        className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            {loading ? (
               <div className="loader">Завантаження знань...</div>
            ) : (
               <div className="posts-grid">
                  {filteredPosts.map((post) => (
                     <article key={post._id || post.id} className="post-card">
                        <div className="post-image-wrapper">
                           <div className="post-category-tag">{post.category}</div>
                           <img
                              src={post.coverImage || post.image || 'https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80'}
                              alt={post.title}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80'; }}
                           />
                        </div>

                        <div className="post-content">
                           <div className="post-meta">
                              <span className="meta-item"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                              <span className="meta-item"><Clock size={14} /> 5 хв</span>
                           </div>
                           <h3 className="post-title">{post.title}</h3>
                           <p className="post-excerpt">
                              {stripHtml(post.content).substring(0, 120)}...
                           </p>
                           <button className="read-more" onClick={() => window.location.href = `/blog/${post._id || post.id}`}>
                              Читати далі <ChevronRight size={16} />
                           </button>
                        </div>
                     </article>
                  ))}
               </div>
            )}

            {!loading && filteredPosts.length === 0 && (
               <div className="no-results">
                  <BookOpen size={48} />
                  <p>Статей у цій категорії поки немає</p>
               </div>
            )}
         </main>

         <Footer />
      </div>
   );
};

export default Blog;