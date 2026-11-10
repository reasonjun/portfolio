import type { Project } from "@/app/types/project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getPublicImageSize } from "@/lib/image-size";
import { GalleryControls } from "./gallery-controls";
import { ZoomableImage } from "./zoomable-image";

// 이보다 넓은 스크린샷은 고해상도(2배) 화면에서 캡처한 것으로 보고, 모달에 원본의 절반 크기로 띄운다.
const RETINA_CAPTURE_MIN_WIDTH = 2400;

interface CaseGalleryProps {
  project: Project;
}

export const CaseGallery = ({ project }: CaseGalleryProps) => {
  if (project.images.length === 0) return null;

  return (
    <Carousel>
      <CarouselContent>
        {project.images.map((image, index) => {
          const { width, height } = getPublicImageSize(image);
          const alt = `${project.title} 이미지 ${index + 1}`;
          return (
            <CarouselItem
              key={`${project.id}-image-${image}`}
              // 폰에서는 가로로 긴 스크린샷에 맞춰 16:10 상자로 두고(화면 높이 50%면 절반이 비었다), sm 이상은 기존 높이.
              className="aspect-[16/10] sm:aspect-auto sm:h-[50vh]"
            >
              <ZoomableImage
                variant="contain"
                src={`/${image}`}
                alt={alt}
                width={width}
                height={height}
                zoomScale={width >= RETINA_CAPTURE_MIN_WIDTH ? 0.5 : 1}
                // 갤러리 첫 장은 제목 바로 아래라 첫 화면의 가장 큰 요소(LCP)가 된다.
                eager={index === 0}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <GalleryControls count={project.images.length} />
    </Carousel>
  );
};
