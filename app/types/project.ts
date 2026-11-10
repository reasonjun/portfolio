export type DiagramId =
  | "bff-auth-flow"
  | "blue-green-deploy"
  | "modal-lazy-load";

export type CaseVisual =
  | { type: "diagram"; id: DiagramId; caption: string }
  | { type: "code"; lang: string; code: string; caption?: string }
  | {
      type: "metrics";
      items: { label: string; before: string; after: string }[];
    };

export interface CaseProblem {
  title: string;
  problem: string;
  considered: string[];
  decision: string;
  result: string;
  visual?: CaseVisual;
}

export interface CaseStudy {
  summary: string;
  background: string;
  // 상세 페이지 메타 줄에 붙일 팀 구성("프런트엔드 1 · 백엔드 2")
  team: string;
  problems: CaseProblem[];
}

/** 프로젝트 결과를 한눈에 보여 주는 수치. 본문의 결과와 같은 값만 적는다. */
export interface Highlight {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailDescription: string;
  company: string;
  period: string;
  techStack: string[];
  images: string[];
  // 대표 컷(images[0])을 16:10으로 자를 때 남길 부분. object-position 값(기본 "top").
  coverPosition?: string;
  // 홈 대표 프로젝트 카드의 표시 순서(1부터). 없으면 홈에 나오지 않는다.
  homeOrder?: number;
  highlights?: Highlight[];
  caseStudy?: CaseStudy;
}

export type CaseStudyProject = Project & { caseStudy: CaseStudy };

export interface ArchiveRow {
  id: string;
  year: string;
  title: string;
  company: string;
  techStack: string[];
  href?: string;
}
