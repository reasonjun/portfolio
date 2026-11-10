import type { Metadata } from "next";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { PROFILE } from "@/data/profile";
import { getExportProjects } from "@/lib/projects";

// PDF 생성 스크립트(scripts/generate-pdf.mjs)가 이 페이지를 인쇄한다. 메뉴에는 노출하지 않는다.
export const metadata: Metadata = {
  title: "포트폴리오 | 이성준",
};

const Cover = () => (
  <section className="space-y-10 pb-12">
    <header className="space-y-2">
      <h1 className="text-4xl font-bold">{PROFILE.name}</h1>
      <p className="text-lg font-medium">{PROFILE.role}</p>
    </header>

    <p className="text-xl leading-relaxed">
      {PROFILE.positioning.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>

    <dl className="grid grid-cols-3 gap-4">
      {PROFILE.metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border p-4 space-y-1">
          <dt className="text-xs text-muted-foreground">{metric.label}</dt>
          <dd className="text-xl font-bold">{metric.value}</dd>
        </div>
      ))}
    </dl>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">경력</h2>
      <ul className="space-y-2">
        {EXPERIENCES_DATA.map((experience) => (
          <li key={experience.id} className="text-sm">
            <span className="font-semibold">{experience.company}</span>
            <span className="text-muted-foreground">
              {" "}
              · {experience.period}
            </span>
            <span> · {experience.position ?? experience.jobs.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">연락처</h2>
      <ul className="space-y-1 text-sm">
        <li>GitHub · {PROFILE.githubUrl}</li>
        <li>이메일 · {PROFILE.email}</li>
        <li>포트폴리오 사이트 · {PROFILE.siteUrl}</li>
      </ul>
    </section>
  </section>
);

export default function ExportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <Cover />
      {getExportProjects().map((project) => (
        <div key={project.id} className="break-before-page">
          <CaseStudyBody project={project} />
        </div>
      ))}
    </main>
  );
}
