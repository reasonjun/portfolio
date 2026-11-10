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
  team: "프런트엔드 1",
  problems: [makeProblem(), makeProblem()],
  ...overrides,
});

describe("validateCaseStudy", () => {
  it("모두 채워진 프로젝트는 문제가 없다", () => {
    expect(validateCaseStudy("x", makeCaseStudy())).toEqual([]);
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

  it("백틱 짝이 안 맞으면 알린다", () => {
    const cs = makeCaseStudy({
      problems: [
        makeProblem({ decision: "`X-Id` 헤더와 `?dpl= 쿼리" }),
        makeProblem(),
      ],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: problems[0].decision 백틱 짝 안 맞음",
    ]);
  });

  it("팀 구성이 비어 있으면 알린다", () => {
    expect(validateCaseStudy("x", makeCaseStudy({ team: "" }))).toEqual([
      "x: team 비어 있음",
    ]);
  });

  it("공백만 있는 값도 비어 있는 것으로 본다", () => {
    expect(
      validateCaseStudy("x", makeCaseStudy({ background: "   " })),
    ).toEqual(["x: background 비어 있음"]);
  });

  it("비어 있는 항목을 필드 순서대로 모두 알린다", () => {
    const cs = makeCaseStudy({ background: "", summary: "" });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: summary 비어 있음",
      "x: background 비어 있음",
    ]);
  });
});
