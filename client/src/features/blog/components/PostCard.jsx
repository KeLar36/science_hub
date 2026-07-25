import { Calendar, User, Eye } from "lucide-react";
import Card from "@/shared/ui/Card";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Link from "@/shared/ui/Link";

export default function PostCard({ post }) {
  const heroImage =
    post.images?.find((img) => img.isHero)?.url ||
    post.images?.[0]?.url ||
    post.coverImage;

  const getExcerpt = (htmlContent, maxLength = 110) => {
    if (!htmlContent) return "";
    let cleanText = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
    cleanText = cleanText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const postPath = `/blog/${post._id}`;

  return (
    <Link href={postPath} variant="muted" className="block w-full !gap-0">
      <Card
        hoverable
        className="flex flex-col h-full justify-between !p-0 overflow-hidden group"
      >
        <div className="pb-0 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-bg-tertiary border border-border-color/40">
            {heroImage ? (
              <img
                src={heroImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted font-mono text-[10px] uppercase tracking-wider bg-bg-tertiary">
                No Image
              </div>
            )}

            <Badge
              status="default"
              className="absolute top-2 left-2 backdrop-blur-md !bg-bg-primary/80"
            >
              {post.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="block text-sm font-bold leading-snug tracking-tight text-text-primary group-hover:text-brand transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
              {getExcerpt(post.content)}
            </p>
          </div>
        </div>

        <div className="p-2 pt-3 mt-4 border-t border-border-color/60 flex items-center justify-between text-[10px] font-medium text-text-muted">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={post.authorId?.image}
              name={post.authorId?.name || "Науковець"}
              size="md"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-text-primary">
                {post.authorId?.name || "Науковець"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
