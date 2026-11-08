import {
  corners,
  cylinder,
  haloOf,
  insetPlan,
  iso,
  joinPaths,
  type Plan,
  planOutline,
  ring,
  segment,
  slabOf,
} from "@/components/iso/iso-kit";
import { BRICKS, SLOTS, type Slot } from "./model";
import {
  BASE,
  BASE_H,
  BEZEL,
  BRICK_D,
  CHROME,
  FOOT_H,
  faceAt,
  P,
  PITCH,
  STUD_H,
  STUD_R,
  VW,
  WALL_R,
  WALL_T,
  WIN_H,
  WIN_X0,
} from "./view";

const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) =>
  slabOf(plan, z, h, P, steps, bevel);
const cyl = (
  cx: number,
  cy: number,
  r: number,
  z: number,
  h: number,
  steps = 28,
) => cylinder(cx, cy, r, z, h, P, steps);

// ───────── 창 ─────────
export const WALL = slabOf(
  { x: WIN_X0, y: -WALL_T, w: VW, d: WALL_T, r: WALL_R },
  0,
  WIN_H,
  P,
  3,
  0.6,
);
export const WALL_FACE = faceAt(WIN_X0, 0, WIN_H);

// ───────── 바닥 판 ─────────
const FEET = corners(BASE, 10);
const SCREWS = corners(BASE, 8);
const SLOT: Plan = {
  x: WIN_X0 - 3,
  y: -WALL_T - 3,
  w: VW + 6,
  d: WALL_T + 6,
  r: 2,
};

export const BASE_ART = {
  halo: haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P),
  feet: FEET.map(([x, y]) => [
    cyl(x, y, 7, -BASE_H - FOOT_H, 1.6),
    cyl(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6),
  ]),
  slab: solid(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P),
  slot: planOutline(SLOT, 0, P, 3),
  screwRings: joinPaths(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: SCREWS.map(([x, y]) => iso([x, y, 0], P)),
};

// 이름판은 윗면을 비워 두려고 바닥 판의 앞쪽 옆면에 붙인다. 지역 좌표의 원점은 이름판의 왼쪽 위다.
export const PLATE_FACE = faceAt(BASE.x + 16, BASE.y + BASE.d, -2);

// ───────── 레고 블록 ─────────
const SEAM_STEP = 8;

export const BRICK_ART = BRICKS.map((brick) => {
  const plan: Plan = { x: 0, y: 0, w: brick.w, d: BRICK_D, r: 1 };
  const count = Math.round(brick.w / PITCH);
  const seams = joinPaths(
    Array.from({ length: Math.floor((brick.h - 1) / SEAM_STEP) }, (_, k) =>
      segment(
        [brick.w, 0, (k + 1) * SEAM_STEP],
        [brick.w, BRICK_D, (k + 1) * SEAM_STEP],
        P,
      ),
    ),
  );
  return {
    body: solid(plan, 0, brick.h, 3, 0.5),
    seams,
    studs: Array.from({ length: count }, (_, k) =>
      cyl(PITCH / 2 + k * PITCH, BRICK_D / 2, STUD_R, brick.h, STUD_H, 14),
    ),
    // 앞면에 인쇄된 화면. 지역 좌표의 원점은 앞면의 왼쪽 위다.
    face: faceAt(0, BRICK_D, brick.h),
    center: iso([brick.w / 2, BRICK_D / 2, brick.h / 2], P),
  };
});

// 블록이 창 앞면에 드리우는 그림자. 블록의 왼쪽 위를 원점으로 오른쪽 아래로 퍼지고, 엔진은 그룹째로 옮긴다.
// 필터 없이 크기가 다른 두 겹의 사각형으로 가장자리를 부드럽게 만든다.
export const shadowOf = (w: number, h: number) => ({
  wide: { x: 0.6, y: 1.4, w: w + 4.2, h: h + 4.2 },
  near: { x: 1.4, y: 2.2, w: w + 1.6, h: h + 1.6 },
});

// 누름 영역은 칸마다 블록 앞면 평면의 사각형 하나다. 블록의 윗면과 옆면은 앞면의 위쪽과 오른쪽에 보이므로,
// 칸 사이 간격을 그쪽으로 모두 넓힌다. 이웃 칸과는 겹치지 않고, 맨 아랫줄은 아래에 이웃이 없으니 터치용으로 더 넓힌다.
export const HIT_FACE = faceAt(WIN_X0, BRICK_D, WIN_H);
const HIT_RIGHT = 4; // 칸 사이 간격
const HIT_UP = 6; // 줄 사이 간격
const HIT_BELOW = 10;
const LAST_ROW = Math.max(...SLOTS.map((slot) => slot.top));

export const hitOf = (slot: Slot) => ({
  x: BEZEL + slot.x,
  y: CHROME + slot.top - HIT_UP,
  width: slot.w + HIT_RIGHT,
  height: slot.h + HIT_UP + (slot.top === LAST_ROW ? HIT_BELOW : 0),
});
