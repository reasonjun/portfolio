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
  BASE_HEIGHT,
  BRICK_DEPTH,
  FOOT_HEIGHT,
  FRAME_WIDTH,
  faceAt,
  PROJECTION,
  STUD_HEIGHT,
  STUD_PITCH,
  STUD_RADIUS,
  TITLE_BAR_HEIGHT,
  WALL_RADIUS,
  WALL_THICKNESS,
  WINDOW_HEIGHT,
  WINDOW_LEFT,
  WINDOW_WIDTH,
} from "./view";

const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) =>
  slabOf(plan, z, h, PROJECTION, steps, bevel);
const cyl = (
  cx: number,
  cy: number,
  r: number,
  z: number,
  h: number,
  steps = 28,
) => cylinder(cx, cy, r, z, h, PROJECTION, steps);

export const WALL = slabOf(
  {
    x: WINDOW_LEFT,
    y: -WALL_THICKNESS,
    w: WINDOW_WIDTH,
    d: WALL_THICKNESS,
    r: WALL_RADIUS,
  },
  0,
  WINDOW_HEIGHT,
  PROJECTION,
  3,
  0.6,
);
export const WALL_FACE = faceAt(WINDOW_LEFT, 0, WINDOW_HEIGHT);

const FEET = corners(BASE, 10);
const SCREWS = corners(BASE, 8);
const SLOT: Plan = {
  x: WINDOW_LEFT - 3,
  y: -WALL_THICKNESS - 3,
  w: WINDOW_WIDTH + 6,
  d: WALL_THICKNESS + 6,
  r: 2,
};

export const BASE_ART = {
  halo: haloOf(BASE, -BASE_HEIGHT - FOOT_HEIGHT, BASE_HEIGHT, PROJECTION),
  feet: FEET.map(([x, y]) => [
    cyl(x, y, 7, -BASE_HEIGHT - FOOT_HEIGHT, 1.6),
    cyl(x, y, 5.4, -BASE_HEIGHT - FOOT_HEIGHT + 1.6, FOOT_HEIGHT - 1.6),
  ]),
  slab: solid(BASE, -BASE_HEIGHT, BASE_HEIGHT, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, PROJECTION),
  slot: planOutline(SLOT, 0, PROJECTION, 3),
  screwRings: joinPaths(
    SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, PROJECTION, 16)),
  ),
  screws: SCREWS.map(([x, y]) => iso([x, y, 0], PROJECTION)),
};

// 이름판은 윗면을 비워 두려고 바닥 판의 앞쪽 옆면에 붙인다. 지역 좌표의 원점은 이름판의 왼쪽 위다.
export const PLATE_FACE = faceAt(BASE.x + 16, BASE.y + BASE.d, -2);

const SEAM_STEP = 8;

export const BRICK_ART = BRICKS.map((brick) => {
  const plan: Plan = { x: 0, y: 0, w: brick.w, d: BRICK_DEPTH, r: 1 };
  const count = Math.round(brick.w / STUD_PITCH);
  const seams = joinPaths(
    Array.from({ length: Math.floor((brick.h - 1) / SEAM_STEP) }, (_, k) =>
      segment(
        [brick.w, 0, (k + 1) * SEAM_STEP],
        [brick.w, BRICK_DEPTH, (k + 1) * SEAM_STEP],
        PROJECTION,
      ),
    ),
  );
  return {
    body: solid(plan, 0, brick.h, 3, 0.5),
    seams,
    studs: Array.from({ length: count }, (_, k) =>
      cyl(
        STUD_PITCH / 2 + k * STUD_PITCH,
        BRICK_DEPTH / 2,
        STUD_RADIUS,
        brick.h,
        STUD_HEIGHT,
        14,
      ),
    ),
    face: faceAt(0, BRICK_DEPTH, brick.h),
    center: iso([brick.w / 2, BRICK_DEPTH / 2, brick.h / 2], PROJECTION),
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
export const HIT_FACE = faceAt(WINDOW_LEFT, BRICK_DEPTH, WINDOW_HEIGHT);
const HIT_RIGHT = 4; // 칸 사이 간격
const HIT_UP = 6; // 줄 사이 간격
const HIT_BELOW = 10;
const LAST_ROW = Math.max(...SLOTS.map((slot) => slot.top));

export const hitOf = (slot: Slot) => ({
  x: FRAME_WIDTH + slot.x,
  y: TITLE_BAR_HEIGHT + slot.top - HIT_UP,
  width: slot.w + HIT_RIGHT,
  height: slot.h + HIT_UP + (slot.top === LAST_ROW ? HIT_BELOW : 0),
});
