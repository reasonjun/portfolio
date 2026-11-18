// 덩어리 id. 그림 파일 이름(원본 diagrams/<id>.drawio, 구운 그림 public/diagrams/<id>.svg), 웹 앵커(#id), PDF 목록이 모두 이 값을 쓴다.
export type ChunkId =
  | "blue-green-deploy"
  | "bff-auth-flow"
  | "msw-mock-switch"
  | "settlement-domain-config"
  | "s3-cache-policy"
  | "e2e-regression-baseline"
  | "ai-agent-guardrails"
  | "vite-rolldown-chunks"
  | "content-form-unify"
  | "nextauth-token-refresh"
  | "design-token-pipeline"
  | "chromatic-visual-test"
  | "ckeditor-virtual-scroll"
  | "a11y-export-check"
  | "first-load-lcp"
  | "fabric-group-batch-add";

export interface ChunkSection {
  // 짧은 글. PDF와 웹 사례 페이지가 같이 쓴다. 3개 이상을 기본으로 쓴다. 자세한 글에 근거가 모자란 칸은 예외다.
  points: string[];
  // 자세한 글. 문단마다 한 항목이다.
  detail: string[];
}

export interface ChunkFigure {
  alt: string;
  caption: string;
}

// 문제 해결 사례 하나. 웹 사례 카드와 PDF의 한 쪽이 이 단위다.
// 세 섹션은 화면의 세 칸(문제 확인 → 해결 과정 → 결과)과 1:1로 대응한다.
// 검토했다가 제외한 방법은 solution의 문단 안에 문장으로 쓴다.
export interface Chunk {
  id: ChunkId;
  title: string;
  figure?: ChunkFigure;
  problem: ChunkSection;
  solution: ChunkSection;
  result: ChunkSection;
}

export interface CaseStudy {
  summary: string;
  background: string;
  // 상세 페이지 메타 줄에 붙일 팀 구성("프론트엔드 1 · 백엔드 2")
  team: string;
  chunks: Chunk[];
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
