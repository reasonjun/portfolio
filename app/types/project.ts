export type DiagramId =
  | "bff-auth-flow"
  | "blue-green-deploy"
  | "msw-mock-switch"
  | "settlement-domain-config"
  | "s3-cache-policy"
  | "e2e-regression-baseline"
  | "ai-agent-guardrails"
  | "vite-rolldown-chunks"
  | "content-form-unify"
  | "design-token-pipeline"
  | "chromatic-visual-test"
  | "nextauth-token-refresh"
  | "ckeditor-virtual-scroll"
  | "a11y-export-check"
  | "fabric-group-batch-add";

export type CaseVisual =
  | { type: "diagram"; id: DiagramId; caption: string }
  | { type: "code"; lang: string; code: string; caption?: string }
  | {
      type: "metrics";
      items: { label: string; before: string; after: string }[];
    };

// 사례 카드의 세 칸(문제 확인 → 해결 과정 → 결과)과 1:1로 대응한다.
// 검토했다가 제외한 방법은 solution 문단 안에 문장으로 쓴다.
export interface CaseProblem {
  title: string;
  problem: string;
  solution: string;
  result: string;
  visual?: CaseVisual;
}

export interface CaseStudy {
  summary: string;
  background: string;
  // 상세 페이지 메타 줄에 붙일 팀 구성("프론트엔드 1 · 백엔드 2")
  team: string;
  problems: CaseProblem[];
}

export interface Project {
  id: string;
  title: string;
  // /archive 표의 제목 아래 부제. "누가 쓰는 무엇"만 담는다(결과·숫자·기술 용어 없음, 45자 이하).
  description: string;
  company: string;
  period: string;
  techStack: string[];
  images: string[];
  // 대표 컷(images[0])을 16:10으로 자를 때 남길 부분. object-position 값(기본 "top").
  coverPosition?: string;
  // 있으면 상세 페이지와 아카이브 링크가 생긴다. 홈·PDF에 싣는 순서는 data/project-lists.ts에서 정한다.
  caseStudy?: CaseStudy;
}

export type CaseStudyProject = Project & { caseStudy: CaseStudy };

export interface ArchiveRow {
  id: string;
  period: string;
  title: string;
  description: string;
  company: string;
  techStack: string[];
  href?: string;
}
