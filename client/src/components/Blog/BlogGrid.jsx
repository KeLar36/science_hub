import React from "react";
import { BookOpen } from "lucide-react";
import UniversalCard from "../ui/UniversalCard";

export default function BlogGrid({ posts, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl h-96 animate-pulse shadow-xs"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
        <BookOpen size={36} className="mx-auto text-purple-600/40 mb-4" />
        <h4 className="text-xl font-black text-[var(--text-dark)] uppercase tracking-tight mb-1 m-0">
          Упс, порожньо
        </h4>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-gray)] m-0 opacity-60">
          Нічого не знайдено за обраними критеріями
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in duration-300">
      {posts.map((post) => (
        <UniversalCard key={post._id || post.id} item={post} variant="blog" />
      ))}
    </div>
  );
}
