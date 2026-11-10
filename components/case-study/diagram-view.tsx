import type { DiagramId } from "@/app/types/project";
import { getPublicImageSize } from "@/lib/image-size";
import { DIAGRAMS } from "./diagrams";
import { renderInlineCode, stripInlineCode } from "./inline-code";
import { ZoomableImage } from "./zoomable-image";

interface DiagramViewProps {
  id: DiagramId;
  caption: string;
}

export const DiagramView = ({ id, caption }: DiagramViewProps) => {
  const diagram = DIAGRAMS[id];

  return (
    <figure className="space-y-2">
      <div className="rounded-lg border p-4 print:p-2">
        <ZoomableImage
          {...diagram}
          {...getPublicImageSize(diagram.src)}
          title={stripInlineCode(caption)}
          className="rounded bg-white p-2 print:p-0"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">
        {renderInlineCode(caption)}
      </figcaption>
    </figure>
  );
};
