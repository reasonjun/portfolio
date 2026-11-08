"use client";

import { useState } from "react";
import type { Project } from "@/app/types/project";
import ProjectDetailModal from "@/components/project-detail-modal";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./project-card";

const ProjectsSection = () => {
  const { visibleProjects, hasMoreProjects, showMoreProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">프로젝트</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onProjectClick={openModal}
          />
        ))}
      </div>

      {hasMoreProjects && (
        <div className="flex justify-center">
          <Button
            onClick={showMoreProjects}
            variant="outline"
            size="lg"
            className="mt-6"
          >
            더보기
          </Button>
        </div>
      )}

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ProjectsSection;
