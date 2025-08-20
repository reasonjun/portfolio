"use client";

import Image from "next/image";
import type { Project } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) => {
  if (!project) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const hasImages = project.images.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {project.title}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {project.company} | {project.period}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 캐러셀 */}
          {hasImages && (
            <Carousel className="w-full max-w-full">
              <CarouselContent className="h-48 md:h-64">
                {project.images.map((image, index) => (
                  <CarouselItem key={`${project.id}-image-${index}`}>
                    <div className="h-48 md:h-64 lg:aspect-video bg-muted rounded-lg overflow-hidden relative">
                      <Image
                        src={image}
                        alt={`${project.title} 이미지 ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 top-1/2" />
              <CarouselNext className="right-2 top-1/2" />
            </Carousel>
          )}

          {/* 프로젝트 상세 설명 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">프로젝트 설명</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.detailDescription}
              </p>
            </div>

            {/* 기술 스택 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">사용 기술</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <Badge
                    key={`${project.id}-tech-${index}`}
                    variant="secondary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
