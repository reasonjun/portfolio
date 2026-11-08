import type { CaseStudy } from "@/app/types/project";

const MIN_PROBLEMS = 2;
const MAX_PROBLEMS = 3;

const isBlank = (value: string): boolean => value.trim() === "";

export const validateCaseStudy = (
  id: string,
  caseStudy: CaseStudy,
): string[] => {
  const issues: string[] = [];
  const reportEmpty = (path: string) => {
    issues.push(`${id}: ${path} 비어 있음`);
  };

  for (const field of [
    "summary",
    "background",
    "role",
    "retrospective",
  ] as const) {
    if (isBlank(caseStudy[field])) reportEmpty(field);
  }

  const count = caseStudy.problems.length;
  if (count < MIN_PROBLEMS || count > MAX_PROBLEMS) {
    issues.push(
      `${id}: problems ${MIN_PROBLEMS}~${MAX_PROBLEMS}개 필요 (현재 ${count}개)`,
    );
  }

  caseStudy.problems.forEach((problem, index) => {
    const path = `problems[${index}]`;
    // considered(검토한 방법)는 비교하지 않고 내린 결정도 있으므로 필수로 보지 않는다.
    for (const field of ["problem", "decision", "result"] as const) {
      if (isBlank(problem[field])) reportEmpty(`${path}.${field}`);
    }
  });

  return issues;
};
