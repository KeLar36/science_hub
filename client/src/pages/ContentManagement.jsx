import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import {
	Layers, ImagePlus, Send, Save, ChevronLeft, Sparkles, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'react-quill-new/dist/quill.snow.css';

const CATEGORIES = ["Новини", "Поради", "Конференції", "Інтерв'ю", "Методологія"];

const modules = {
	toolbar: [
		[{ 'header': [1, 2, 3, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		['blockquote', 'code-block'],
		['link', 'clean']
	],
};

const ContentManagement = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const user = JSON.parse(localStorage.getItem('user') || '{}');
	const token = localStorage.getItem('token');

	const [content, setContent] = useState('');
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState(CATEGORIES[0]);
	const [isPublishing, setIsPublishing] = useState(false);

	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSavePost = async (status = 'published') => {
		if (!title || !content) return toast.error("Заповніть заголовок та зміст");
		if (!token) return toast.error("Авторизуйтесь знову");

		setIsPublishing(true);

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('content', content);
			formData.append('category', category);
			formData.append('authorId', user.id || user._id);
			formData.append('status', status);

			if (imageFile) {
				formData.append('image', imageFile);
			}

			const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

			await axios.post(`${apiUrl}/api/posts/create`, formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data'
				}
			});

			toast.success(status === 'published' ? "Статтю опубліковано! 🟣" : "Збережено в чернетки");
			if (status === 'published') navigate('/blog');
		} catch (err) {
			console.error(err);
			toast.error(err.response?.status === 401 ? "Сесія вичерпана" : "Помилка збереження");
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#f8f7ff] flex flex-col">
			<Toaster position="top-center" />

			<style>{`
            .editor-wrapper .quill {
               display: flex;
               flex-direction: column;
               height: 600px;
               background: white;
            }
            .editor-wrapper .ql-toolbar {
               border: none !important;
               border-bottom: 1px solid #f3e8ff !important;
               position: sticky;
               top: 0;
               z-index: 20;
               background: white;
               padding: 12px !important;
            }
            .editor-wrapper .ql-container {
               border: none !important;
               flex-grow: 1;
               overflow-y: auto;
               font-family: inherit;
               font-size: 1.1rem;
            }
            .editor-wrapper .ql-editor {
               padding: 30px !important;
               min-height: 100%;
            }
            .editor-wrapper .ql-editor.ql-blank::before {
               left: 30px;
               color: #d1d5db;
               font-style: normal;
            }
            /* Кастомний скролбар */
            .editor-wrapper .ql-container::-webkit-scrollbar {
               width: 6px;
            }
            .editor-wrapper .ql-container::-webkit-scrollbar-track {
               background: #f8f7ff;
            }
            .editor-wrapper .ql-container::-webkit-scrollbar-thumb {
               background: #e9d5ff;
               border-radius: 10px;
            }
         `}</style>

			<Navbar />

			<div className="bg-white border-b border-purple-50 py-3 md:py-4 px-4 md:px-6 sticky top-[70px] z-30 shadow-sm">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<button onClick={() => navigate(-1)} className="flex items-center gap-1 md:gap-2 text-gray-400 font-bold hover:text-[#6d28d9] transition-all">
						<ChevronLeft size={20} /> <span className="hidden sm:inline">Назад</span>
					</button>

					<div className="flex gap-2 md:gap-3">
						<button onClick={() => handleSavePost('draft')} disabled={isPublishing} className="px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-black text-gray-500 hover:bg-gray-50 flex items-center gap-2">
							<Save size={18} /> <span className="hidden md:inline">Чернетка</span>
						</button>
						<button onClick={() => handleSavePost('published')} disabled={isPublishing} className="px-4 py-2 md:px-8 rounded-xl bg-[#6d28d9] text-white font-black shadow-lg shadow-purple-100 flex items-center gap-2 transition-all active:scale-95">
							{isPublishing ? 'Завантаження...' : <><Send size={18} /> <span>Опублікувати</span></>}
						</button>
					</div>
				</div>
			</div>

			<main className="flex-grow max-w-7xl mx-auto w-full py-6 md:py-10 px-4 md:px-6">
				<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

					<div className="flex-[2] space-y-6 md:space-y-8">
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Заголовок статті..."
							className="w-full bg-transparent text-3xl md:text-5xl font-black text-[#1e1b4b] outline-none placeholder:text-gray-200"
						/>

						<div className="editor-wrapper rounded-[32px] shadow-sm border border-purple-50 overflow-hidden">
							<ReactQuill
								theme="snow"
								modules={modules}
								value={content}
								onChange={setContent}
								placeholder="Почніть свою наукову історію тут..."
							/>
						</div>
					</div>

					<div className="lg:w-80 space-y-6">
						<div className="bg-white p-6 md:p-8 rounded-[32px] border border-purple-50 shadow-sm">
							<h3 className="flex items-center gap-2 text-[11px] font-black text-[#1e1b4b] uppercase tracking-[2px] mb-6">
								<Layers size={16} className="text-[#6d28d9]" /> Налаштування
							</h3>

							<div className="space-y-6">
								<div>
									<label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Категорія</label>
									<select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-purple-50/50 border border-purple-50 rounded-2xl font-bold text-[#6d28d9] outline-none">
										{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
									</select>
								</div>

								<div>
									<label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Обкладинка</label>
									<input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
									<div
										onClick={() => fileInputRef.current.click()}
										className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-purple-50 hover:border-[#6d28d9] transition-all cursor-pointer relative group overflow-hidden"
									>
										{imagePreview ? (
											<img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
										) : (
											<>
												<ImagePlus size={28} className="mb-2 group-hover:scale-110 transition-transform" />
												<span className="text-[9px] font-black uppercase tracking-wider">Завантажити фото</span>
											</>
										)}
									</div>
									{imagePreview && (
										<button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">
											<X size={12} /> Видалити фото
										</button>
									)}
								</div>
							</div>
						</div>

						<div className="bg-[#1e1b4b] p-6 rounded-[32px] text-white relative overflow-hidden">
							<Sparkles className="absolute -right-4 -top-4 opacity-10" size={100} />
							<h4 className="font-black mb-4">Поради</h4>
							<ul className="space-y-3 text-xs text-indigo-100/80">
								<li>• Додайте обкладинку для кращого охоплення.</li>
								<li>• Використовуйте підзаголовки (H2, H3).</li>
								<li>• Короткі абзаци читаються краще.</li>
							</ul>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ContentManagement;