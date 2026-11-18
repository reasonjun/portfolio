import {
  boxCorners,
  type Flat,
  fitProjection,
  iso,
  type Plan,
  type Point3,
  sideMatrix,
  translateAlong,
} from "@/components/iso/iso-kit";
import { VIEW_HEIGHT } from "./model";

// 브라우저 창과 레고 블록의 월드 배치. 단위는 실제 크기의 약 1px, x는 오른쪽, y는 앞쪽, z는 위쪽이다.
// 창은 바닥 판 위에 세워져 있고, 앞면(y = 0)에 블록이 끼워진다. 블록은 앞으로 BRICK_DEPTH만큼 튀어나온다.

export const WIDTH = 540;
export const HEIGHT = 520;
const AZIMUTH = 50;
const ELEVATION = 30;

// 바닥 판은 창을 받칠 만큼만 벽 앞으로 나온다. 앞쪽 윗면이 넓으면 뜻 없는 면에 시선이 간다.
export const BASE: Plan = { x: -80, y: -14, w: 146, d: 28, r: 8 };
export const BASE_HEIGHT = 8;
export const FOOT_HEIGHT = 5;

export const WINDOW_LEFT = -62;
export const WALL_THICKNESS = 6;
export const WALL_RADIUS = 2; // 앞면에 붙는 그림은 이만큼 안쪽에서 시작해야 벽 밖으로 나가지 않는다.
export const WINDOW_WIDTH = 114;
export const TITLE_BAR_HEIGHT = 14;
export const FRAME_WIDTH = 2;
const BOTTOM_FRAME_HEIGHT = 3;
export const WINDOW_HEIGHT =
  TITLE_BAR_HEIGHT + VIEW_HEIGHT + BOTTOM_FRAME_HEIGHT;

export const BRICK_DEPTH = 6; // 깊으면 아랫줄 스터드가 윗줄을 가린다.
export const STUD_PITCH = 8;
export const STUD_RADIUS = 2.4;
export const STUD_HEIGHT = 2;
export const PULL_DISTANCE = 16;
const CURSOR_Y = BRICK_DEPTH + 3;

// 카메라는 바닥 판 전체(발까지)와 창을 한 장면에 맞춘다. 아무것도 패널 밖으로 잘리지 않는다.
const FIT: Point3[] = [
  ...boxCorners(BASE, -BASE_HEIGHT - FOOT_HEIGHT, 0),
  ...boxCorners(
    {
      x: WINDOW_LEFT,
      y: -WALL_THICKNESS,
      w: WINDOW_WIDTH,
      d: WALL_THICKNESS,
      r: 0,
    },
    0,
    WINDOW_HEIGHT,
  ),
];

export const PROJECTION = fitProjection(FIT, WIDTH, HEIGHT, {
  pad: 8,
  headroom: 14,
  azimuth: AZIMUTH,
  elevation: ELEVATION,
});

// 블록 그룹의 위치. x, top은 뷰포트 안쪽 기준이고 forward는 벽에서 앞으로 나온 거리다.
export const brickAt = (x: number, top: number, h: number, forward = 0) =>
  translateAlong(PROJECTION, [
    WINDOW_LEFT + FRAME_WIDTH + x,
    forward,
    WINDOW_HEIGHT - TITLE_BAR_HEIGHT - top - h,
  ]);

// 블록을 자기 가운데(center)를 중심으로 줄인다. 크기가 0이면 그려지지 않는다.
export const shrunk = (at: string, [cx, cy]: Flat, scale: number) =>
  scale === 1
    ? at
    : `${at} translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${scale.toFixed(3)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`;

// 커서의 화면 위치. 커서는 창 면에 붙은 그림이 아니라서 화면 기준으로 똑바로 그린다.
export const cursorAt = (x: number, top: number) => {
  const [u, v] = iso(
    [
      WINDOW_LEFT + FRAME_WIDTH + x,
      CURSOR_Y,
      WINDOW_HEIGHT - TITLE_BAR_HEIGHT - top,
    ],
    PROJECTION,
  );
  return `translate(${u.toFixed(2)} ${v.toFixed(2)})`;
};

export const onFace = (x: number, top: number) =>
  `translate(${(FRAME_WIDTH + x).toFixed(2)} ${(TITLE_BAR_HEIGHT + top).toFixed(2)})`;

// 앞을 보는 수직면에 평평한 그림을 붙이는 행렬. 지역 좌표 (u, v)는 오른쪽, 아래쪽이다.
export const faceAt = (x: number, y: number, zTop: number) =>
  sideMatrix([x, y], zTop, PROJECTION, "left");
