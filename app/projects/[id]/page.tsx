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
  if (!project) return { title: "이성준 포트폴리오" };

  const title = `${project.title} | 이성준 포트폴리오`;
  const description = project.caseStudy.summary;

  // 사이트는 noindex라 검색 결과에는 나오지 않는다. 링크 공유 미리보기(og:*)가 이 값을 쓴다.
  // 페이지의 openGraph는 레이아웃의 openGraph를 통째로 대체하므로 type·locale도 다시 적는다.
  return {
    title,
    description,
    openGraph: { title, description, type: "article", locale: "ko_KR" },
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
