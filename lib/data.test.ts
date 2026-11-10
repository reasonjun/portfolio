import { describe, expect, it } from "vitest";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { PROFILE } from "@/data/profile";
import { PROJECTS_DATA } from "@/data/projects";
import { getArchiveRows, getCaseStudies, getHomeProjects } from "./projects";

describe("대표 프로젝트 데이터", () => {
  it("대표 프로젝트 7개가 데이터 순서대로 지정되어 있다", () => {
    expect(getCaseStudies().map((project) => project.id)).toEqual([
      "enterprise-legal-management",
      "external-settlement-system",
      "ip-management-system",
      "ats-monitoring-system",
      "design-system",
      "wysiwyg-editor",
      "tactile-graphics-editor",
    ]);
  });

  it("홈 대표 프로젝트 6개가 임팩트순으로 나온다", () => {
    expect(getHomeProjects().map((project) => project.id)).toEqual([
      "enterprise-legal-management",
      "ip-management-system",
      "external-settlement-system",
      "wysiwyg-editor",
      "tactile-graphics-editor",
      "design-system",
    ]);
  });

  it("아카이브는 전체 프로젝트 18개를 담는다", () => {
    expect(getArchiveRows()).toHaveLength(18);
  });

  it("프로젝트 id가 중복되지 않는다", () => {
    const ids = PROJECTS_DATA.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("법무관리 프로젝트의 문제에 배포와 인증 흐름 도식이 연결되어 있다", () => {
    const legal = getCaseStudies().find(
      (project) => project.id === "enterprise-legal-management",
    );
    const diagramIds = legal?.caseStudy.problems.flatMap((problem) =>
      problem.visual?.type === "diagram" ? [problem.visual.id] : [],
    );
    expect(diagramIds).toEqual([
      "blue-green-deploy",
      "bff-auth-flow",
      "modal-lazy-load",
    ]);
  });

  it("모든 프로젝트와 경력에서 '채용관리솔루션' 표기를 쓴다", () => {
    const text = JSON.stringify([PROJECTS_DATA, EXPERIENCES_DATA]);
    expect(text).not.toContain("채용 관리 솔루션");
  });
});

describe("프로필 데이터", () => {
  it("Hero 핵심 수치는 정확히 3개다", () => {
    expect(PROFILE.metrics).toHaveLength(3);
  });
});

describe("경력 데이터", () => {
  it("모든 경력에 직무, 한 줄 소개, 한 일 목록이 있다", () => {
    const incomplete = EXPERIENCES_DATA.filter(
      (experience) =>
        experience.jobs.length === 0 ||
        !experience.tagline.trim() ||
        experience.duties.length === 0,
    ).map((experience) => experience.id);
    expect(incomplete).toEqual([]);
  });

  it("직무는 표준 직무명만 쓴다", () => {
    const jobs = new Set(
      EXPERIENCES_DATA.flatMap((experience) => experience.jobs),
    );
    expect([...jobs].sort()).toEqual(["백엔드 개발", "프런트엔드 개발"]);
  });

  it("경력 문구는 '프런트엔드'로 표기한다", () => {
    expect(JSON.stringify(EXPERIENCES_DATA)).not.toContain("프론트엔드");
  });

  it("닷 경력에 초기 로딩 60초 → 1초와 측정 조건이 있다", () => {
    const dot = EXPERIENCES_DATA.find((experience) => experience.id === "dot");
    const loading = dot?.duties.find((duty) => duty.includes("60초 → 1초"));
    expect(loading).toContain("캐시 비운 첫 접속");
    expect(loading).toContain("운영 환경 기준");
  });

  it("닷은 백엔드 개발 직무를 뒷받침하는 풀스택 문장이 있다", () => {
    const dot = EXPERIENCES_DATA.find((experience) => experience.id === "dot");
    expect(dot?.jobs).toContain("백엔드 개발");
    expect(dot?.duties.some((duty) => duty.includes("Java/Spring Boot"))).toBe(
      true,
    );
  });
});
