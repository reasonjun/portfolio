// 레고 블록 페이지의 모델. 창은 크기가 고정되어 있고, 같은 크기의 블록끼리만 갈아 끼운다.
// 그림의 움직임이 모두 여기서 나온다. 한 자리를 바꿔도 다른 블록의 자리는 변하지 않는다.

type Tint = "paper" | "blue" | "ink" | "green";
export type Kind =
  | "logo"
  | "menu"
  | "actions"
  | "hero"
  | "table"
  | "profile"
  | "chart"
  | "donut"
  | "input"
  | "button"
  | "toggle"
  | "tabs";

// 같은 묶음의 블록은 크기가 같아서 서로의 자리에 끼워진다. null은 갈아 끼우지 않는 고정 부품이다.
type Family = "large" | "card" | "small" | "extra";

export interface Slot {
  x: number; // 뷰포트 안쪽 왼쪽에서
  top: number; // 뷰포트 안쪽 위에서
  w: number;
  h: number;
  family: Family | null;
}

interface Brick {
  kind: Kind;
  w: number;
  h: number;
  tint: Tint;
  family: Family | null;
  home: number; // 처음 놓이는 자리. 여분 블록은 처음 들어갈 자리다.
  spare: boolean; // 처음에는 창 밖에 있다
}

export const OUT = -1; // 어느 자리에도 끼워져 있지 않은 블록

export const VIEW_HEIGHT = 66; // 뷰포트 안쪽 높이

export const LARGE = 3;
export const CARD_A = 4;
export const CARD_B = 5;
export const SMALL = 7;
export const EXTRA = 8;

// 자리는 뒤에서 앞으로 그리는 순서다. 윗줄부터, 왼쪽부터 놓인다. 모든 줄이 같은 오른쪽 끝(109)에서 끝난다.
// 줄 간격(6)은 아랫줄 스터드가 윗줄 블록을 가리지 않는 값이다.
export const SLOTS: readonly Slot[] = [
  { x: 5, top: 4, w: 16, h: 10, family: null },
  { x: 25, top: 4, w: 40, h: 10, family: null },
  { x: 69, top: 4, w: 40, h: 10, family: null },
  { x: 5, top: 20, w: 48, h: 24, family: "large" },
  { x: 57, top: 20, w: 24, h: 24, family: "card" },
  { x: 85, top: 20, w: 24, h: 24, family: "card" },
  { x: 5, top: 50, w: 40, h: 12, family: null },
  { x: 49, top: 50, w: 16, h: 12, family: "small" },
  { x: 69, top: 50, w: 40, h: 12, family: "extra" },
];

// 숫자 키 1부터 차례로 고르는 자리. 화면을 읽는 순서다.
export const SWAP_ORDER = SLOTS.flatMap((slot, id) =>
  slot.family ? [id] : [],
);

// 크기와 묶음은 자리에서 가져온다. 그래서 블록은 자기 자리와 크기가 어긋날 수 없다.
const brick = (kind: Kind, tint: Tint, home: number, spare = false): Brick => {
  const { w, h, family } = SLOTS[home];
  return { kind, tint, w, h, family, home, spare };
};

export const BRICKS: readonly Brick[] = [
  brick("logo", "ink", 0),
  brick("menu", "paper", 1),
  brick("actions", "paper", 2),
  brick("hero", "blue", LARGE),
  brick("table", "blue", LARGE, true),
  brick("profile", "paper", CARD_A),
  brick("chart", "blue", CARD_B),
  brick("donut", "paper", CARD_A, true),
  brick("input", "paper", 6),
  brick("button", "green", SMALL),
  brick("toggle", "green", SMALL, true),
  brick("tabs", "paper", EXTRA, true),
];

// 블록마다 끼워진 자리. 끼워져 있지 않으면 OUT이다.
export const REST: readonly number[] = BRICKS.map((brick) =>
  brick.spare ? OUT : brick.home,
);

