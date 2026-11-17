import { describe, expect, it } from "vitest";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { PROFILE } from "@/data/profile";
import { HOME_PROJECT_IDS, PDF_PROJECT_IDS } from "@/data/project-lists";
import { PROJECTS_DATA } from "@/data/projects";
import { validateCaseStudy } from "@/lib/content-check";
import {
  getArchiveRows,
  getCaseStudies,
  getHomeProjects,
  getPdfProjects,
} from "./projects";

describe("프로젝트 데이터", () => {
  it("사례가 있는 프로젝트 7개가 데이터 순서대로 있다", () => {
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

  it("홈·PDF 목록은 사례가 있는 프로젝트만 중복 없이 가리킨다", () => {
    expect(() => [getHomeProjects(), getPdfProjects()]).not.toThrow();
    for (const ids of [HOME_PROJECT_IDS, PDF_PROJECT_IDS]) {
      expect(new Set(ids).size, ids.join(", ")).toBe(ids.length);
    }
  });

  it("PDF 목록의 사례는 빈칸 없이 다 쓴 것이다", () => {
    const issues = getPdfProjects().flatMap((project) =>
      validateCaseStudy(project.id, project.caseStudy),
    );
    expect(issues, issues.join("\n")).toEqual([]);
  });

  // 사례를 다 쓰면 이 테스트가 깨진다. PDF에 실으려면 data/project-lists.ts의 PDF_PROJECT_IDS에 넣고,
  // 웹(상세 페이지·아카이브)에만 두려면 아래 목록에 적는다.
  it("다 쓴 사례 중 PDF에 없는 것은 웹 전용으로 정한 사례뿐이다", () => {
    const webOnly = getCaseStudies()
      .filter(
        (project) =>
          validateCaseStudy(project.id, project.caseStudy).length === 0,
      )
      .filter((project) => !PDF_PROJECT_IDS.includes(project.id))
      .map((project) => project.id);
    expect(webOnly).toEqual(["ats-monitoring-system"]);
  });

  it("아카이브는 전체 프로젝트 18개를 담는다", () => {
    expect(getArchiveRows()).toHaveLength(18);
  });

  it("아카이브 부제는 45자 이하다", () => {
    const tooLong = PROJECTS_DATA.filter(
      (project) => [...project.description].length > 45,
    ).map((project) => project.id);
    expect(tooLong).toEqual([]);
  });

  it("프로젝트 id가 중복되지 않는다", () => {
    const ids = PROJECTS_DATA.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("법무관리 프로젝트의 덩어리에 배포와 인증 흐름 도식이 연결되어 있다", () => {
    const legal = getCaseStudies().find(
      (project) => project.id === "enterprise-legal-management",
    );
    const figureIds = legal?.caseStudy.chunks.flatMap((chunk) =>
      chunk.figure ? [chunk.id] : [],
    );
    expect(figureIds).toEqual([
      "blue-green-deploy",
      "bff-auth-flow",
      "msw-mock-switch",
    ]);
  });

  it("모든 프로젝트와 경력에서 '채용관리솔루션' 표기를 쓴다", () => {
    const text = JSON.stringify([PROJECTS_DATA, EXPERIENCES_DATA]);
    expect(text).not.toContain("채용 관리 솔루션");
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
    expect([...jobs].sort()).toEqual(["QA", "백엔드 개발", "프론트엔드 개발"]);
  });

  it("경력·프로젝트·프로필 문구는 '프론트엔드'로 표기한다", () => {
    expect(
      JSON.stringify([EXPERIENCES_DATA, PROJECTS_DATA, PROFILE]),
    ).not.toContain("프런트엔드");
  });

  it("닷 경력에 초기 로딩 1분 이상 → 1초와 측정 조건이 있다", () => {
    const dot = EXPERIENCES_DATA.find((experience) => experience.id === "dot");
    const loading = dot?.duties.find((duty) => duty.includes("1분 이상 → 1초"));
    expect(loading).toContain("캐시 비운 첫 접속");
    expect(loading).toContain("운영 환경 기준");
  });

  it("닷은 백엔드 개발 직무를 뒷받침하는 Java/Spring Boot 문장이 있다", () => {
    const dot = EXPERIENCES_DATA.find((experience) => experience.id === "dot");
    expect(dot?.jobs).toContain("백엔드 개발");
    expect(dot?.duties.some((duty) => duty.includes("Java/Spring Boot"))).toBe(
      true,
    );
  });
});
