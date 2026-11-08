import { describe, expect, it } from "vitest";
import type { CaseProblem, CaseStudy } from "@/app/types/project";
import { validateCaseStudy } from "./content-check";

const makeProblem = (overrides: Partial<CaseProblem> = {}): CaseProblem => ({
  title: "문제 제목",
  problem: "무엇이 위험했는가",
  considered: ["검토한 대안"],
  decision: "선택한 방법",
  result: "결과",
  ...overrides,
});

const makeCaseStudy = (overrides: Partial<CaseStudy> = {}): CaseStudy => ({
  summary: "요약",
  background: "배경",
  role: "역할",
  problems: [makeProblem(), makeProblem()],
  retrospective: "회고",
  ...overrides,
});

describe("validateCaseStudy", () => {
  it("모두 채워진 프로젝트는 문제가 없다", () => {
    expect(validateCaseStudy("x", makeCaseStudy())).toEqual([]);
  });

  it("문제가 1개면 개수 부족을 알린다", () => {
    const cs = makeCaseStudy({ problems: [makeProblem()] });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: problems 2~3개 필요 (현재 1개)",
    ]);
  });

  it("문제가 4개면 개수 초과를 알린다", () => {
    const cs = makeCaseStudy({
      problems: [makeProblem(), makeProblem(), makeProblem(), makeProblem()],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: problems 2~3개 필요 (현재 4개)",
    ]);
  });

  it("검토한 방법이 없어도 문제로 보지 않는다(비교하지 않은 결정일 수 있다)", () => {
    const cs = makeCaseStudy({
      problems: [makeProblem(), makeProblem({ considered: [] })],
    });
    expect(validateCaseStudy("x", cs)).toEqual([]);
  });

  it("문제·선택·결과가 비어 있으면 각각 알린다", () => {
    const cs = makeCaseStudy({
      problems: [
        makeProblem({ problem: "", decision: "", result: "" }),
        makeProblem(),
      ],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: problems[0].problem 비어 있음",
      "x: problems[0].decision 비어 있음",
      "x: problems[0].result 비어 있음",
    ]);
  });

  it("역할이 비어 있으면 알린다", () => {
    expect(validateCaseStudy("x", makeCaseStudy({ role: "" }))).toEqual([
      "x: role 비어 있음",
    ]);
  });

  it("공백만 있는 값도 비어 있는 것으로 본다", () => {
    expect(validateCaseStudy("x", makeCaseStudy({ role: "   " }))).toEqual([
      "x: role 비어 있음",
    ]);
  });

  it("비어 있는 항목을 필드 순서대로 모두 알린다", () => {
    const cs = makeCaseStudy({ retrospective: "", summary: "" });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: summary 비어 있음",
      "x: retrospective 비어 있음",
    ]);
  });
});
