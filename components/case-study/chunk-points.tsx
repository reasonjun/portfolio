import type { Chunk } from "@/app/types/project";
import { cn } from "@/lib/utils";
import { renderInlineCode } from "./inline-code";

// 요점의 세 칸. 칸 이름은 사용자가 따르는 가이드의 템플릿과 같다.
const SECTIONS = [
  { key: "problem", label: "문제 원인" },
  { key: "solution", label: "해결 과정" },
  { key: "result", label: "결과" },
] as const;

interface ChunkPointsProps {
  chunk: Chunk;
  className?: string;
}

// PDF의 덩어리 쪽과 웹 사례 페이지가 같이 쓴다. 모양은 쓰는 쪽이 정한다(PDF는 paper.css의 .chunk-points, 웹은 className).
export const ChunkPoints = ({ chunk, className }: ChunkPointsProps) => (
  <dl className={cn("chunk-points", className)}>
    {SECTIONS.map(({ key, label }) => (
      <div key={key}>
        <dt>{label}</dt>
        <dd>
          <ul>
            {chunk[key].points.map((point) => (
              <li key={point}>{renderInlineCode(point)}</li>
            ))}
          </ul>
        </dd>
      </div>
    ))}
  </dl>
);
