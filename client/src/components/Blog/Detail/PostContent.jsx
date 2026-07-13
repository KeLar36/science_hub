import React, { useState } from "react";
import {
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PostContent({ post }) {
  const hasImages =
    post.images && Array.isArray(post.images) && post.images.length > 0;

  const sliderImages = hasImages
    ? post.images
    : post.coverImage || post.image
      ? [{ url: post.coverImage || post.image }]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === sliderImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] shadow-xs overflow-hidden backdrop-blur-xs text-left">
      <div className="p-6 sm:p-10 md:p-12 border-b border-[var(--border-color)] space-y-6 bg-gradient-to-br from-transparent to-purple-600/[0.01]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/5 dark:bg-purple-500/10 border border-purple-500/15 rounded-xl text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
            {post.category || "Публікація"}
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
            <Calendar
              size={13}
              className="text-purple-600 dark:text-purple-400"
            />
            Опубліковано:{" "}
            <strong className="text-[var(--text-dark)]">
              {new Date(post.createdAt).toLocaleDateString("uk-UA")}
            </strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-dark)] uppercase tracking-tight leading-none italic m-0">
          {post.title}
        </h1>
      </div>

      {sliderImages.length > 0 && (
        <div className="px-6 sm:px-10 md:px-12 pt-8 w-full">
          <div className="relative aspect-video max-h-[420px] w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden group/slider shadow-xs">
            <img
              src={sliderImages[currentIndex]?.url}
              alt={`Слайд ${currentIndex + 1}`}
              className="w-full h-full object-cover animate-in fade-in duration-300"
            />

            {sliderImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/40 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-purple-600 cursor-pointer z-10"
                >
                  <ChevronLeft size={18} className="stroke-[2.5]" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/40 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-purple-600 cursor-pointer z-10"
                >
                  <ChevronRight size={18} className="stroke-[2.5]" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/25 px-2.5 py-1.5 rounded-lg backdrop-blur-xs">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? "w-4 bg-purple-500"
                          : "w-1.5 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-main)]/40 border-b border-[var(--border-color)] p-6 sm:px-10 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center gap-3 group hover:border-purple-500/20 transition-all">
            <div className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-grow">
              <div className="text-[9px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wider block opacity-70">
                Автор матеріалу
              </div>
              <div className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wide truncate mt-0.5">
                {post.authorId?.name || "Редакція платформи"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Текст статті */}
      <div className="p-6 sm:p-10 md:p-12 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono m-0 flex items-center gap-1.5">
          <FileText size={12} />
          <span>// Текст публікації</span>
        </h3>

        <div
          className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[var(--text-dark)] opacity-95
            w-full overflow-hidden break-words whitespace-pre-wrap
            [&_p]:mb-4 [&_p]:break-words
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
            [&_li]:mb-1 [&_li]:break-words
            [&_strong]:font-bold [&_strong]:text-purple-600 dark:[&_strong]:text-purple-400
            [&_h1]:text-lg [&_h1]:font-black [&_h1]:uppercase [&_h1]:mt-6 [&_h1]:mb-3
            [&_h2]:text-base [&_h2]:font-black [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-2
            [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:mt-4 [&_h3]:mb-2"
          dangerouslySetInnerHTML={{
            __html: post.content
              ? post.content.replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ")
              : "",
          }}
        />
      </div>
    </div>
  );
}
