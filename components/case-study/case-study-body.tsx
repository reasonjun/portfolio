import type { ReactNode } from "react";
import type { CaseProblem, CaseStudyProject } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { CaseGallery } from "./case-gallery";
import { CaseVisual } from "./case-visual";

const hasText = (value: string): boolean => value.trim() !== "";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </section>
);

const Labeled = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-1">
    <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
    {children}
  </div>
);

const ProblemBlock = ({ problem }: { problem: CaseProblem }) => {
  const considered = problem.considered.filter(hasText);

  return (
    <section className="space-y-4 break-inside-avoid rounded-lg border p-6">
      <h3 className="text-lg font-semibold">{problem.title}</h3>
      {hasText(problem.problem) && (
        <Labeled label="문제">
          <p className="leading-relaxed">{problem.problem}</p>
        </Labeled>
      )}
      {considered.length > 0 && (
        <Labeled label="검토한 방법">
          <ul className="list-disc space-y-1 pl-5 leading-relaxed">
            {considered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Labeled>
      )}
      {hasText(problem.decision) && (
        <Labeled label="선택">
          <p className="leading-relaxed">{problem.decision}</p>
        </Labeled>
      )}
      {hasText(problem.result) && (
        <Labeled label="결과">
          <p className="leading-relaxed">{problem.result}</p>
        </Labeled>
      )}
      {problem.visual && <CaseVisual visual={problem.visual} />}
    </section>
  );
};

interface CaseStudyBodyProps {
  project: CaseStudyProject;
}

export const CaseStudyBody = ({ project }: CaseStudyBodyProps) => {
  const { caseStudy } = project;

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          {project.company} | {project.period}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </header>

      <CaseGallery project={project} />

      {hasText(caseStudy.background) && (
        <Section title="배경">
          <p className="leading-relaxed text-muted-foreground">
            {caseStudy.background}
          </p>
        </Section>
      )}

      {hasText(caseStudy.role) && (
        <Section title="역할">
          <p className="leading-relaxed text-muted-foreground">
            {caseStudy.role}
          </p>
        </Section>
      )}

      {caseStudy.problems.length > 0 && (
        <Section title="핵심 문제">
          <div className="space-y-6">
            {caseStudy.problems.map((problem) => (
              <ProblemBlock key={problem.title} problem={problem} />
            ))}
          </div>
        </Section>
      )}

      {hasText(caseStudy.retrospective) && (
        <Section title="회고">
          <p className="leading-relaxed text-muted-foreground">
            {caseStudy.retrospective}
          </p>
        </Section>
      )}
    </article>
  );
};
