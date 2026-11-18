import type {
  ArchiveRow,
  CaseStudyProject,
  Chunk,
  ChunkFigure,
  ChunkId,
  Project,
} from "@/app/types/project";
import { HOME_PROJECT_IDS, PDF_CHUNK_IDS } from "@/data/project-lists";
import { PROJECTS_DATA } from "@/data/projects";

export const projectHref = (id: string): string => `/projects/${id}/`;

// 덩어리의 그림 파일. 그림 경로를 만드는 곳은 여기 하나다.
// 원본 diagrams/<id>.drawio를 구운 SVG다(pnpm diagrams, 이유는 scripts/bake-diagrams.mjs).
// 색을 라이트로 고정해 굽기 때문에 흰 배경에 둔다.
// 크기는 적지 않는다. 빌드 시 SVG 파일에서 읽는다(getPublicImageSize). 다시 구워도 어긋나지 않게 하기 위함이다.
export const chunkFigureSrc = (id: ChunkId): string => `/diagrams/${id}.svg`;

const hasCaseStudy = (project: Project): project is CaseStudyProject =>
  project.caseStudy !== undefined;

// 전체 목록에는 주요 기술만 싣는다. TypeScript가 있으면 JavaScript는 구분력이 없어 빼고, 앞에서 5개까지 남긴다.
// shortcut: 데이터의 나열 순서를 중요도로 본다. 순서가 틀린 행은 data/projects.ts에서 순서를 고친다.
export const getMainTech = (techStack: string[]): string[] => {
  const hasTs = techStack.some((tech) => tech.startsWith("TypeScript"));
  return techStack
    .filter((tech) => !(hasTs && tech === "JavaScript"))
    .slice(0, 5);
};

export const getCaseStudies = (
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject[] => projects.filter(hasCaseStudy);

export const getCaseStudyById = (
  id: string,
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject | undefined =>
  getCaseStudies(projects).find((project) => project.id === id);

// 없는 id나 사례가 없는 프로젝트 id는 거르지 않고 던진다. 목록의 오타나 지운 프로젝트가 화면에서 몰래 빠지지 않고 빌드·테스트가 멈춘다.
export const getCaseStudiesByIds = (
  ids: string[],
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject[] =>
  ids.map((id) => {
    const project = getCaseStudyById(id, projects);
    if (!project) throw new Error(`${id}: 사례가 있는 프로젝트가 아님`);
    return project;
  });

export const getHomeProjects = (): CaseStudyProject[] =>
  getCaseStudiesByIds(HOME_PROJECT_IDS);

// 덩어리 블록의 자세한 글이 이 id로 시작한다. PDF의 제목 링크가 가리키는 곳이다.
// 앵커 대상을 품은 닫힌 <details>는 브라우저가 스스로 연다. <details> 자체를 가리키면 열리지 않으므로 안쪽 요소에 둔다.
export const chunkDetailAnchor = (id: ChunkId): string => `${id}-detail`;

export type PdfChunk = Chunk & { figure: ChunkFigure };

const isPdfChunk = (chunk: Chunk): chunk is PdfChunk =>
  chunk.figure !== undefined;

// 없는 id나 그림이 없는 덩어리는 거르지 않고 던진다. 목록의 실수가 PDF에서 몰래 빠지지 않고 빌드가 멈춘다.
export const getPdfChunks = (
  ids: ChunkId[] = PDF_CHUNK_IDS,
  projects: Project[] = PROJECTS_DATA,
): { project: CaseStudyProject; chunk: PdfChunk }[] =>
  ids.map((id) => {
    for (const project of getCaseStudies(projects)) {
      const chunk = project.caseStudy.chunks.find((item) => item.id === id);
      if (!chunk) continue;
      if (!isPdfChunk(chunk)) {
        throw new Error(`${id}: 그림이 없어 PDF에 실을 수 없음`);
      }
      return { project, chunk };
    }
    throw new Error(`${id}: 덩어리가 없음`);
  });

export const getArchiveRows = (
  projects: Project[] = PROJECTS_DATA,
): ArchiveRow[] =>
  projects.map((project) => ({
    id: project.id,
    period: project.period,
    title: project.title,
    description: project.description,
    company: project.company,
    techStack: getMainTech(project.techStack),
    href: hasCaseStudy(project) ? projectHref(project.id) : undefined,
  }));
