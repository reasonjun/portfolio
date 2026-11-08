import { expect, it } from "vitest";
import { validateCaseStudy } from "@/lib/content-check";
import { getCaseStudies } from "@/lib/projects";

it("대표 프로젝트 콘텐츠가 모두 채워져 있다", () => {
  const issues = getCaseStudies().flatMap((project) =>
    validateCaseStudy(project.id, project.caseStudy),
  );

  expect(issues, issues.join("\n")).toEqual([]);
});
