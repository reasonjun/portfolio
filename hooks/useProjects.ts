"use client";

import { useMemo, useState } from "react";
import { PROJECTS_DATA, PROJECTS_PER_PAGE } from "@/data/projects";

export const useProjects = () => {
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  const visibleProjects = useMemo(
    () => PROJECTS_DATA.slice(0, visibleCount),
    [visibleCount],
  );

  const hasMoreProjects = useMemo(
    () => visibleCount < PROJECTS_DATA.length,
    [visibleCount],
  );

  const showMoreProjects = () => {
    setVisibleCount((prev) => prev + PROJECTS_PER_PAGE);
  };

  return {
    projects: PROJECTS_DATA,
    visibleProjects,
    hasMoreProjects,
    showMoreProjects,
  };
};
