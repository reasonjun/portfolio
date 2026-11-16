import type { Metadata } from "next";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { Positioning } from "@/components/portfolio/positioning";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { PROFILE } from "@/data/profile";
import { getExportProjects } from "@/lib/projects";

// PDF 생성 스크립트(scripts/generate-pdf.mjs)가 이 페이지를 인쇄한다. 메뉴에는 노출하지 않는다.
// PDF 문서 제목이 되므로 레이아웃의 제목 템플릿을 붙이지 않는다.
export const metadata: Metadata = {
  title: { absolute: "포트폴리오 | 이성준" },
};

const Cover = () => (
  <section className="space-y-10 pb-12">
    <header className="space-y-2">
      <h1 className="text-4xl font-bold">{PROFILE.name}</h1>
      <p className="text-lg font-medium">{PROFILE.role}</p>
    </header>

    <p className="text-xl leading-relaxed">
      <Positioning />
    </p>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">경력</h2>
      <ul className="space-y-2">
        {EXPERIENCES_DATA.map((experience) => (
          <li key={experience.id} className="text-sm">
            <span className="font-semibold">{experience.company}</span>
            <span className="text-muted-foreground">, {experience.period}</span>
            {/* 소속·직급이 없는 경력(프리랜서)은 회사와 기간만 보인다. 직무로 대신 채우면 줄마다 정보 종류가 달라진다. */}
            {experience.position && <span>, {experience.position}</span>}
          </li>
        ))}
      </ul>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">연락처</h2>
      <ul className="space-y-1 text-sm">
        <li>
          GitHub: <a href={PROFILE.githubUrl}>{PROFILE.githubUrl}</a>
        </li>
        <li>
          이메일: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </li>
        <li>
          포트폴리오 사이트: <a href={PROFILE.siteUrl}>{PROFILE.siteUrl}</a>
        </li>
      </ul>
    </section>
  </section>
);

export default function ExportPage() {
  const projects = getExportProjects();

  return (
    <div className="py-8">
      {/* 쪽 아래 여백: 왼쪽에 그 쪽이 속한 프로젝트 이름, 가운데에 쪽 번호. 프로젝트마다 이름 붙인 쪽(page)을 쓴다.
          여백 상자는 <html>의 글꼴과 :root의 인쇄용 색 토큰을 그대로 쓴다. */}
      <style>
        {[
          '@page { @bottom-left { font-size: 8px; color: var(--muted-foreground); } @bottom-center { content: counter(page) " / " counter(pages); font-size: 8px; color: var(--muted-foreground); } }',
          ...projects.map(
            (project) =>
              `@page ${project.id} { @bottom-left { content: ${JSON.stringify(project.title)}; } }`,
          ),
        ].join("\n")}
      </style>
      <Cover />
      {projects.map((project) => (
        <div
          key={project.id}
          className="break-before-page"
          style={{ page: project.id }}
        >
          <CaseStudyBody project={project} />
        </div>
      ))}
    </div>
  );
}
