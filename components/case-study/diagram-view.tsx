import type { ChunkFigure, ChunkId } from "@/app/types/project";
import { getPublicImageSize } from "@/lib/image-size";
import { chunkFigureSrc } from "@/lib/projects";
import { renderInlineCode, stripInlineCode } from "./inline-code";
import { ZoomableImage } from "./zoomable-image";

interface DiagramViewProps {
  id: ChunkId;
  figure: ChunkFigure;
}

export const DiagramView = ({ id, figure }: DiagramViewProps) => {
  const src = chunkFigureSrc(id);

  return (
    <figure className="space-y-2">
      <div className="rounded-lg border p-4">
        <ZoomableImage
          src={src}
          alt={figure.alt}
          {...getPublicImageSize(src)}
          title={stripInlineCode(figure.caption)}
          className="rounded bg-white p-2"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">
        {renderInlineCode(figure.caption)}
      </figcaption>
    </figure>
  );
};
