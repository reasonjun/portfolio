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
  // 해결 과정은 문단마다 따로 렌더링하므로 문단마다 짝이 맞아야 한다.
  const checkBackticks = (path: string, value: string) => {
    const isUnpaired = (part: string) =>
      (part.match(/`/g)?.length ?? 0) % 2 === 1;
    if (splitParagraphs(value).some(isUnpaired)) {
      issues.push(`${id}: ${path} 백틱 짝 안 맞음`);
    }
  };
  checkBackticks("background", caseStudy.background);

  caseStudy.problems.forEach((problem, index) => {
    const path = `problems[${index}]`;
    const caption =
      problem.visual && "caption" in problem.visual
        ? problem.visual.caption
        : undefined;
    if (caption) checkBackticks(`${path}.visual.caption`, caption);
    for (const field of ["problem", "solution", "result"] as const) {
      if (!hasText(problem[field])) reportEmpty(`${path}.${field}`);
      checkBackticks(`${path}.${field}`, problem[field]);
    }
  });

  return issues;
};
