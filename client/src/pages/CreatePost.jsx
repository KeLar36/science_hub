/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import ReactQuill from "react-quill-new";
import {
  Layers,
  ImagePlus,
  Send,
  Save,
  ChevronLeft,
  X,
  Loader2,
  Type,
  Layout,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = [
  "Новини",
  "Поради",
  "Конференції",
  "Інтерв'ю",
  "Методологія",
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "clean"],
  ],
};

const CreatePost = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        setIsLoadingData(true);
        try {
          const res = await axios.get(`${apiUrl}/api/posts/${id}`);
          setTitle(res.data.title);
          setContent(res.data.content);
          setCategory(res.data.category);
          if (res.data.coverImage) setImagePreview(res.data.coverImage);
        } catch (err) {
          toast.error("Помилка завантаження даних");
          navigate("/content-panel");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSavePost = async (status = "published") => {
    if (!title.trim() || !content.trim())
      return toast.error("Заповніть обов'язкові поля");

    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("status", status);
      if (imageFile) formData.append("image", imageFile);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEditMode) {
        await axios.put(`${apiUrl}/api/posts/${id}`, formData, { headers });
        toast.success("Оновлено успішно");
      } else {
        formData.append("authorId", user.id || user._id);
        await axios.post(`${apiUrl}/api/posts/create`, formData, { headers });
        toast.success("Створено успішно");
      }

      setTimeout(() => navigate("/content-panel"), 1500);
    } catch (err) {
      toast.error("Помилка збереження");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoadingData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="w-12 h-12 border-2 border-[var(--border-color)] border-t-[var(--purple-main)] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-500">
      <Toaster position="bottom-right" />
      <Navbar />

      <style>{`
        .editor-wrapper .quill { 
          border: none !important;
          background: var(--bg-card);
        }
        .editor-wrapper .ql-toolbar { 
          border: none !important;
          border-bottom: 1px solid var(--border-color) !important;
          padding: 1.5rem !important;
          position: sticky;
          top: 0;
          z-index: 10;
          background: var(--bg-card);
        }
        .editor-wrapper .ql-container { 
          border: none !important;
          font-family: inherit;
        }
        .editor-wrapper .ql-editor { 
          padding: 3rem !important;
          min-height: 600px;
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-dark);
        }
        .editor-wrapper .ql-editor.ql-blank::before {
          color: var(--text-gray);
          font-style: normal;
          opacity: 0.5;
          padding-left: 3rem;
        }
      `}</style>

      <div className="sticky top-[70px] z-40 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-color)] py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/content-panel")}
            className="group flex items-center gap-2 text-[var(--text-gray)] font-bold text-sm hover:text-[var(--purple-main)] transition-all"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Назад
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSavePost("draft")}
              disabled={isPublishing}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[var(--text-gray)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] transition-all"
            >
              <Save size={16} /> Чернетка
            </button>
            <button
              onClick={() => handleSavePost("published")}
              disabled={isPublishing}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[var(--purple-main)] text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:bg-[var(--text-dark)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isEditMode ? "ОНОВИТИ" : "ОПУБЛІКУВАТИ"}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--purple-main)] font-black uppercase tracking-widest text-[10px]">
                <Type size={14} />
                Content Headline
              </div>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть заголовок статті..."
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-[var(--text-dark)] outline-none placeholder:opacity-20 resize-none leading-tight uppercase italic"
                rows="2"
              />
            </div>

            <div className="editor-wrapper border border-[var(--border-color)] rounded-[32px] overflow-hidden bg-[var(--bg-card)] shadow-2xl shadow-purple-500/5">
              <ReactQuill
                theme="snow"
                modules={modules}
                value={content}
                onChange={setContent}
                placeholder="Почніть писати свою історію..."
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[160px] space-y-6">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[32px] shadow-sm">
                <h3 className="flex items-center gap-2 text-[10px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-6">
                  <Layers size={16} className="text-[var(--purple-main)]" />{" "}
                  Категорія
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                        category === cat
                          ? "bg-[var(--purple-main)] text-white shadow-md shadow-purple-500/20"
                          : "text-[var(--text-gray)] hover:bg-[var(--bg-main)] border border-transparent hover:border-[var(--border-color)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[32px] shadow-sm">
                <h3 className="flex items-center gap-2 text-[10px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-6">
                  <Layout size={16} className="text-[var(--purple-main)]" />{" "}
                  Обкладинка
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group relative aspect-video bg-[var(--bg-main)] border-2 border-dashed border-[var(--border-color)] rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[var(--purple-main)]"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImagePlus className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[var(--purple-main)]">
                        <ImagePlus size={24} />
                      </div>
                      <p className="text-[9px] font-black uppercase text-[var(--text-gray)] tracking-wider">
                        Натисніть, щоб додати
                      </p>
                    </div>
                  )}
                </div>

                {imagePreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 py-2 rounded-lg transition-colors"
                  >
                    <X size={14} /> Видалити фото
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;
