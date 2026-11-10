import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
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

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const project = getCaseStudyById(id);

  if (!project) notFound();

  return (
    <div className="py-12 space-y-10">
      <BackLink href="/archive/">전체 프로젝트</BackLink>
      <CaseStudyBody project={project} />
      <BackLink href="/archive/">전체 프로젝트</BackLink>
    </div>
  );
}
