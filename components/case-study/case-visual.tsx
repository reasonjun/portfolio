import type { CaseVisual as CaseVisualData } from "@/app/types/project";
import { CodeBlock } from "./code-block";
import { DiagramView } from "./diagram-view";
import { MetricsCard } from "./metrics-card";

interface CaseVisualProps {
  visual: CaseVisualData;
}

export const CaseVisual = ({ visual }: CaseVisualProps) => {
  if (visual.type === "code") {
    return (
      <CodeBlock
        lang={visual.lang}
        code={visual.code}
        caption={visual.caption}
      />
    );
  }

  if (visual.type === "metrics") {
    return <MetricsCard items={visual.items} />;
  }

  return <DiagramView id={visual.id} caption={visual.caption} />;
};
