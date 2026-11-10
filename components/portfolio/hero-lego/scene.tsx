import { Dots, Line, Solid } from "@/components/iso/react/draw";
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
import { BRICKS, CURSOR_HOME, SLOTS, SWAP_ORDER } from "./model";
import { PRINTS } from "./prints";
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

// 엔진(engine.ts)이 data-bricks, data-brick, data-shadow, data-cursor-tip으로 이 마크업을 찾는다. 이름을 바꾸면 함께 바꾼다.
// 클릭 대상은 data-slot이고 hero-lego.tsx의 onClick이 읽는다.

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

export const SCENE = (
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
