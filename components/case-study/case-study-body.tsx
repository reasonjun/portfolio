import type { ReactNode } from "react";
import type { CaseStudyProject, Chunk } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { cn, hasText, joinMeta } from "@/lib/utils";
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
  // 인쇄본에서는 소제목 위를 문단 간격보다 넓게 띄우고, 소제목을 캡션과 구분되게 본문색으로 키운다.
  <div className="space-y-1 leading-[1.75] print:pt-3 print:leading-[1.7]">
    <h4 className="text-sm font-semibold text-muted-foreground break-after-avoid print:text-[12pt] print:text-foreground">
      {label}
    </h4>
    {children}
  </div>
);

// 인쇄 시 이보다 짧은 카드는 한 페이지에 통째로 두고, 긴 카드는 페이지 사이에서 나눈다.
// 긴 카드까지 통째로 넘기면 앞 페이지에 제목만 남고 넘긴 페이지에서도 결국 쪼개진다.
const KEEP_TOGETHER_MAX_CHARS = 700;

// 화면의 세 칸. 덩어리의 섹션과 1:1로 대응한다.
const SECTIONS = [
  { key: "problem", label: "문제 확인" },
  { key: "solution", label: "해결 과정" },
  { key: "result", label: "결과" },
] as const;

const ChunkBlock = ({ chunk }: { chunk: Chunk }) => {
  const textLength = SECTIONS.reduce(
    (sum, { key }) => sum + chunk[key].detail.join("\n\n").length,
    0,
  );
  // 그림이 있는 카드는 그림만으로 페이지 절반을 넘기 쉬워, 제목·그림만 붙여 두고 본문은 이어서 흐르게 한다.
  const keepTogether = !chunk.figure && textLength <= KEEP_TOGETHER_MAX_CHARS;

  return (
    <section
      className={cn(
        // 폰에서는 페이지 여백과 카드 안쪽 여백이 겹쳐 본문이 좁아지므로 카드 틀을 없앤다(sm 이상에서만 카드).
        "space-y-4 sm:rounded-lg sm:border sm:p-6",
        keepTogether && "break-inside-avoid",
      )}
    >
      {/* 인쇄 시 제목과 그림을 한 덩어리로 둔다. 따로 두면 그림이 넘어갈 때 여러 줄 제목이 페이지 사이에서 갈린다. */}
      <div className="space-y-4 break-inside-avoid">
        <h3 className="text-lg font-semibold break-after-avoid">
          {keepLineStart(chunk.title)}
        </h3>
        {chunk.figure && <DiagramView id={chunk.id} figure={chunk.figure} />}
      </div>
      {SECTIONS.map(({ key, label }) => {
        const paragraphs = chunk[key].detail.filter(hasText);
        if (paragraphs.length === 0) return null;
        return (
          <Labeled key={key} label={label}>
            {/* 문단을 따로 렌더링한다. 화면에서는 한 줄, 인쇄본에서는 반 줄을 띄운다. */}
            <div className="space-y-[1lh] print:space-y-[0.5lh]">
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
          <p className="leading-[1.75] text-muted-foreground print:text-foreground print:leading-[1.7]">
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
