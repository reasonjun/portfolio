import type {
  ArchiveRow,
  CaseStudyProject,
  Project,
} from "@/app/types/project";
import { PROJECTS_DATA } from "@/data/projects";
import { validateCaseStudy } from "@/lib/content-check";

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

export const getHomeProjects = (
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject[] =>
  getCaseStudies(projects)
    .filter((project) => project.homeOrder !== undefined)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0));

// PDF(export 페이지)는 홈 대표 사례를 같은 순서로 싣되, 콘텐츠 검사를 통과하지 못한(빈칸이 남은) 사례는 채울 때까지 뺀다.
export const getExportProjects = (
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject[] =>
  getHomeProjects(projects).filter(
    (project) => validateCaseStudy(project.id, project.caseStudy).length === 0,
  );

export const getCaseStudyById = (
  id: string,
  projects: Project[] = PROJECTS_DATA,
): CaseStudyProject | undefined =>
  getCaseStudies(projects).find((project) => project.id === id);

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
    href: hasCaseStudy(project) ? `/projects/${project.id}/` : undefined,
  }));