// 한 자리를 같은 묶음의 다음 여분 블록으로 바꾼다. 여분이 없으면 그 자리를 비운다(빈 칸의 탭 블록).
export function swapAt(map: readonly number[], slot: number): number[] {
  const next = [...map];
  const family = SLOTS[slot]?.family ?? null;
  if (family === null) return next;
  const members = BRICKS.flatMap((brick, id) =>
    brick.family === family ? [id] : [],
  );
  const current = next.indexOf(slot);
  const from = members.indexOf(current);
  for (let step = 1; step <= members.length; step += 1) {
    const candidate = members[(from + step) % members.length];
    if (next[candidate] !== OUT) continue;
    if (current !== -1) next[current] = OUT;
    next[candidate] = slot;
    return next;
  }
  if (current !== -1) next[current] = OUT;
  return next;
}

// 블록을 뽑는 동작의 모양. away는 0(끼워짐)에서 1(사라짐)까지 간다.
// 불투명한 채로 앞으로 당겨 나온 뒤 그 자리에서 작아져 사라지고, 들어올 때는 거꾸로 움직인다.
const PULLED_AT = 0.45;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function swapPose(away: number) {
  return {
    pull: smooth(Math.min(1, away / PULLED_AT)),
    scale: 1 - smooth(Math.max(0, (away - PULLED_AT) / (1 - PULLED_AT))),
  };
}

// ───────── 자동 시연 ─────────
// 큰 블록을 교체하고, 두 카드의 자리를 맞바꾸고, 빈 칸에 새 블록을 끼운 뒤 처음으로 돌아간다.
const idOf = (kind: Kind) => BRICKS.findIndex((brick) => brick.kind === kind);
const HERO = idOf("hero");
const TABLE = idOf("table");
const PROFILE = idOf("profile");
const CHART = idOf("chart");
const TABS = idOf("tabs");

interface Step {
  at: number; // 주기 안의 시각(초)
  change: readonly (readonly [brick: number, slot: number])[];
}

const STEPS: readonly Step[] = [
  {
    at: 2.0,
    change: [
      [HERO, OUT],
      [TABLE, LARGE],
    ],
  },
  {
    at: 4.8,
    change: [
      [PROFILE, CARD_B],
      [CHART, CARD_A],
    ],
  },
  { at: 7.6, change: [[TABS, EXTRA]] },
  { at: 10.2, change: [[TABS, OUT]] },
  {
    at: 10.6,
    change: [
      [PROFILE, CARD_A],
      [CHART, CARD_B],
    ],
  },
  {
    at: 11.0,
    change: [
      [TABLE, OUT],
      [HERO, LARGE],
    ],
  },
];

export const PERIOD = 12.6;

// 단계마다의 배치. 0번은 처음 상태이고 마지막은 다시 처음 상태라 이음매 없이 반복된다.
export const STATES: readonly (readonly number[])[] = STEPS.reduce<number[][]>(
  (states, step) => {
    const next = [...states[states.length - 1]];
    for (const [brick, slot] of step.change) next[brick] = slot;
    states.push(next);
    return states;
  },
  [[...REST]],
);

// 주기 안의 시각 t에 몇 번째 단계까지 지났는가
export function stepAt(t: number) {
  return STEPS.filter((step) => t >= step.at).length;
}

// 커서가 누르러 가는 동작. 맞바꿀 때는 블록을 따라 옆 자리로 옮겨 간다.
const ACTIONS = [
  { at: STEPS[0].at, from: LARGE, to: LARGE },
  { at: STEPS[1].at, from: CARD_A, to: CARD_B },
  { at: STEPS[2].at, from: EXTRA, to: EXTRA },
] as const;

const CURSOR_LEAD = 1.0;
const CURSOR_TAIL = 0.7;
const PRESS_LEAD = 0.2;
const PRESS_TAIL = 0.14;
const CARRY_TAIL = 0.5; // 맞바꾸는 동안은 블록을 잡고 있다

export const CURSOR_HOME = { x: 106, top: 63 };

const CENTERS = SLOTS.map((slot) => ({
  x: slot.x + slot.w / 2,
  top: slot.top + slot.h / 2,
}));

export function tourCursor(t: number) {
  const action = ACTIONS.find(
    ({ at }) => t >= at - CURSOR_LEAD && t <= at + CURSOR_TAIL,
  );
  if (!action) return CURSOR_HOME;
  return CENTERS[t < action.at ? action.from : action.to];
}

export function tourPress(t: number) {
  return ACTIONS.some(({ at, from, to }) => {
    const tail = from === to ? PRESS_TAIL : CARRY_TAIL;
    return t >= at - PRESS_LEAD && t <= at + tail;
  });
}
