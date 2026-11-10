import type { ReactNode } from "react";
import type { CaseProblem, CaseStudyProject } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { cn, hasText } from "@/lib/utils";
import { CaseGallery } from "./case-gallery";
import { CaseVisual } from "./case-visual";
import { renderInlineCode } from "./inline-code";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold break-after-avoid">{title}</h2>
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
  <div className="space-y-1 leading-[1.75]">
    <h4 className="text-sm font-semibold text-muted-foreground break-after-avoid">
      {label}
    </h4>
    {children}
  </div>
);

// 인쇄 시 이보다 짧은 카드는 한 페이지에 통째로 두고, 긴 카드는 페이지 사이에서 나눈다.
// 긴 카드까지 통째로 넘기면 앞 페이지에 제목만 남고 넘긴 페이지에서도 결국 쪼개진다.
const KEEP_TOGETHER_MAX_CHARS = 700;

const ProblemBlock = ({ problem }: { problem: CaseProblem }) => {
  const textLength = [problem.problem, problem.solution, problem.result].reduce(
    (sum, text) => sum + text.length,
    0,
  );
  // 그림이 있는 카드는 그림만으로 페이지 절반을 넘기 쉬워, 제목·그림만 붙여 두고 본문은 이어서 흐르게 한다.
  const keepTogether = !problem.visual && textLength <= KEEP_TOGETHER_MAX_CHARS;

  return (
    <section
      className={cn(
        // 폰에서는 페이지 여백과 카드 안쪽 여백이 겹쳐 본문이 좁아지므로 카드 틀을 없앤다(sm 이상에서만 카드).
        "space-y-4 sm:rounded-lg sm:border sm:p-6",
        keepTogether && "break-inside-avoid",
      )}
    >
      <h3 className="text-lg font-semibold break-after-avoid">
        {problem.title}
      </h3>
      {problem.visual && (
        // 인쇄 시 그림·지표·코드가 페이지 경계에서 잘리지 않게 한 덩어리로 둔다.
        <div className="break-inside-avoid">
          <CaseVisual visual={problem.visual} />
        </div>
      )}
      {hasText(problem.problem) && (
        <Labeled label="문제 확인">
          <p>{renderInlineCode(problem.problem)}</p>
        </Labeled>
      )}
      {hasText(problem.solution) && (
        <Labeled label="해결 과정">
          <p className="whitespace-pre-line">
            {renderInlineCode(problem.solution)}
          </p>
        </Labeled>
      )}
      {hasText(problem.result) && (
        <Labeled label="결과">
          <p>{renderInlineCode(problem.result)}</p>
        </Labeled>
      )}
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
          {project.company} | {project.period} | {caseStudy.team}
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
          <p className="leading-[1.75] text-muted-foreground">
            {renderInlineCode(caseStudy.background)}
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
    </article>
  );
};
