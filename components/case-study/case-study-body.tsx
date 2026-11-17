import type { ReactNode } from "react";
import type { CaseStudyProject, Chunk } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { hasText, joinMeta } from "@/lib/utils";
import { CaseGallery } from "./case-gallery";
import { DiagramView } from "./diagram-view";
import { keepLineStart, renderInlineCode } from "./inline-code";

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
  <div className="space-y-1 leading-[1.75]">
    <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
    {children}
  </div>
);

// 화면의 세 칸. 덩어리의 섹션과 1:1로 대응한다.
const SECTIONS = [
  { key: "problem", label: "문제 확인" },
  { key: "solution", label: "해결 과정" },
  { key: "result", label: "결과" },
] as const;

const ChunkBlock = ({ chunk }: { chunk: Chunk }) => (
  <section
    // PDF의 덩어리 제목이 이 위치로 링크한다. 고정 메뉴에 가려지지 않게 하는 일은 globals.css의 scroll-padding-top이 한다.
    id={chunk.id}
    // 폰에서는 페이지 여백과 카드 안쪽 여백이 겹쳐 본문이 좁아지므로 카드 틀을 없앤다(sm 이상에서만 카드).
    className="space-y-4 sm:rounded-lg sm:border sm:p-6"
  >
    <h3 className="text-lg font-semibold">{keepLineStart(chunk.title)}</h3>
    {chunk.figure && <DiagramView id={chunk.id} figure={chunk.figure} />}
    {SECTIONS.map(({ key, label }) => {
      const paragraphs = chunk[key].detail.filter(hasText);
      if (paragraphs.length === 0) return null;
      return (
        <Labeled key={key} label={label}>
          {/* 문단을 따로 렌더링하고 문단 사이를 한 줄 띄운다. */}
          <div className="space-y-[1lh]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="whitespace-pre-line">
                {renderInlineCode(paragraph)}
              </p>
            ))}
          </div>
        </Labeled>
      );
    })}
  </section>
);

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
          {joinMeta(project.company, project.period, caseStudy.team)}
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

      {caseStudy.chunks.length > 0 && (
        <Section title="핵심 문제">
          <div className="space-y-6">
            {caseStudy.chunks.map((chunk) => (
              <ChunkBlock key={chunk.id} chunk={chunk} />
            ))}
          </div>
        </Section>
      )}
    </article>
  );
};
