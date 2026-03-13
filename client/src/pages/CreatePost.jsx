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
  Sparkles,
  X,
  Loader2,
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
  const { id } = useParams(); // Отримуємо ID з маршруту /edit-post/:id
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

  // Завантаження даних для редагування
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
          toast.error("Помилка завантаження даних поста");
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
        toast.success("Оновлено успішно! 🟣");
      } else {
        formData.append("authorId", user.id || user._id);
        await axios.post(`${apiUrl}/api/posts/create`, formData, { headers });
        toast.success("Опубліковано успішно! 🚀");
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[#6d28d9]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-300">
      <Toaster position="top-center" />
      <Navbar />

      <style>{`.editor-wrapper .quill { min-height: 500px; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); } .editor-wrapper .ql-toolbar { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); border-radius: 24px 24px 0 0; padding: 15px !important; } .editor-wrapper .ql-container { border: none !important; font-size: 1.1rem; } .editor-wrapper .ql-editor { padding: 40px !important; }`}</style>

      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-4 px-6 sticky top-[70px] z-30 backdrop-blur-md pt-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center mt-3">
          <button
            onClick={() => navigate("/content-panel")}
            className="flex items-center gap-2 text-[var(--text-gray)] font-black hover:text-[#6d28d9] transition-all"
          >
            <ChevronLeft size={20} />{" "}
            <span className="hidden sm:inline">Скасувати</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSavePost("draft")}
              disabled={isPublishing}
              className="hidden md:flex px-6 py-2.5 rounded-xl font-black text-[var(--text-gray)] hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100 items-center gap-2"
            >
              <Save size={18} /> Чернетка
            </button>
            <button
              onClick={() => handleSavePost("published")}
              disabled={isPublishing}
              className="px-6 md:px-10 py-2.5 rounded-xl bg-[#6d28d9] text-white font-black shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              {isPublishing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              <span>{isEditMode ? "Оновити" : "Опублікувати"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full py-10 px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-[2] space-y-8">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок статті..."
              className="w-full bg-transparent text-4xl md:text-6xl font-black text-[var(--text-dark)] outline-none placeholder:text-gray-200 resize-none"
              rows="1"
            />
            <div className="editor-wrapper shadow-xl shadow-purple-500/5 overflow-hidden">
              <ReactQuill
                theme="snow"
                modules={modules}
                value={content}
                onChange={setContent}
                placeholder="Текст вашої статті..."
              />
            </div>
          </div>

          <div className="lg:w-80 space-y-6">
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-sm sticky top-[160px]">
              <h3 className="flex items-center gap-2 text-[11px] font-black text-[var(--text-dark)] uppercase tracking-[2px] mb-8">
                <Layers size={16} className="text-[#6d28d9]" /> Налаштування
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-gray)] uppercase mb-3 ml-1">
                    Категорія
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl font-bold text-[#6d28d9] outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-gray)] uppercase mb-3 ml-1">
                    Обкладинка
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-[4/3] bg-[var(--bg-main)] border-2 border-dashed border-[var(--border-color)] rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden group relative"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center">
                        <ImagePlus
                          size={32}
                          className="mx-auto mb-2 text-purple-300"
                        />
                        <span className="text-[10px] font-black uppercase">
                          Додати фото
                        </span>
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="text-[10px] text-red-500 font-bold mt-3 flex items-center gap-1.5 mx-auto"
                    >
                      <X size={14} /> Видалити обкладинку
                    </button>
                  )}
                </div>
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
