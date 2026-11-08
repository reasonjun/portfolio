"use client";

import "@/components/iso/iso.css";
import * as React from "react";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { useInView, useLoop, useStillness } from "@/components/iso/react/live";
import { createLego, type Lego } from "./engine";
import {
  BASE_ART,
  BRICK_ART,
  HIT_FACE,
  hitOf,
  PLATE_FACE,
  shadowOf,
  WALL,
  WALL_FACE,
} from "./geometry";
import "./hero-lego.css";
import { BRICKS, CURSOR_HOME, type Kind, SLOTS, SWAP_ORDER } from "./model";
import {
  BEZEL,
  brickAt,
  CHROME,
  cursorAt,
  HEIGHT,
  onFace,
  PITCH,
  PULL,
  shrunk,
  VW,
  WALL_R,
  WIDTH,
  WIN_H,
} from "./view";

// 브라우저 창과 레고 블록. 같은 크기의 블록끼리 갈아 끼울 수 있고, 갈아 끼워도 나머지 블록은 움직이지 않는다.
// 사용자가 한 번 만지면 자동 시연은 멈춘다.
// 보조 기술에는 짧은 이름을 가진 버튼 하나로 알리고, 그림과 조작법은 숨긴 글을 aria-describedby로 읽어 준다.
// 모션을 줄이는 설정에서는 멈춘 그림에서 결과만 바로 바뀐다.

const NAME = "블록 갈아 끼우기 시연";
const HELP = `브라우저 창에 레고 블록으로 만든 웹 페이지가 끼워져 있습니다. 같은 크기의 블록끼리 갈아 끼울 수 있고, 갈아 끼워도 나머지 블록은 움직이지 않습니다. 큰 칸, 카드 칸 두 개, 작은 칸, 아래 줄 빈 칸을 누르거나 숫자 1부터 ${SWAP_ORDER.length}를 누르면 그 자리의 블록이 바뀝니다. Enter는 자리를 차례로 바꿉니다. 한 번 조작하면 자동 시연은 멈춥니다.`;

// 양 끝이 둥근 막대. 블록에 인쇄된 글자 줄과 버튼은 대부분 이 모양이다.
const Pill = ({
  c,
  x,
  y,
  w,
  h,
}: {
  c: string;
  x: number;
  y: number;
  w: number;
  h: number;
}) => <rect className={c} x={x} y={y} width={w} height={h} rx={h / 2} />;

