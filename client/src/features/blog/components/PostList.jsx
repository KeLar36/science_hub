import PostCard from "@/features/blog/components/PostCard";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";

export default function PostList({ posts, isLoading, error }) {
  if (error) {
    return (
      <div className="w-full text-center py-12 border border-red-500/10 bg-red-500/5 text-red-500 rounded-lg text-xs font-semibold">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card key={idx} className="!p-0 overflow-hidden">
            <div className="p-5 space-y-4">
              <Skeleton variant="rectangle" className="aspect-video w-full" />
              <div className="space-y-2">
                <Skeleton variant="line" className="w-3/4 h-4" />
                <Skeleton variant="line" className="w-full h-3" />
                <Skeleton variant="line" className="w-5/6 h-3" />
              </div>
            </div>
            <div className="p-5 pt-3 border-t border-border-color flex justify-between">
              <Skeleton variant="line" className="w-1/3 h-3" />
              <Skeleton variant="line" className="w-1/4 h-3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="w-full text-center py-16 text-text-muted text-xs font-mono uppercase tracking-widest">
        Публікацій не знайдено
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
