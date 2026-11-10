import type {
  ArchiveRow,
  CaseStudyProject,
  Project,
} from "@/app/types/project";
import { PROJECTS_DATA } from "@/data/projects";
import { validateCaseStudy } from "@/lib/content-check";

const hasCaseStudy = (project: Project): project is CaseStudyProject =>
  project.caseStudy !== undefined;

export const getStartYear = (period: string): string =>
  period.match(/\d{4}/)?.[0] ?? "";

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
    year: getStartYear(project.period),
    title: project.title,
    company: project.company,
    techStack: project.techStack,
    href: hasCaseStudy(project) ? `/projects/${project.id}/` : undefined,
  }));