// ───────── 블록 앞면에 인쇄된 화면 (지역 좌표는 앞면의 왼쪽 위가 원점) ─────────
const PRINTS: Record<Kind, React.ReactNode> = {
  logo: (
    <>
      <circle className="gx-w" cx={8} cy={5} r={3.4} />
      <circle className="gx-ink" cx={8} cy={5} r={1.3} />
    </>
  ),
  menu: (
    <>
      <Pill c="gx-ink" x={5} y={3.8} w={8} h={2.4} />
      <Pill c="gx-dim" x={16} y={3.8} w={10} h={2.4} />
      <Pill c="gx-dim" x={29} y={3.8} w={7} h={2.4} />
    </>
  ),
  actions: (
    <>
      <circle className="gx-dim" cx={7} cy={5} r={2} />
      <circle className="gx-dim" cx={13.5} cy={5} r={2} />
      <circle className="gx-blue" cx={20} cy={5} r={2.6} />
      <Pill c="gx-ink" x={25} y={2.8} w={11.5} h={4.4} />
      <Pill c="gx-w" x={27.6} y={4.4} w={6.3} h={1.2} />
    </>
  ),
  hero: (
    <>
      <rect className="gx-blue" x={3} y={3} width={19} height={18} rx={2} />
      <circle className="gx-w" cx={9} cy={8.4} r={2.1} />
      <path className="gx-w" d="M5 20L11 13.4L15 18L18 14.8L20 18.4V20Z" />
      <Pill c="gx-ink" x={27} y={4.4} w={17} h={3.6} />
      <Pill c="gx-dim" x={27} y={10.4} w={17} h={2} />
      <Pill c="gx-dim" x={27} y={14} w={11} h={2} />
      <Pill c="gx-ink" x={27} y={17.4} w={12} h={3.6} />
      <Pill c="gx-w" x={29.5} y={18.9} w={7} h={1.1} />
    </>
  ),
  table: (
    <>
      <rect className="gx-ink" x={4} y={3.4} width={40} height={3.6} rx={1} />
      {[6.5, 19.5, 34].map((x) => (
        <Pill key={x} c="gx-w" x={x} y={4.6} w={7} h={1.2} />
      ))}
      {[9.4, 13.4, 17.4].map((y) => (
        <React.Fragment key={y}>
          <Pill c="gx-dim" x={6.5} y={y} w={9} h={1.8} />
          <Pill c="gx-dim" x={19.5} y={y} w={11} h={1.8} />
          <Pill c="gx-blue" x={34} y={y} w={7} h={1.8} />
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
      <Pill c="gx-ink" x={4} y={16} w={16} h={2.4} />
      <Pill c="gx-dim" x={4} y={20} w={11} h={1.8} />
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
      <Pill c="gx-ink" x={5} y={19.4} w={7} h={1.8} />
      <Pill c="gx-dim" x={14} y={19.4} w={5} h={1.8} />
    </>
  ),
  input: (
    <>
      <Pill c="gx-soft" x={3} y={2} w={34} h={8} />
      <Pill c="gx-w" x={3.8} y={2.8} w={32.4} h={6.4} />
      <Pill c="gx-ink" x={8} y={5.1} w={14} h={1.8} />
      <rect className="gx-caret" x={23.8} y={4.2} width={1} height={3.6} />
    </>
  ),
  button: (
    <>
      <Pill c="gx-w" x={3.5} y={5} w={7} h={2} />
      <circle className="gx-w" cx={12.2} cy={6} r={1.3} />
    </>
  ),
  toggle: (
    <>
      <Pill c="gx-w" x={3} y={2.8} w={10} h={6.4} />
      <circle className="gx-green" cx={9.9} cy={6} r={2.3} />
    </>
  ),
  tabs: (
    <>
      <Pill c="gx-ink" x={5} y={3.4} w={8} h={2.2} />
      <Pill c="gx-dim" x={17} y={3.4} w={8} h={2.2} />
      <Pill c="gx-dim" x={29} y={3.4} w={7} h={2.2} />
      <rect className="gx-soft" x={3} y={8.6} width={34} height={0.8} />
      <rect className="gx-ink" x={3} y={8.1} width={12} height={1.5} rx={0.7} />
    </>
  ),
};

// ───────── 바닥 판 ─────────
const BASE_PART = (
  <g>
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 배열이다.
      <g key={index}>
        <Solid paths={parts[0]} tone="lo" crease="faint" />
        <Solid paths={parts[1]} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid
      paths={BASE_ART.slab}
      tone="mid"
      crease="faint"
      className="lg-base"
    />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.slot} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <g transform={PLATE_FACE}>
      <rect className="lg-plate" width={38} height={4.4} rx={0.8} />
      <circle className="lg-plate-screw" cx={2.2} cy={2.2} r={0.7} />
      <circle className="lg-plate-screw" cx={35.8} cy={2.2} r={0.7} />
      <rect className="lg-plate-rule" x={6} y={1.2} width={24} height={0.6} />
      <rect className="lg-plate-rule" x={6} y={2.6} width={16} height={0.6} />
    </g>
  </g>
);

// ───────── 브라우저 창 ─────────
const HIDDEN = { opacity: 0 } as const;

const WINDOW_PART = (
  <g>
    <Solid paths={WALL} tone="mid" crease="faint" />
    <g transform={WALL_FACE}>
      <rect
        className="ch-view"
        x={BEZEL}
        y={CHROME}
        width={VW - BEZEL * 2}
        height={WIN_H - CHROME - BEZEL}
      />
      {/* 규격 홈: 블록을 뽑으면 드러난다. 스터드와 같은 간격의 핀이 "같은 규격이면 끼워진다"를 보여 준다. */}
      {SWAP_ORDER.map((id) => {
        const slot = SLOTS[id];
        return (
          <g key={id} transform={onFace(slot.x, slot.top)}>
            <rect
              className="lg-slot"
              x={0.6}
              y={0.6}
              width={slot.w - 1.2}
              height={slot.h - 1.2}
              rx={1.4}
            />
            {Array.from({ length: Math.round(slot.w / PITCH) }, (_, k) => (
              <circle
                // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 배열이다.
                key={k}
                className="lg-pin"
                cx={PITCH / 2 + k * PITCH}
                cy={slot.h / 2}
                r={1.1}
              />
            ))}
          </g>
        );
      })}
      {/* 블록 그림자: 창 앞면에 퍼져, 블록과 창 사이의 명도 차를 키운다. 엔진이 블록을 따라 옮긴다. */}
      {BRICKS.map((brick, id) => {
        const home = SLOTS[brick.home];
        const { wide, near } = shadowOf(brick.w, brick.h);
        return (
          <g
            key={brick.kind}
            data-shadow={id}
            transform={onFace(home.x, home.top)}
            style={brick.spare ? HIDDEN : undefined}
          >
            <rect
              className="lg-shadow-a"
              x={wide.x}
              y={wide.y}
              width={wide.w}
              height={wide.h}
              rx={3}
            />
            <rect
              className="lg-shadow-b"
              x={near.x}
              y={near.y}
              width={near.w}
              height={near.h}
              rx={2}
            />
          </g>
        );
      })}
      <rect
        className="ch-bar"
        x={WALL_R}
        y={0}
        width={VW - WALL_R * 2}
        height={CHROME}
      />
      <Line d={`M${WALL_R} ${CHROME}H${VW - WALL_R}`} tone="lo" />
      <circle className="ch-d1" cx={6} cy={7} r={2.1} />
      <circle className="ch-d2" cx={12.4} cy={7} r={2.1} />
      <circle className="ch-d3" cx={18.8} cy={7} r={2.1} />
      <rect
        className="ch-pill"
        x={28}
        y={3.2}
        width={VW - 36}
        height={7.6}
        rx={3.8}
      />
      <circle className="gx-dim" cx={33} cy={7} r={1.3} />
      <rect
        className="gx-dim"
        x={37}
        y={6.2}
        width={16}
        height={1.6}
        rx={0.8}
      />
    </g>
  </g>
);

// ───────── 레고 블록 ─────────
const BRICK_PARTS = BRICKS.map((brick, id) => {
  const art = BRICK_ART[id];
  const home = SLOTS[brick.home];
  return (
    <g
      key={brick.kind}
      data-brick={id}
      className={`bt-${brick.tint}`}
      transform={
        brick.spare
          ? shrunk(brickAt(home.x, home.top, brick.h, PULL), art.center, 0)
          : brickAt(home.x, home.top, brick.h)
      }
    >
      <Solid
        paths={art.body}
        tone="mid"
        crease="faint"
        inner={<Line d={art.seams} tone="faint" />}
      />
      {art.studs.map((stud, k) => (
        <Solid
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 배열이다.
          key={k}
          paths={stud}
          tone="mid"
          crease="faint"
        />
      ))}
      <g transform={art.face}>{PRINTS[brick.kind]}</g>
    </g>
  );
});

// 커서는 화면 기준으로 똑바로 그린다. 지역 좌표의 원점은 커서의 끝이다.
const CURSOR_SIZE = 2.7;

const CURSOR_PART = (
  <g data-cursor>
    <g data-cursor-tip transform={cursorAt(CURSOR_HOME.x, CURSOR_HOME.top)}>
      <g transform={`scale(${CURSOR_SIZE})`}>
        {/* 블록을 누를 때 나타나는 고리 */}
        <circle className="lg-ring" r={6} />
        <g className="lg-pointer">
          <path
            className="gx-cursor"
            d="M0 0V10.5L2.8 8L5 13L7.2 12L5 7.2H8.8Z"
          />
        </g>
      </g>
    </g>
  </g>
);

const SCENE = (
  <svg
    className="iso-svg"
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    aria-hidden="true"
    focusable="false"
  >
    {BASE_PART}
    {WINDOW_PART}
    <g data-bricks>{BRICK_PARTS}</g>
    {CURSOR_PART}
    <g transform={HIT_FACE}>
      {SWAP_ORDER.map((id) => (
        <rect
          key={id}
          className="lg-hit"
          data-slot={id}
          rx={2}
          {...hitOf(SLOTS[id])}
        />
      ))}
    </g>
  </svg>
);

export const HeroLego = () => {
  const root = React.useRef<HTMLButtonElement>(null);
  const lego = React.useRef<Lego | null>(null);
  const helpId = React.useId();
  const inView = useInView(root);
  const calm = useStillness();

  React.useEffect(() => {
    if (!root.current) return;
    lego.current = createLego(root.current);
    return () => {
      lego.current = null;
    };
  }, []);

  const kick = useLoop(
    (dt, still) => lego.current?.tick(dt, still) ?? false,
    inView && !calm,
  );

  // 모션 줄이기가 켜지면 루프가 멈추므로, 움직이던 블록을 한 번에 제자리로 보낸다.
  React.useEffect(() => {
    if (calm) kick();
  }, [calm, kick]);

  // 시연이 끝나고 블록이 모두 멈추면 루프도 쉰다. 입력이 오면 다시 깨운다.
  const run = (action: (engine: Lego) => void) => {
    if (!lego.current) return;
    action(lego.current);
    kick();
  };

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const slot = (event.target as Element).closest<SVGElement>("[data-slot]")
      ?.dataset.slot;
    if (slot !== undefined) run((engine) => engine.swap(Number(slot)));
    // 키보드의 Enter와 Space는 대상이 없는 클릭으로 온다.
    else if (event.detail === 0) run((engine) => engine.cycle());
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Cmd/Ctrl/Alt와 함께 누른 키는 브라우저 단축키(탭 전환 등)이므로 가로채지 않는다.
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const digit = Number(event.key);
    if (Number.isInteger(digit) && digit >= 1 && digit <= SWAP_ORDER.length) {
      event.preventDefault();
      run((engine) => engine.swap(SWAP_ORDER[digit - 1]));
    }
  };

  return (
    <>
      <button
        ref={root}
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label={NAME}
        aria-describedby={helpId}
        className="hero-lego iso"
      >
        {SCENE}
      </button>
      {/* hidden이어도 aria-describedby는 이 글을 설명으로 읽는다. 따로 읽히지 않아 두 번 낭독되지 않는다. */}
      <span id={helpId} hidden>
        {HELP}
      </span>
    </>
  );
};
