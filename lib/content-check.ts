import type { CaseStudy } from "@/app/types/project";
import { hasText, splitParagraphs } from "@/lib/utils";

export const validateCaseStudy = (
  id: string,
  caseStudy: CaseStudy,
): string[] => {
  const issues: string[] = [];
  const reportEmpty = (path: string) => {
    issues.push(`${id}: ${path} 비어 있음`);
  };

  for (const field of ["summary", "background", "team"] as const) {
    if (!hasText(caseStudy[field])) reportEmpty(field);
  }

  // 백틱은 <code> 표시라 짝이 안 맞으면 뒤 문장 전체가 코드로 바뀐다.
  // 자세한 글은 문단마다 따로 렌더링하므로 문단마다 짝이 맞아야 한다.
  const checkBackticks = (path: string, paragraphs: string[]) => {
    const isUnpaired = (part: string) =>
      (part.match(/`/g)?.length ?? 0) % 2 === 1;
    if (paragraphs.some(isUnpaired)) {
      issues.push(`${id}: ${path} 백틱 짝 안 맞음`);
    }
  };
  checkBackticks("background", splitParagraphs(caseStudy.background));

  caseStudy.chunks.forEach((chunk, index) => {
    const path = `chunks[${index}]`;
    if (chunk.figure) {
      checkBackticks(
        `${path}.figure.caption`,
        splitParagraphs(chunk.figure.caption),
      );
    }
    for (const field of ["problem", "solution", "result"] as const) {
      const { detail } = chunk[field];
      if (!detail.some(hasText)) reportEmpty(`${path}.${field}`);
      checkBackticks(`${path}.${field}`, detail);
    }
  });

  return issues;
};
