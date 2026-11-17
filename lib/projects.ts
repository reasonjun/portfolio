import type {
  ArchiveRow,
  CaseStudyProject,
  ChunkId,
  Project,
} from "@/app/types/project";
import { HOME_PROJECT_IDS, PDF_PROJECT_IDS } from "@/data/project-lists";
import { PROJECTS_DATA } from "@/data/projects";

export const projectHref = (id: string): string => `/projects/${id}/`;

// 덩어리의 그림 파일. 그림 경로를 만드는 곳은 여기 하나다.
// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 사이트에 다크 모드가 없어
// `--theme light`로 내보내 색을 라이트로 고정했고, 그래서 흰 배경에 둔다.
// CLI는 라벨마다 foreignObject 미지원 뷰어용 PNG 폴백(<switch> 안의 base64 <image>)을 넣어 파일이 수백 KB가 된다.
// 브라우저는 foreignObject를 그리므로 내보낸 뒤 그 <image>를 지운다.
// 크기는 적지 않는다. 빌드 시 SVG 파일에서 읽는다(getPublicImageSize). 다시 내보내도 어긋나지 않게 하기 위함이다.
export const chunkFigureSrc = (id: ChunkId): string =>
  `/diagrams/${id}.drawio.svg`;

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

// 목록(data/project-lists.ts)의 id 순서대로 사례를 돌려준다.
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

// PDF(export 페이지)는 목록에 적힌 그대로 싣는다. 빈칸이 없는지는 lib/data.test.ts가 검사한다.
export const getPdfProjects = (): CaseStudyProject[] =>
  getCaseStudiesByIds(PDF_PROJECT_IDS);

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
