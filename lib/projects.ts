import type {
  ArchiveRow,
  CaseStudyProject,
  Project,
} from "@/app/types/project";
import { PROJECTS_DATA } from "@/data/projects";

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
