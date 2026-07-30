import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/shared/lib/components/layout/Navbar";
import Footer from "@/shared/lib/components/layout/Footer";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Alert from "@/shared/ui/Alert";
import CreatePostForm from "@/features/content-manager/components/post-form/CreatePostForm";
import { useContentManager } from "@/features/content-manager/hooks/useContentManager";
import { postApi } from "@/features/blog/api/postApi";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { id: postId } = useParams();
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId");

  const { createPost, updatePost } = useContentManager();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postApi.getById(postId);
        setInitialData(data);
      } catch (err) {
        console.error("Помилка завантаження допису:", err);
        setError("Не вдалося завантажити допис для редагування.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (formData) => {
    const payload = {
      ...formData,
      ...(orgId && { organizationId: orgId }),
    };

    if (postId) {
      return await updatePost(postId, payload);
    } else {
      return await createPost(payload);
    }
  };

  const handleSuccess = () => {
    if (orgId) {
      navigate("/organization/dashboard");
    } else {
      navigate("/content-manager");
    }
  };

  const breadcrumbItems = [
    { label: "Особистий кабінет", href: "/profile" },
    { label: "Панель контент-менеджера", href: "/manager-dashboard" },
    {
      label: postId ? "Редагування публікації" : "Нова публікація",
      active: true,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-4 md:p-0 space-y-6 text-left my-20">
        <Breadcrumbs items={breadcrumbItems} />

        {error && (
          <Alert variant="danger" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Card className="p-6 space-y-4">
            <Skeleton variant="line" className="h-6 w-1/3" />
            <Skeleton variant="rectangle" height="150px" />
            <Skeleton variant="rectangle" height="250px" />
          </Card>
        ) : (
          <CreatePostForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
          />
        )}
      </div>

      <Footer />
    </>
  );
}
