import type { ChunkId } from "@/app/types/project";

// 무엇을 어느 화면에 어떤 순서로 싣는지 정한다. 사례 내용은 data/projects.ts에 둔다.
// 홈은 프로젝트 단위로, PDF는 덩어리 단위로 고른다. 두 목록은 서로 독립이다.

export const HOME_PROJECT_IDS = [
  "enterprise-legal-management",
  "ip-management-system",
  "external-settlement-system",
  "design-system",
  "wysiwyg-editor",
  "tactile-graphics-editor",
];

// 이력서와 함께 내는 PDF에 싣는 덩어리. 적힌 순서가 PDF의 쪽 순서다.
// 그림이 있는 덩어리만 넣을 수 있다. 없으면 getPdfChunks가 던져 빌드가 멈춘다.
export const PDF_CHUNK_IDS: ChunkId[] = [
  "fsd-boundary-check",
  "blue-green-deploy",
  "bff-auth-flow",
  "e2e-regression-baseline",
  "content-form-unify",
  "settlement-domain-config",
  "design-system-architecture",
  "ckeditor-virtual-scroll",
  "first-load-lcp",
  "fabric-group-batch-add",
];
