import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
   Calendar, Clock, ChevronLeft, User,
   Share2, Bookmark, MessageSquare
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

const PostDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [post, setPost] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPost = async () => {
         try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/posts/${id}`);
            setPost(res.data);
         } catch (err) {
            console.error(err);
            toast.error("Статтю не знайдено");
            navigate('/blog');
         } finally {
            setLoading(false);
         }
      };
      fetchPost();
      window.scrollTo(0, 0);
   }, [id, navigate]);

   useEffect(() => {
      const handleScroll = () => {
         const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
         const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
         const scrolled = (winScroll / height) * 100;
         const progressBar = document.getElementById("scroll-progress");
         if (progressBar) progressBar.style.width = scrolled + "%";
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
         <div className="custom-loader border-t-[#6d28d9]"></div>
      </div>
   );

   if (!post) return null;

   return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col overflow-x-hidden transition-colors duration-500">
         <Toaster />

         <style>{`
            .article-content {
               text-align: justify;
               text-justify: inter-word;
               hyphens: auto;
               word-wrap: break-word;
               color: var(--text-main);
            }
            .article-content blockquote {
               border-left: 4px solid #6d28d9 !important;
               background: var(--purple-light);
               padding: 20px 30px !important;
               border-radius: 0 20px 20px 0;
               font-style: italic;
               color: var(--text-dark);
            }
            .article-content p { margin-bottom: 1.5rem; }
            .article-content h1, .article-content h2, .article-content h3 {
               color: var(--text-dark);
            }
            .article-content strong {
               color: #6d28d9;
            }
         `}</style>

         <div className="sticky top-0 z-[60] bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
            <Navbar />
         </div>

         <div className="fixed top-0 left-0 w-full h-1.5 z-[9999] bg-[var(--purple-light)]">
            <div
               id="scroll-progress"
               className="h-full bg-[#6d28d9] shadow-[0_0_10px_rgba(109,40,217,0.4)] transition-all duration-150 ease-out"
               style={{ width: '0%' }}
            ></div>
         </div>

         <main className="flex-grow">
            <div className="max-w-5xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
               <button
                  onClick={() => navigate('/blog')}
                  className="flex items-center gap-2 text-[var(--text-gray)] hover:text-[#6d28d9] transition-all font-bold mb-8 group"
                  data-aos="fade-right"
               >
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Назад до блогу
               </button>

               <div className="space-y-6 mb-12">
                  <span
                     className="inline-block px-4 py-1.5 bg-[var(--purple-light)] text-[#6d28d9] rounded-full text-xs font-black uppercase tracking-widest border border-[var(--border-color)]"
                     data-aos="fade-down"
                  >
                     {post.category}
                  </span>
                  <h1
                     className="text-4xl md:text-6xl font-black text-[var(--text-dark)] leading-tight break-words"
                     data-aos="fade-up"
                     data-aos-delay="200"
                  >
                     {post.title}
                  </h1>

                  <div
                     className="flex flex-wrap items-center gap-6 text-[var(--text-gray)] border-y border-[var(--border-color)] py-6"
                     data-aos="fade-up"
                     data-aos-delay="400"
                  >
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[var(--purple-light)] rounded-full flex items-center justify-center text-[#6d28d9]">
                           <User size={20} />
                        </div>
                        <span className="font-bold text-[var(--text-dark)]">Автор платформи</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar size={16} />
                        {new Date(post.createdAt).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock size={16} />
                        5 хв читання
                     </div>
                  </div>
               </div>

               {post.coverImage && (
                  <div
                     className="rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-purple-900/10 mb-12 md:mb-16 border border-[var(--border-color)]"
                     data-aos="zoom-in"
                     data-aos-duration="1000"
                  >
                     <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700"
                     />
                  </div>
               )}

               <div className="max-w-3xl mx-auto w-full">
                  <div
                     className="article-content prose prose-purple prose-lg md:prose-xl max-w-none break-words overflow-hidden"
                     dangerouslySetInnerHTML={{ __html: post.content }}
                     data-aos="fade-up"
                     data-aos-delay="600"
                  />

                  <div
                     className="mt-20 pt-10 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-6 mb-20"
                     data-aos="fade-up"
                  >
                     <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--purple-light)] rounded-xl transition-all font-bold text-[var(--text-gray)] hover:text-[#6d28d9]">
                           <Share2 size={18} /> Поділитися
                        </button>
                        <button className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--purple-light)] rounded-xl transition-all text-[var(--text-gray)] hover:text-[#6d28d9]">
                           <Bookmark size={18} />
                        </button>
                     </div>
                     <button className="flex items-center gap-2 text-[#6d28d9] font-black hover:opacity-70 transition-all">
                        <MessageSquare size={18} /> Обговорити
                     </button>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
};

export default PostDetail;