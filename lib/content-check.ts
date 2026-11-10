import type { CaseStudy } from "@/app/types/project";
import { hasText } from "@/lib/utils";

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
  const checkBackticks = (path: string, value: string) => {
    if ((value.match(/`/g)?.length ?? 0) % 2 === 1) {
      issues.push(`${id}: ${path} 백틱 짝 안 맞음`);
    }
  };
  checkBackticks("background", caseStudy.background);

  caseStudy.problems.forEach((problem, index) => {
    const path = `problems[${index}]`;
    for (const [i, item] of problem.considered.entries()) {
      checkBackticks(`${path}.considered[${i}]`, item);
    }
    const caption =
      problem.visual && "caption" in problem.visual
        ? problem.visual.caption
        : undefined;
    if (caption) checkBackticks(`${path}.visual.caption`, caption);
    // considered(검토한 방법)는 비교하지 않고 내린 결정도 있으므로 필수로 보지 않는다.
    for (const field of ["problem", "decision", "result"] as const) {
      if (!hasText(problem[field])) reportEmpty(`${path}.${field}`);
      checkBackticks(`${path}.${field}`, problem[field]);
    }
  });

  return issues;
};
