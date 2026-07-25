import React from "react";
import { Bookmark, Trash2, Calendar, User, Tag } from "lucide-react";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Badge from "@/shared/ui/Badge";
import Link from "@/shared/ui/Link";

export default function SavedPostsTab({
  savedPosts = [],
  loading,
  onToggleBookmark,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton variant="rectangle" height="120px" />
        <Skeleton variant="rectangle" height="120px" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedPosts.length === 0 ? (
        <Card className="p-8 text-center space-y-3 bg-bg-secondary/40">
          <Bookmark className="mx-auto text-text-muted" size={32} />
          <p className="text-xs font-mono text-text-muted">
            У вас немає збережених матеріалів.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedPosts.map((post) => (
            <Card
              key={post._id}
              hoverable
              className="p-4 relative flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                {post.category ? (
                  <Badge status="default">{post.category}</Badge>
                ) : (
                  <span className="text-[10px] font-mono uppercase text-brand font-bold">
                    // Стаття
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleBookmark(post._id);
                  }}
                  className="text-text-muted hover:text-red-500 transition-colors p-1"
                  title="Видалити зі збережених"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-1.5">
                <Link
                  href={`/blog/${post._id}`}
                  variant="muted"
                  className="font-bold text-sm text-text-primary hover:text-brand transition-colors line-clamp-2 leading-snug"
                >
                  {post.title}
                </Link>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {post.description || post.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-border-color/60 flex items-center justify-between text-[10px] font-mono text-text-muted">
                <div className="flex items-center gap-3">
                  {post.author && (
                    <span className="flex items-center gap-1">
                      <User size={12} /> {post.author.name || post.author}
                    </span>
                  )}
                  {post.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/blog/${post._id}`}
                  variant="default"
                  className="text-[10px] uppercase font-bold"
                >
                  Читати →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
