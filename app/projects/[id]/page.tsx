import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import Navbar from "@/components/portfolio/navbar";
import { getCaseStudies, getCaseStudyById } from "@/lib/projects";

export const dynamicParams = false;

export const generateStaticParams = () =>
  getCaseStudies().map(({ id }) => ({ id }));

interface CaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: CaseStudyPageProps): Promise<Metadata> => {
  const { id } = await params;
  const project = getCaseStudyById(id);

  return {
    title: project
      ? `${project.title} | 이성준 포트폴리오`
      : "이성준 포트폴리오",
  };
};

const BackLink = ({ href, children }: { href: string; children: string }) => (
  <Link
    href={href}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
  >
    {children}
  </Link>
);

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const project = getCaseStudyById(id);

  if (!project) notFound();

  return (
    <div className="min-h-svh bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <BackLink href="/">← 메인으로</BackLink>
        <CaseStudyBody project={project} />
        <BackLink href="/archive/">전체 프로젝트 보기</BackLink>
      </main>
    </div>
  );
}
