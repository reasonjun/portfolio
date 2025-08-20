import Image from "next/image";
import type { Project } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
}

const MAX_VISIBLE_TECH_STACK = 3;

export function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const handleClick = () => {
    onProjectClick(project);
  };

  const visibleTechStack = project.techStack.slice(0, MAX_VISIBLE_TECH_STACK);
  const remainingTechStackCount =
    project.techStack.length - MAX_VISIBLE_TECH_STACK;

  return (
    <Card className="overflow-hidden" onClick={handleClick}>
      <div className="aspect-video bg-muted flex items-center justify-center cursor-pointer">
        {project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={`${project.title} 대표 이미지`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-muted-foreground">프로젝트 섬네일</span>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleTechStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
            {remainingTechStackCount > 0 && (
              <Badge variant="outline">+{remainingTechStackCount}</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
