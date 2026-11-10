"use client";

import "@/components/iso/iso.css";
import * as React from "react";
import { useInView, useLoop, useStillness } from "@/components/iso/react/live";
import { createLego, type Lego } from "./engine";
import "./hero-lego.css";
import { SWAP_ORDER } from "./model";
import { SCENE } from "./scene";

// 브라우저 창과 레고 블록. 같은 크기의 블록끼리 갈아 끼울 수 있고, 갈아 끼워도 나머지 블록은 움직이지 않는다.
// 사용자가 한 번 만지면 자동 시연은 멈춘다.
// 보조 기술에는 짧은 이름을 가진 버튼 하나로 알리고, 그림과 조작법은 숨긴 글을 aria-describedby로 읽어 준다.
// 모션을 줄이는 설정에서는 멈춘 그림에서 결과만 바로 바뀐다.

const NAME = "블록 갈아 끼우기 시연";
const HELP = `브라우저 창에 레고 블록으로 만든 웹 페이지가 끼워져 있습니다. 같은 크기의 블록끼리 갈아 끼울 수 있고, 갈아 끼워도 나머지 블록은 움직이지 않습니다. 큰 칸, 카드 칸 두 개, 작은 칸, 아래 줄 빈 칸을 누르거나 숫자 1부터 ${SWAP_ORDER.length}를 누르면 그 자리의 블록이 바뀝니다. Enter는 자리를 차례로 바꿉니다. 한 번 조작하면 자동 시연은 멈춥니다.`;

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
