import { describe, expect, it } from "vitest";
import type { CaseStudy, Chunk } from "@/app/types/project";
import { validateCaseStudy } from "./content-check";

const makeChunk = (overrides: Partial<Chunk> = {}): Chunk => ({
  id: "blue-green-deploy",
  title: "문제 제목",
  problem: { detail: ["무엇이 위험했는가"] },
  solution: { detail: ["해결 과정"] },
  result: { detail: ["결과"] },
  ...overrides,
});

const makeCaseStudy = (overrides: Partial<CaseStudy> = {}): CaseStudy => ({
  summary: "요약",
  background: "배경",
  team: "프론트엔드 1",
  chunks: [makeChunk(), makeChunk()],
  ...overrides,
});

describe("validateCaseStudy", () => {
  it("모두 채워진 프로젝트는 문제가 없다", () => {
    expect(validateCaseStudy("x", makeCaseStudy())).toEqual([]);
  });

  it("문제 확인·해결 과정·결과가 비어 있으면 각각 알린다", () => {
    const cs = makeCaseStudy({
      chunks: [
        makeChunk({
          problem: { detail: [] },
          solution: { detail: [""] },
          result: { detail: ["  "] },
        }),
        makeChunk(),
      ],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: chunks[0].problem 비어 있음",
      "x: chunks[0].solution 비어 있음",
      "x: chunks[0].result 비어 있음",
    ]);
  });

  it("백틱 짝이 안 맞으면 알린다", () => {
    const cs = makeCaseStudy({
      chunks: [
        makeChunk({ solution: { detail: ["`X-Id` 헤더와 `?dpl= 쿼리"] } }),
        makeChunk(),
      ],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: chunks[0].solution 백틱 짝 안 맞음",
    ]);
  });

  it("해결 과정은 문단마다 백틱 짝을 본다", () => {
    // 전체로는 2개라 짝이 맞아 보이지만, 문단마다 따로 렌더링하면 두 문단 모두 끝까지 코드가 된다.
    const cs = makeCaseStudy({
      chunks: [
        makeChunk({ solution: { detail: ["첫 문단 `a", "둘째 문단 b`"] } }),
      ],
    });
    expect(validateCaseStudy("x", cs)).toEqual([
      "x: chunks[0].solution 백틱 짝 안 맞음",
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
