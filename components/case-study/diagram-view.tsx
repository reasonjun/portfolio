import type { ComponentType } from "react";
import type { DiagramId } from "@/app/types/project";
import { BffAuthFlowDiagram } from "./diagrams/bff-auth-flow";
import { BlueGreenDeployDiagram } from "./diagrams/blue-green-deploy";
import { ModalLazyLoadDiagram } from "./diagrams/modal-lazy-load";
import { renderInlineCode } from "./inline-code";

const DIAGRAMS: Record<DiagramId, ComponentType> = {
  "bff-auth-flow": BffAuthFlowDiagram,
  "blue-green-deploy": BlueGreenDeployDiagram,
  "modal-lazy-load": ModalLazyLoadDiagram,
};

interface DiagramViewProps {
  id: DiagramId;
  caption: string;
}

export const DiagramView = ({ id, caption }: DiagramViewProps) => {
  const Diagram = DIAGRAMS[id];

  return (
    <figure className="space-y-2">
      <div className="overflow-x-auto rounded-lg border p-4">
        <Diagram />
      </div>
      <figcaption className="text-sm text-muted-foreground">
        {renderInlineCode(caption)}
      </figcaption>
    </figure>
  );
};
