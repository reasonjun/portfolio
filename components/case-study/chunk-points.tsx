import type { PdfChunk } from "@/lib/projects";
import { renderInlineCode } from "./inline-code";

// 요점의 세 칸. 칸 이름은 사용자가 따르는 가이드의 템플릿과 같다.
const SECTIONS = [
  { key: "problem", label: "문제 원인" },
  { key: "solution", label: "해결 과정" },
  { key: "result", label: "결과" },
] as const;

interface ChunkPointsProps {
  chunk: PdfChunk;
}

// PDF의 덩어리 쪽이 쓴다. 여백과 글자 크기는 쓰는 쪽의 CSS(.chunk-points)가 정한다.
export const ChunkPoints = ({ chunk }: ChunkPointsProps) => (
  <dl className="chunk-points">
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
