import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getHomeProjects } from "@/lib/projects";
import { ProjectCard } from "./project-card";

const CaseStudiesSection = () => {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="mx-auto max-w-5xl scroll-mt-3 px-6 py-16 lg:py-[7.5rem]"
    >
      <h2
        id="case-studies-heading"
        data-reveal
        className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-balance"
      >
        대표 프로젝트
      </h2>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {getHomeProjects().map((project, index) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            role={project.roleShort ?? ""}
            summary={project.caseStudy.summary}
            meta={`${project.company} · ${project.period}`}
            image={project.images[0] ?? null}
            imagePosition={project.coverPosition}
            techStack={project.techStack}
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

export default CaseStudiesSection;
