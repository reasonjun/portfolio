import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getHomeProjects, projectHref } from "@/lib/projects";
import { joinMeta } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { HOME_SECTION_CLASS, SectionHeading } from "./section-heading";

export const CaseStudiesSection = () => {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className={HOME_SECTION_CLASS}
    >
      <SectionHeading id="case-studies-heading">대표 프로젝트</SectionHeading>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {getHomeProjects().map((project, index) => (
          <ProjectCard
            key={project.id}
            href={projectHref(project.id)}
            title={project.title}
            summary={project.caseStudy.summary}
            // 기간 안에서는 줄이 꺾이지 않게 공백을 NBSP로 바꾼다. 좁으면 기간 전체가 아래 줄로 내려간다.
            meta={joinMeta(
              project.company,
              project.period.replaceAll(" ", " "),
            )}
            image={project.images[0] ?? null}
            imagePosition={project.coverPosition}
            index={index}
          />
        ))}
      </ul>

      <Link
        href="/archive/"
        className="mt-10 inline-flex h-12 items-center gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        전체 프로젝트 보기
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
};
