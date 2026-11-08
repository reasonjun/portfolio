const BOX_HEIGHT = 64;

interface NodeProps {
  x: number;
  y: number;
  width: number;
  title: string;
  subtitle?: string;
  highlighted?: boolean;
}

const Node = ({
  x,
  y,
  width,
  title,
  subtitle,
  highlighted = false,
}: NodeProps) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={BOX_HEIGHT}
      rx={10}
      fill={highlighted ? "var(--muted)" : "none"}
      stroke="currentColor"
      strokeWidth={highlighted ? 2.5 : 1.5}
    />
    <text
      x={x + width / 2}
      y={subtitle ? y + 28 : y + 38}
      textAnchor="middle"
      fontSize={16}
      fontWeight={600}
      fill="currentColor"
    >
      {title}
    </text>
    {subtitle && (
      <text
        x={x + width / 2}
        y={y + 48}
        textAnchor="middle"
        fontSize={12}
        fill="currentColor"
        opacity={0.75}
      >
        {subtitle}
      </text>
    )}
  </g>
);

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Arrow = ({ x1, y1, x2, y2 }: ArrowProps) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="currentColor"
    strokeWidth={1.5}
    markerEnd="url(#deploy-arrow)"
  />
);

export const BlueGreenDeployDiagram = () => (
  <svg
    viewBox="0 0 760 275"
    role="img"
    aria-label="GitLab CI/CD에서 Docker 이미지와 Nginx blue/green 전환으로 이어지는 배포 파이프라인 도식"
    className="w-full min-w-[640px] h-auto text-foreground"
  >
    <defs>
      <marker
        id="deploy-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>

    <Node
      x={10}
      y={93}
      width={150}
      title="GitLab CI/CD"
      subtitle="빌드 · 배포"
    />
    <Node
      x={210}
      y={93}
      width={150}
      title="Docker 이미지"
      subtitle="개발 · 스테이징 · 운영"
    />
    <Node x={410} y={93} width={130} title="Nginx" highlighted />
    <Node x={600} y={30} width={150} title="blue" subtitle="운영 중인 버전" />
    <Node
      x={600}
      y={156}
      width={150}
      title="green"
      subtitle="새 버전"
      highlighted
    />

    <Arrow x1={160} y1={125} x2={208} y2={125} />
    <Arrow x1={360} y1={125} x2={408} y2={125} />
    <Arrow x1={540} y1={110} x2={598} y2={70} />
    <Arrow x1={540} y1={140} x2={598} y2={186} />

    <g fontSize={13} fill="currentColor">
      <text x={380} y={258} textAnchor="middle">
        새 버전이 헬스체크를 통과한 뒤에만 트래픽을 전환하고, 실패하면 기존
        버전을 유지
      </text>
    </g>
  </svg>
);
