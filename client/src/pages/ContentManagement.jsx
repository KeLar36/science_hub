import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import {
	Layers, ImagePlus, Send, Save, ChevronLeft, Sparkles, X, Loader2
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

	useEffect(() => {
		return () => {
			if (imagePreview) URL.revokeObjectURL(imagePreview);
		};
	}, [imagePreview]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (imagePreview) URL.revokeObjectURL(imagePreview);
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSavePost = async (status = 'published') => {
		if (!title.trim() || !content.trim()) {
			return toast.error("Заповніть заголовок та зміст статті");
		}
		if (!token) return toast.error("Ваша сесія вичерпана. Авторизуйтесь знову");

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

			toast.success(status === 'published' ? "Статтю успішно опубліковано! 🟣" : "Збережено в чернетки");

			setTimeout(() => {
				if (status === 'published') navigate('/blog');
			}, 1500);

		} catch (err) {
			console.error(err);
			toast.error(err.response?.status === 401 ? "Потрібна повторна авторизація" : "Помилка при збереженні");
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-300">
			<Toaster position="top-center" reverseOrder={false} />

			<style>{`
            .editor-wrapper .quill {
               display: flex;
               flex-direction: column;
               height: auto;
               min-height: 500px;
               background: var(--bg-card);
               border-radius: 24px;
            }
            .editor-wrapper .ql-toolbar {
               border: none !important;
               border-bottom: 1px solid var(--border-color) !important;
               position: sticky;
               top: 0;
               z-index: 20;
               background: var(--bg-card);
               padding: 16px !important;
               border-radius: 24px 24px 0 0;
            }
            .editor-wrapper .ql-container {
               border: none !important;
               flex-grow: 1;
               font-family: inherit;
               font-size: 1.1rem;
               color: var(--text-dark);
            }
            .editor-wrapper .ql-editor {
               padding: 40px !important;
               min-height: 450px;
            }
            .editor-wrapper .ql-editor.ql-blank::before {
               left: 40px;
               color: #94a3b8;
               font-style: normal;
            }
         `}</style>

			<Navbar />

			<div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-4 px-6 sticky top-[70px] z-30 shadow-sm backdrop-blur-md bg-opacity-80 pt-3">
				<div className="max-w-7xl mx-auto flex justify-between items-center mt-3">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-[var(--text-gray)] font-black hover:text-[#6d28d9] transition-all group px-2"
					>
						<ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
						<span className="hidden sm:inline">Вийти без збереження</span>
					</button>

					<div className="flex gap-3">
						<button
							onClick={() => handleSavePost('draft')}
							disabled={isPublishing}
							className="hidden md:flex px-6 py-2.5 rounded-xl font-black text-[var(--text-gray)] hover:bg-purple-50 transition-all items-center gap-2 border border-transparent hover:border-purple-100"
						>
							<Save size={18} /> Чернетка
						</button>
						<button
							onClick={() => handleSavePost('published')}
							disabled={isPublishing}
							className="px-6 md:px-10 py-2.5 rounded-xl bg-[#6d28d9] text-white font-black shadow-lg shadow-purple-200/50 flex items-center gap-2 transition-all active:scale-95 hover:bg-[#5b21b6] disabled:opacity-70"
						>
							{isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
							<span>{isPublishing ? 'Публікація...' : 'Опублікувати'}</span>
						</button>
					</div>
				</div>
			</div>

			<main className="flex-grow max-w-7xl mx-auto w-full py-10 px- mt-10">
				<div className="flex flex-col lg:flex-row gap-12">

					<div className="flex-[2] space-y-8" data-aos="fade-up">
						<textarea
							rows="1"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Введіть заголовок статті..."
							className="w-full bg-transparent text-4xl md:text-6xl font-black text-[var(--text-dark)] outline-none placeholder:text-gray-200 resize-none overflow-hidden transition-all focus:placeholder:opacity-30"
							onInput={(e) => {
								e.target.style.height = 'auto';
								e.target.style.height = e.target.scrollHeight + 'px';
							}}
						/>

						<div className="editor-wrapper rounded-3xl shadow-xl shadow-purple-500/5 border border-[var(--border-color)] overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/10 transition-all">
							<ReactQuill
								theme="snow"
								modules={modules}
								value={content}
								onChange={setContent}
								placeholder="Опишіть ваше дослідження або подію..."
							/>
						</div>
					</div>

					<div className="lg:w-80 space-y-6">
						<div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-sm sticky top-[160px]" data-aos="fade-left">
							<h3 className="flex items-center gap-2 text-[11px] font-black text-[var(--text-dark)] uppercase tracking-[2px] mb-8">
								<Layers size={16} className="text-[#6d28d9]" /> Параметри статті
							</h3>

							<div className="space-y-8">
								<div>
									<label className="block text-[10px] font-black text-[var(--text-gray)] uppercase mb-3 ml-1">Категорія публікації</label>
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-bold text-[#6d28d9] outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer appearance-none"
									>
										{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
									</select>
								</div>

								<div>
									<label className="block text-[10px] font-black text-[var(--text-gray)] uppercase mb-3 ml-1">Головне зображення</label>
									<input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
									<div
										onClick={() => fileInputRef.current.click()}
										className="aspect-[4/3] bg-[var(--bg-main)] border-2 border-dashed border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--text-gray)] hover:bg-purple-50 hover:border-[#6d28d9] transition-all cursor-pointer relative group overflow-hidden"
									>
										{imagePreview ? (
											<>
												<img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
													<span className="text-white text-[10px] font-black uppercase">Змінити фото</span>
												</div>
											</>
										) : (
											<div className="text-center p-4">
												<ImagePlus size={32} className="mx-auto mb-3 text-purple-300 group-hover:scale-110 transition-transform" />
												<span className="text-[10px] font-black uppercase tracking-wider block">Додати обкладинку</span>
											</div>
										)}
									</div>
									{imagePreview && (
										<button
											onClick={() => { setImageFile(null); setImagePreview(null); }}
											className="text-[10px] text-red-500 font-bold mt-3 flex items-center gap-1.5 hover:opacity-70 transition-all mx-auto"
										>
											<X size={14} /> Видалити обкладинку
										</button>
									)}
								</div>
							</div>

							<div className="mt-10 p-5 bg-[#1e1b4b] rounded-2xl text-white relative overflow-hidden group">
								<Sparkles className="absolute -right-4 -top-4 opacity-10" size={80} />
								<h4 className="font-black text-xs mb-3 flex items-center gap-2">Поради</h4>
								<ul className="space-y-2 text-[10px] text-indigo-100/70 leading-relaxed font-medium">
									<li>• Використовуйте H2 для розділів</li>
									<li>• Оптимальний розмір фото: 1200x800px</li>
									<li>• Додавайте посилання на джерела</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ContentManagement;