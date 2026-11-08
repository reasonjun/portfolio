export interface Experience {
  id: string;
  company: string;
  period: string;
  isActive: boolean;
  // 소속·직급. 예: "백오피스개발팀 · 매니저". 소속이 없으면 생략한다.
  position?: string;
  // 표준 직무명. 예: "프런트엔드 개발", "백엔드 개발"
  jobs: string[];
  // 회사나 서비스를 설명하는 한 줄
  tagline: string;
  // 그 회사에서 맡은 역할·책임. 대표 프로젝트 카드와 겹치지 않게 쓴다.
  duties: string[];
}
