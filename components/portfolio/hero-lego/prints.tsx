import * as React from "react";
import type { Kind } from "./model";

// 양 끝이 둥근 막대. 블록에 인쇄된 글자 줄과 버튼은 대부분 이 모양이다.
const Pill = ({
  className,
  x,
  y,
  w,
  h,
}: {
  className: string;
  x: number;
  y: number;
  w: number;
  h: number;
}) => (
  <rect className={className} x={x} y={y} width={w} height={h} rx={h / 2} />
);

// 블록 앞면에 인쇄된 화면. 지역 좌표는 앞면의 왼쪽 위가 원점이다.
export const PRINTS: Record<Kind, React.ReactNode> = {
  logo: (
    <>
      <circle className="gx-w" cx={8} cy={5} r={3.4} />
      <circle className="gx-ink" cx={8} cy={5} r={1.3} />
    </>
  ),
  menu: (
    <>
      <Pill className="gx-ink" x={5} y={3.8} w={8} h={2.4} />
      <Pill className="gx-dim" x={16} y={3.8} w={10} h={2.4} />
      <Pill className="gx-dim" x={29} y={3.8} w={7} h={2.4} />
    </>
  ),
  actions: (
    <>
      <circle className="gx-dim" cx={7} cy={5} r={2} />
      <circle className="gx-dim" cx={13.5} cy={5} r={2} />
      <circle className="gx-blue" cx={20} cy={5} r={2.6} />
      <Pill className="gx-ink" x={25} y={2.8} w={11.5} h={4.4} />
      <Pill className="gx-w" x={27.6} y={4.4} w={6.3} h={1.2} />
    </>
  ),
  hero: (
    <>
      <rect className="gx-blue" x={3} y={3} width={19} height={18} rx={2} />
      <circle className="gx-w" cx={9} cy={8.4} r={2.1} />
      <path className="gx-w" d="M5 20L11 13.4L15 18L18 14.8L20 18.4V20Z" />
      <Pill className="gx-ink" x={27} y={4.4} w={17} h={3.6} />
      <Pill className="gx-dim" x={27} y={10.4} w={17} h={2} />
      <Pill className="gx-dim" x={27} y={14} w={11} h={2} />
      <Pill className="gx-ink" x={27} y={17.4} w={12} h={3.6} />
      <Pill className="gx-w" x={29.5} y={18.9} w={7} h={1.1} />
    </>
  ),
  table: (
    <>
      <rect className="gx-ink" x={4} y={3.4} width={40} height={3.6} rx={1} />
      {[6.5, 19.5, 34].map((x) => (
        <Pill key={x} className="gx-w" x={x} y={4.6} w={7} h={1.2} />
      ))}
      {[9.4, 13.4, 17.4].map((y) => (
        <React.Fragment key={y}>
          <Pill className="gx-dim" x={6.5} y={y} w={9} h={1.8} />
          <Pill className="gx-dim" x={19.5} y={y} w={11} h={1.8} />
          <Pill className="gx-blue" x={34} y={y} w={7} h={1.8} />
          <rect className="gx-soft" x={4} y={y + 2.8} width={40} height={0.5} />
        </React.Fragment>
      ))}
    </>
  ),
  profile: (
    <>
      <circle className="gx-blue" cx={12} cy={8.6} r={5} />
      <circle className="gx-w" cx={12} cy={7.3} r={1.7} />
      <path className="gx-w" d="M8.6 12.3A3.6 2.8 0 0 1 15.4 12.3Z" />
      <Pill className="gx-ink" x={4} y={16} w={16} h={2.4} />
      <Pill className="gx-dim" x={4} y={20} w={11} h={1.8} />
    </>
  ),
  chart: (
    <>
      <rect className="gx-soft" x={3} y={20.6} width={18} height={0.9} />
      {[7, 12, 9, 15].map((height, i) => (
        <rect
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 배열이다.
          key={i}
          className={i === 3 ? "gx-ink" : "gx-dim"}
          x={4 + i * 4.7}
          y={20.6 - height}
          width={3.3}
          height={height}
          rx={0.8}
        />
      ))}
    </>
  ),
  donut: (
    <>
      <circle className="gx-arc gx-arc-soft" cx={12} cy={10} r={5.6} />
      <circle
        className="gx-arc gx-arc-blue"
        cx={12}
        cy={10}
        r={5.6}
        pathLength={100}
        strokeDasharray="30 70"
        strokeDashoffset={-38}
        transform="rotate(-90 12 10)"
      />
      <circle
        className="gx-arc gx-arc-ink"
        cx={12}
        cy={10}
        r={5.6}
        pathLength={100}
        strokeDasharray="38 62"
        transform="rotate(-90 12 10)"
      />
      <Pill className="gx-ink" x={5} y={19.4} w={7} h={1.8} />
      <Pill className="gx-dim" x={14} y={19.4} w={5} h={1.8} />
    </>
  ),
  input: (
    <>
      <Pill className="gx-soft" x={3} y={2} w={34} h={8} />
      <Pill className="gx-w" x={3.8} y={2.8} w={32.4} h={6.4} />
      <Pill className="gx-ink" x={8} y={5.1} w={14} h={1.8} />
      <rect className="gx-caret" x={23.8} y={4.2} width={1} height={3.6} />
    </>
  ),
  button: (
    <>
      <Pill className="gx-w" x={3.5} y={5} w={7} h={2} />
      <circle className="gx-w" cx={12.2} cy={6} r={1.3} />
    </>
  ),
  toggle: (
    <>
      <Pill className="gx-w" x={3} y={2.8} w={10} h={6.4} />
      <circle className="gx-green" cx={9.9} cy={6} r={2.3} />
    </>
  ),
  tabs: (
    <>
      <Pill className="gx-ink" x={5} y={3.4} w={8} h={2.2} />
      <Pill className="gx-dim" x={17} y={3.4} w={8} h={2.2} />
      <Pill className="gx-dim" x={29} y={3.4} w={7} h={2.2} />
      <rect className="gx-soft" x={3} y={8.6} width={34} height={0.8} />
      <rect className="gx-ink" x={3} y={8.1} width={12} height={1.5} rx={0.7} />
    </>
  ),
};
