import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/shared/lib/components/layout/Navbar";
import Footer from "@/shared/lib/components/layout/Footer";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Skeleton from "@/shared/ui/Skeleton";
import ProgramDetailsHeader from "@/features/programs/components/ProgramDetailsHeader";
import ProgramSpecification from "@/features/programs/components/ProgramSpecification";
import ProgramDescription from "@/features/programs/components/ProgramDescription";
import { usePrograms } from "@/features/programs/hooks/usePrograms";

export default function ProgramDetailsPage() {
  const { id } = useParams();

  const { currentProgram, loading } = usePrograms(id);

  const breadcrumbItems = [
    { label: "Наукові програми", href: "/programs" },
    {
      label: currentProgram?.title
        ? `${currentProgram.title.substring(0, 25)}...`
        : "Деталі конкурсу",
      active: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary pt-40 px-6">
        <Navbar />
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <Skeleton variant="line" width="200px" />
          <Skeleton variant="rectangle" height="120px" />
          <Skeleton variant="rectangle" height="300px" />
        </div>
      </div>
    );
  }

  if (!currentProgram) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary pt-40 px-6">
        <Navbar />
        <div className="max-w-xl mx-auto text-center border border-red-500/20 bg-red-500/5 rounded-2xl p-8 font-mono">
          <h3 className="text-red-500 font-bold mb-2">Конкурс відсутній</h3>
          <p className="text-xs text-text-secondary mb-4">
            Можливо, програму було видалено або посилання застаріло.
          </p>
          <Link to="/programs">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Повернутися до каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary selection:bg-brand selection:text-white">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full space-y-6 relative z-10">
        <Breadcrumbs items={breadcrumbItems} />

        <Card>
          <div className="space-y-6">
            <ProgramDetailsHeader program={currentProgram} />
            <ProgramSpecification program={currentProgram} />
            <ProgramDescription program={currentProgram} />
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
