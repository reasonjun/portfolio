const BOX_Y = 70;
const BOX_HEIGHT = 80;
const BOX_WIDTH = 170;

interface NodeProps {
  x: number;
  title: string;
  subtitle?: string;
  highlighted?: boolean;
}

const Node = ({ x, title, subtitle, highlighted = false }: NodeProps) => (
  <g>
    <rect
      x={x}
      y={BOX_Y}
      width={BOX_WIDTH}
      height={BOX_HEIGHT}
      rx={10}
      fill={highlighted ? "var(--muted)" : "none"}
      stroke="currentColor"
      strokeWidth={highlighted ? 2.5 : 1.5}
    />
    <text
      x={x + BOX_WIDTH / 2}
      y={subtitle ? BOX_Y + 36 : BOX_Y + 46}
      textAnchor="middle"
      fontSize={17}
      fontWeight={600}
      fill="currentColor"
    >
      {title}
    </text>
    {subtitle && (
      <text
        x={x + BOX_WIDTH / 2}
        y={BOX_Y + 58}
        textAnchor="middle"
        fontSize={13}
        fill="currentColor"
        opacity={0.75}
      >
        {subtitle}
      </text>
    )}
  </g>
);

interface LinkProps {
  fromX: number;
  toX: number;
  label: string;
}

const Link = ({ fromX, toX, label }: LinkProps) => {
  const y = BOX_Y + BOX_HEIGHT / 2;
  return (
    <g>
      <line
        x1={fromX}
        y1={y}
        x2={toX}
        y2={y}
        stroke="currentColor"
        strokeWidth={1.5}
        markerStart="url(#bff-arrow)"
        markerEnd="url(#bff-arrow)"
      />
      <text
        x={(fromX + toX) / 2}
        y={y - 12}
        textAnchor="middle"
        fontSize={13}
        fill="currentColor"
      >
        {label}
      </text>
    </g>
  );
};

export const BffAuthFlowDiagram = () => (
  <svg
    viewBox="0 0 720 230"
    role="img"
    aria-label="브라우저, BFF, API 서버 사이의 인증 흐름 도식"
    className="w-full min-w-[640px] h-auto text-foreground"
  >
    <defs>
      <marker
        id="bff-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>

    <Node x={20} title="브라우저" subtitle="토큰에 접근할 수 없음" />
    <Node
      x={275}
      title="BFF 서버"
      subtitle="쿠키를 열어 토큰을 중계"
      highlighted
    />
    <Node x={530} title="API 서버" />

    <Link fromX={190} toX={275} label="암호화 쿠키" />
    <Link fromX={445} toX={530} label="JWT 토큰" />

    <g fontSize={13} fill="currentColor">
      <text x={360} y={182} textAnchor="middle">
        · 액세스·리프레시 토큰을 암호화 쿠키로 봉인
      </text>
      <text x={360} y={204} textAnchor="middle">
        · 동시에 들어온 중복 refresh 요청을 한 번으로 합침
      </text>
    </g>
  </svg>
);
