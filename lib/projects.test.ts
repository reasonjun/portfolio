import { describe, expect, it } from "vitest";
import type { CaseStudy, Project } from "@/app/types/project";
import {
  getArchiveRows,
  getCaseStudies,
  getCaseStudyById,
  getExportProjects,
  getStartYear,
} from "./projects";

const caseStudy: CaseStudy = {
  summary: "요약",
  background: "배경",
  team: "프런트엔드 1",
  problems: [],
};

const makeProject = (overrides: Partial<Project>): Project => ({
  id: "x",
  title: "제목",
  description: "설명",
  detailDescription: "상세 설명",
  company: "회사",
  period: "2024.07.",
  techStack: ["TypeScript"],
  images: [],
  ...overrides,
});

const fixtures: Project[] = [
  makeProject({
    id: "case-a",
    title: "사례 A",
    company: "회사 A",
    period: "2026.07. ~ 진행 중",
    techStack: ["Next.js", "React"],
    caseStudy,
  }),
  makeProject({ id: "plain-b", period: "2024.07." }),
  makeProject({ id: "plain-c", period: "2019.02. ~ 2019.11." }),
];

describe("getStartYear", () => {
  it("기간 문자열에서 시작 연도 4자리를 반환한다", () => {
    expect(getStartYear("2026.07. ~ 진행 중")).toBe("2026");
    expect(getStartYear("2024.07.")).toBe("2024");
  });
});

describe("getCaseStudies", () => {
  it("caseStudy가 있는 프로젝트만 데이터 순서대로 반환한다", () => {
    expect(getCaseStudies(fixtures).map((p) => p.id)).toEqual(["case-a"]);
  });
});

describe("getCaseStudyById", () => {
  it("대표 프로젝트 id면 해당 프로젝트를 반환한다", () => {
    expect(getCaseStudyById("case-a", fixtures)?.title).toBe("사례 A");
  });

  it("caseStudy가 없는 프로젝트 id면 undefined를 반환한다", () => {
    expect(getCaseStudyById("plain-b", fixtures)).toBeUndefined();
  });

  it("없는 id면 undefined를 반환한다", () => {
    expect(getCaseStudyById("unknown", fixtures)).toBeUndefined();
  });
});

describe("getArchiveRows", () => {
  it("전체 프로젝트를 데이터 순서대로 행으로 만든다", () => {
    expect(getArchiveRows(fixtures).map((row) => row.id)).toEqual([
      "case-a",
      "plain-b",
      "plain-c",
    ]);
  });

  it("행에 연도·제목·회사·기술을 담는다", () => {
    expect(getArchiveRows(fixtures)[0]).toMatchObject({
      year: "2026",
      title: "사례 A",
      company: "회사 A",
      techStack: ["Next.js", "React"],
    });
  });

  it("대표 프로젝트 행만 프로젝트 페이지 href를 가진다", () => {
    const rows = getArchiveRows(fixtures);
    expect(rows[0].href).toBe("/projects/case-a/");
    expect(rows[1].href).toBeUndefined();
  });
});

describe("getExportProjects", () => {
  it("홈 대표 사례를 homeOrder 순으로, 콘텐츠 검사를 통과한 것만 반환한다", () => {
    const projects = [
      makeProject({ id: "third", homeOrder: 3, caseStudy }),
      makeProject({
        id: "blank",
        homeOrder: 1,
        caseStudy: { ...caseStudy, summary: "" },
      }),
      makeProject({ id: "second", homeOrder: 2, caseStudy }),
      makeProject({ id: "unranked", caseStudy }),
    ];
    expect(getExportProjects(projects).map((p) => p.id)).toEqual([
      "second",
      "third",
    ]);
  });
});
