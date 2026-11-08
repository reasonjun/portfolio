interface PipelineProps {
  stages: string[];
}

const STAGE_DELAY_MS = 400;

export const Pipeline = ({ stages }: PipelineProps) => (
  <ol aria-label="개발 파이프라인" className="grid max-w-xl grid-cols-4 gap-2">
    {stages.map((stage, index) => (
      <li
        key={stage}
        data-stage={stage}
        className="space-y-3 motion-safe:animate-[pipeline-light_600ms_ease-out_both]"
        style={{ animationDelay: `${index * STAGE_DELAY_MS}ms` }}
      >
        <span aria-hidden="true" className="block h-2 bg-primary" />
        <span className="block text-lg font-medium">{stage}</span>
      </li>
    ))}
  </ol>
);
