import { follow } from "@/components/iso/react/live";
import { BRICK_ART } from "./geometry";
import {
  BRICKS,
  CURSOR_HOME,
  OUT,
  PERIOD,
  REST,
  SLOTS,
  STATES,
  SWAP_ORDER,
  stepAt,
  swapAt,
  swapPose,
  tourCursor,
  tourPress,
} from "./model";
import { brickAt, cursorAt, onFace, PULL, shrunk } from "./view";

// 그림의 움직임을 맡는 엔진. React는 한 번 그리고, 이후 모든 변화는 속성 쓰기로만 일어난다.
// 블록을 갈아 끼울 때는 있던 블록이 앞으로 뽑혀 작아져 사라지고, 그다음 같은 크기의 다른 블록이 나타나 끼워진다.
// 블록은 언제나 불투명하다. 반투명한 고체는 물건처럼 보이지 않는다.

const OUT_TIME = 0.36; // 블록이 뽑혀 사라지는 시간(초). 이 시간이 지나야 새 블록이 들어온다.
const IN_TIME = 0.38; // 블록이 나타나 끼워지는 시간(초)
const SLIDE_TAU = 0.2; // 자리를 맞바꾸는 빠르기
const CURSOR_TAU = 0.16;
const LIFT = 9; // 자리를 옮기는 블록이 벽에서 떠오르는 높이

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

// 값이 그대로면 DOM을 건드리지 않는 쓰기 함수
const writer = (apply: (value: string) => void) => {
  let last = "";
  return (value: string) => {
    if (value === last) return;
    last = value;
    apply(value);
  };
};

export interface Lego {
  // 더 그릴 것이 있으면 true. calm이면 움직임 없이 결과만 바로 보여 준다.
  tick: (dt: number, calm: boolean) => boolean;
  // 사용자가 처음 블록을 바꾸면 자동 시연은 영구히 멈춘다(다시 불러오기 전까지).
  swap: (slot: number) => void;
  cycle: () => void;
}

