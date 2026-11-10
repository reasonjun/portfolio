import { describe, expect, it } from "vitest";
import {
  BRICKS,
  CARD_A,
  CARD_B,
  EXTRA,
  LARGE,
  OUT,
  PERIOD,
  REST,
  SLOTS,
  SMALL,
  STATES,
  SWAP_ORDER,
  stepAt,
  swapAt,
  swapPose,
  VIEW_HEIGHT,
} from "@/components/portfolio/hero-lego/model";

const brickOf = (kind: string) =>
  BRICKS.findIndex((brick) => brick.kind === kind);

const expectValid = (map: readonly number[]) => {
  const used = map.filter((slot) => slot !== OUT);
  expect(new Set(used).size).toBe(used.length);
  map.forEach((slot, id) => {
    if (slot === OUT) return;
    expect(SLOTS[slot].w).toBe(BRICKS[id].w);
    expect(SLOTS[slot].h).toBe(BRICKS[id].h);
  });
};

const changed = (from: readonly number[], to: readonly number[]) =>
  from.flatMap((slot, id) => (slot === to[id] ? [] : [id]));

describe("hero-lego 자리", () => {
  it("자리끼리 겹치지 않고 뷰포트 안에 있다", () => {
    SLOTS.forEach((slot, i) => {
      expect(slot.top + slot.h).toBeLessThanOrEqual(VIEW_HEIGHT);
      SLOTS.slice(i + 1).forEach((other) => {
        const apart =
          slot.x + slot.w <= other.x ||
          other.x + other.w <= slot.x ||
          slot.top + slot.h <= other.top ||
          other.top + other.h <= slot.top;
        expect(apart).toBe(true);
      });
    });
  });

  it("모든 줄이 같은 오른쪽 끝에서 끝나 창에 빈 구석이 없다", () => {
    const rightOfRow = new Map<number, number>();
    for (const slot of SLOTS) {
      const right = slot.x + slot.w;
      rightOfRow.set(slot.top, Math.max(rightOfRow.get(slot.top) ?? 0, right));
    }
    expect(new Set(rightOfRow.values()).size).toBe(1);
  });

  it("처음 상태는 빈 칸을 빼고 모든 자리가 차 있다", () => {
    expectValid(REST);
    SLOTS.forEach((_, slot) => {
      expect(REST.includes(slot)).toBe(slot !== EXTRA);
    });
  });

  it("숫자 키 순서에는 갈아 끼울 수 있는 자리만 있다", () => {
    expect(SWAP_ORDER).toEqual([LARGE, CARD_A, CARD_B, SMALL, EXTRA]);
    SWAP_ORDER.forEach((slot) => {
      expect(SLOTS[slot].family).not.toBeNull();
    });
  });
});

describe("swapAt", () => {
  it("히어로를 표로 바꿔도 나머지 블록은 그대로다", () => {
    const next = swapAt(REST, LARGE);
    expect(next[brickOf("hero")]).toBe(OUT);
    expect(next[brickOf("table")]).toBe(LARGE);
    expect(changed(REST, next).sort()).toEqual(
      [brickOf("hero"), brickOf("table")].sort(),
    );
    expectValid(next);
  });

  it("두 번 바꾸면 처음으로 돌아온다", () => {
    expect(swapAt(swapAt(REST, LARGE), LARGE)).toEqual([...REST]);
  });

  it("카드는 쉬고 있는 카드로 바뀐다", () => {
    const next = swapAt(REST, CARD_A);
    expect(next[brickOf("profile")]).toBe(OUT);
    expect(next[brickOf("donut")]).toBe(CARD_A);
    expect(next[brickOf("chart")]).toBe(CARD_B);
    expectValid(next);
  });

  it("카드 칸을 계속 눌러도 항상 올바른 배치다", () => {
    let map: readonly number[] = REST;
    for (let turn = 0; turn < 9; turn += 1) {
      map = swapAt(map, turn % 2 ? CARD_B : CARD_A);
      expectValid(map);
      expect(map.filter((slot) => slot === OUT).length).toBe(
        REST.filter((slot) => slot === OUT).length,
      );
    }
  });

  it("빈 칸은 눌러서 채우고 다시 눌러서 비운다", () => {
    const filled = swapAt(REST, EXTRA);
    expect(filled[brickOf("tabs")]).toBe(EXTRA);
    expect(changed(REST, filled)).toEqual([brickOf("tabs")]);
    expect(swapAt(filled, EXTRA)).toEqual([...REST]);
  });

  it("고정된 자리는 바뀌지 않는다", () => {
    SLOTS.forEach((slot, index) => {
      if (slot.family === null) expect(swapAt(REST, index)).toEqual([...REST]);
    });
  });
});

describe("자동 시연", () => {
  it("모든 단계가 올바른 배치이고 고정 블록은 움직이지 않는다", () => {
    for (const state of STATES) {
      expectValid(state);
      BRICKS.forEach((brick, id) => {
        if (brick.family === null) expect(state[id]).toBe(REST[id]);
      });
    }
  });

  it("처음과 끝이 같아 이음매 없이 반복된다", () => {
    expect(STATES[0]).toEqual([...REST]);
    expect(STATES[STATES.length - 1]).toEqual([...REST]);
  });

  it("교체, 맞바꿈, 빈 칸 채우기를 순서대로 보여 준다", () => {
    const [, replaced, exchanged, extended] = STATES;
    expect(replaced[brickOf("table")]).toBe(LARGE);
    expect(exchanged[brickOf("profile")]).toBe(CARD_B);
    expect(exchanged[brickOf("chart")]).toBe(CARD_A);
    expect(extended[brickOf("tabs")]).toBe(EXTRA);
  });

  it("시간이 지나면 단계가 뒤로 가지 않고 끝 단계까지 닿는다", () => {
    let previous = 0;
    for (let cycleTime = 0; cycleTime < PERIOD; cycleTime += 0.05) {
      const step = stepAt(cycleTime);
      expect(step).toBeGreaterThanOrEqual(previous);
      previous = step;
    }
    expect(stepAt(0)).toBe(0);
    expect(previous).toBe(STATES.length - 1);
  });
});

describe("swapPose", () => {
  it("끼워져 있으면 제자리이고 완전히 빠지면 크기가 0이다", () => {
    expect(swapPose(0)).toEqual({ pull: 0, scale: 1 });
    expect(swapPose(1)).toEqual({ pull: 1, scale: 0 });
  });

  it("다 당겨 나오기 전에는 작아지지 않는다", () => {
    for (let away = 0; away <= 1; away += 0.01) {
      const { pull, scale } = swapPose(away);
      if (pull < 1) expect(scale).toBe(1);
    }
  });

  it("당겨 나오는 양과 크기는 한 방향으로만 변한다", () => {
    let previous = swapPose(0);
    for (let away = 0.01; away <= 1; away += 0.01) {
      const pose = swapPose(away);
      expect(pose.pull).toBeGreaterThanOrEqual(previous.pull);
      expect(pose.scale).toBeLessThanOrEqual(previous.scale);
      previous = pose;
    }
  });
});
