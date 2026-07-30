import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import { usePostDetails } from "@/features/blog/hooks/usePostDetails";
import { useComments } from "@/features/blog/hooks/useComments";
import PostHeader from "@/features/blog/components/PostHeader";
import PostContent from "@/features/blog/components/PostContent";
import PostReactions from "@/features/blog/components/PostReactions";
import CommentSection from "@/features/blog/components/CommentSection";
import Navbar from "@/shared/lib/components/layout/Navbar";
import Footer from "@/shared/lib/components/layout/Footer";
import { Loader2 } from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    post,
    isLoading: isPostLoading,
    error: postError,
    isBookmarked,
    handleReactionToggle,
    handleBookmarkToggle,
    bookmarkLoading,
  } = usePostDetails(id);

  const {
    comments,
    isLoading: isCommentsLoading,
    addComment,
    deleteComment,
  } = useComments(id);

  useEffect(() => {
    if (postError) {
      navigate("/blog");
    }
  }, [postError, navigate]);

  if (isPostLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!post) return null;

  const breadcrumbItems = [
    { label: "Головна", href: "/" },
    { label: "Публікації", href: "/blog" },
    { label: post.title, href: `/blog/${post._id}`, active: true },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-secondary flex flex-col justify-between antialiased select-none relative overflow-hidden">
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-brand opacity-[0.02] dark:opacity-[0.03] blur-[130px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-24 w-full relative z-10 space-y-6 animate-reveal">
        <div className="text-left px-1">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <article className="bg-bg-secondary border border-border-color/60 rounded-[24px] p-6 md:p-10 shadow-xs space-y-6">
          <PostHeader post={post} />

          <PostContent content={post.content} />

          <PostReactions
            reactions={post.reactions}
            onReactionToggle={handleReactionToggle}
            isBookmarked={isBookmarked}
            onBookmarkToggle={handleBookmarkToggle}
            bookmarkLoading={bookmarkLoading}
          />

          <CommentSection
            post={post}
            comments={comments}
            onCommentSubmit={addComment}
            onCommentDelete={deleteComment}
            isLoading={isCommentsLoading}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
