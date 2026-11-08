import Image from "next/image";
import type { Project } from "@/app/types/project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { withBasePath } from "@/lib/base-path";

interface CaseGalleryProps {
  project: Project;
}

export const CaseGallery = ({ project }: CaseGalleryProps) => {
  if (project.images.length === 0) return null;

  return (
    <Carousel>
      <CarouselContent>
        {project.images.map((image, index) => (
          <CarouselItem
            key={`${project.id}-image-${image}`}
            className="h-[50vh] relative"
          >
            <Image
              src={withBasePath(`/${image}`)}
              alt={`${project.title} 이미지 ${index + 1}`}
              fill
              className="object-contain"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2" />
      <CarouselNext className="right-2 top-1/2" />
    </Carousel>
  );
};