export function createLego(root: HTMLElement): Lego {
  const one = (selector: string) => root.querySelector(selector) as SVGElement;

  const cursorTip = one("[data-cursor-tip]");
  const container = one("[data-bricks]");
  const map = [...REST]; // 블록마다 끼워진 자리

  const parts = BRICKS.map((brick, id) => {
    const node = one(`[data-brick="${id}"]`);
    const shadow = one(`[data-shadow="${id}"]`);
    const home = SLOTS[brick.home];
    return {
      node,
      h: brick.h,
      center: BRICK_ART[id].center,
      x: home.x,
      top: home.top,
      away: brick.spare ? 1 : 0, // 0 끼워짐, 1 사라짐
      wait: 0, // 들어올 차례를 기다리는 남은 시간(초)
      lift: 0,
      depth: 0, // 벽에서 앞으로 나온 거리. 그리는 순서를 정한다.
      place: writer((value) => node.setAttribute("transform", value)),
      shadowPlace: writer((value) => shadow.setAttribute("transform", value)),
      shadowFade: writer((value) => {
        shadow.style.opacity = value;
      }),
    };
  });
  type Part = (typeof parts)[number];

  let tour = 0;
  let step = 0;
  let stopped = false;
  let nextSwap = 0;

  const cursor = { ...CURSOR_HOME };
  const cursorPlace = writer((value) =>
    cursorTip.setAttribute("transform", value),
  );

  let pressing = false;
  const setPress = (on: boolean) => {
    if (on === pressing) return;
    pressing = on;
    root.toggleAttribute("data-press", on);
  };

  // 새 배치를 받는다. 다른 블록이 비우는 자리로 들어가는 블록은 그 블록이 빠질 시간을 기다린다.
  const commit = (next: readonly number[]) => {
    const taken = new Set(map);
    next.forEach((slot, id) => {
      if (map[id] === OUT && slot !== OUT) {
        parts[id].wait = taken.has(slot) ? OUT_TIME : 0;
      }
      map[id] = slot;
    });
  };

  const playTour = (dt: number) => {
    tour += dt;
    const cycleTime = tour % PERIOD;
    const index = stepAt(cycleTime);
    if (index !== step) {
      step = index;
      commit(STATES[index]);
    }
    const goal = tourCursor(cycleTime);
    cursor.x = follow(cursor.x, goal.x, dt, CURSOR_TAU);
    cursor.top = follow(cursor.top, goal.top, dt, CURSOR_TAU);
    cursorPlace(cursorAt(cursor.x, cursor.top));
    setPress(tourPress(cycleTime));
  };

  const settled = (part: Part, slot: number) => {
    if (part.wait > 0) return false;
    if (slot === OUT) return part.away === 1;
    const place = SLOTS[slot];
    return part.away === 0 && part.x === place.x && part.top === place.top;
  };

  const advance = (part: Part, slot: number, dt: number) => {
    part.wait = Math.max(0, part.wait - dt);
    part.lift = 0;
    if (slot !== OUT) {
      const place = SLOTS[slot];
      // 보이지 않는 블록은 들어갈 자리로 바로 옮겨 둔다.
      if (part.away === 1) {
        part.x = place.x;
        part.top = place.top;
      } else {
        const rightward = place.x > part.x;
        part.x = follow(part.x, place.x, dt, SLIDE_TAU);
        part.top = follow(part.top, place.top, dt, SLIDE_TAU);
        const gap = Math.hypot(place.x - part.x, place.top - part.top);
        // 자리를 맞바꾸는 두 블록이 서로를 통과하지 않게 오른쪽으로 가는 블록이 더 앞으로 지나간다.
        part.lift = Math.min(1, gap / 6) * LIFT * (rightward ? 2 : 1);
      }
    }
    const leaving = slot === OUT || part.wait > 0;
    part.away = leaving
      ? Math.min(1, part.away + dt / OUT_TIME)
      : Math.max(0, part.away - dt / IN_TIME);
  };

  const paint = (part: Part) => {
    const { pull, scale } = swapPose(part.away);
    const forward = part.lift + pull * PULL;
    part.place(
      shrunk(brickAt(part.x, part.top, part.h, forward), part.center, scale),
    );
    part.depth = scale > 0 ? Math.round(forward) : 0;
    // 그림자는 블록이 끼워진 자리에 남고, 블록이 떠오르거나 빠지면 옅어진다.
    const shadow = clamp(1 - part.away * 1.6 - (part.lift / LIFT) * 0.7, 0, 1);
    part.shadowPlace(onFace(part.x, part.top));
    part.shadowFade(shadow.toFixed(2));
  };

  // 끼워진 블록은 자리 순서(뒤에서 앞으로)로, 앞으로 나온 블록은 더 앞에 있는 것이 위에 오게 그린다.
  // 앞으로 나온 블록만 맨 뒤로 옮기고 나머지는 어긋난 것만 옮겨서, DOM을 거의 건드리지 않는다.
  let order = "";
  const reorder = () => {
    const sorted = parts
      .map((_, id) => id)
      .sort((a, b) => parts[a].depth - parts[b].depth || map[a] - map[b]);
    const key = sorted.join();
    if (key === order) return;
    order = key;
    for (const id of sorted) {
      if (parts[id].depth > 0) container.appendChild(parts[id].node);
    }
    let next = container.firstElementChild;
    for (const id of sorted) {
      const { node } = parts[id];
      if (node === next) next = next.nextElementSibling;
      else container.insertBefore(node, next);
    }
  };

  const tick = (dt: number, calm: boolean) => {
    const touring = !calm && !stopped;
    if (touring) playTour(dt);

    // 모션을 줄이는 설정에서는 시간이 한 번에 흘러 모든 값이 바로 목표에 닿는다.
    const elapsed = calm ? Number.POSITIVE_INFINITY : dt;
    let busy = false;
    for (const [id, part] of parts.entries()) {
      if (settled(part, map[id])) continue;
      busy = true;
      advance(part, map[id], elapsed);
      paint(part);
    }
    if (busy) reorder();
    return touring || busy;
  };

  const swap = (slot: number) => {
    if (!stopped) {
      stopped = true;
      root.setAttribute("data-still", "");
      setPress(false);
    }
    commit(swapAt(map, slot));
  };

  return {
    tick,
    swap,
    // Enter와 Space는 갈아 끼울 수 있는 자리를 차례로 바꾼다.
    cycle: () => {
      swap(SWAP_ORDER[nextSwap]);
      nextSwap = (nextSwap + 1) % SWAP_ORDER.length;
    },
  };
}
