"use client";

import { useEffect } from "react";

// 히어로 맨 위에서 아래로 스크롤하는 순간만 프로젝트로 넘긴다.
const TOP_ZONE = 40;
// 프로젝트 시작선에서 위로 스크롤하는 순간만 히어로로 되돌린다. 휠 한 칸이 커서 넉넉히 잡는다.
const BACK_ZONE = 120;
// smooth scroll이 끝나기까지 기다리는 시간(Chrome 실측 약 780ms).
const GLIDE_MS = 900;
// 트랙패드 관성 꼬리를 삼키려고, 마지막 휠 이벤트 후 이만큼 조용해질 때까지 잠근다.
const QUIET_MS = 100;

/**
 * 히어로 ↔ #case-studies 사이를 휠 한 번으로 smooth scroll 한다.
 * 모션 줄이기 설정, 터치·키보드 스크롤, 두 지점에서 벗어난 스크롤은 건드리지 않는다.
 * shortcut: 관성 입력과 새 입력을 구분하지 못한다. 이동 직후 100ms 안에 이어지는 입력은 모두 삼킨다.
 */
export const HeroScrollHandoff = () => {
  useEffect(() => {
    const target = document.getElementById("case-studies");
    if (!target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 이 시각(event.timeStamp 기준)까지는 휠을 막는다. 잠금 중 들어온 휠은 시한을 뒤로 민다.
    let lockedUntil = 0;

    const onWheel = (event: WheelEvent) => {
      if (reduce.matches || event.ctrlKey) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

      if (event.timeStamp < lockedUntil) {
        event.preventDefault();
        lockedUntil = Math.max(lockedUntil, event.timeStamp + QUIET_MS);
        return;
      }

      if (event.deltaY > 0 && window.scrollY <= TOP_ZONE) {
        event.preventDefault();
        lockedUntil = event.timeStamp + GLIDE_MS;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (event.deltaY < 0 && window.scrollY > TOP_ZONE) {
        // scrollIntoView가 멈추는 자리의 #case-studies 상단 위치(scroll-padding + scroll-margin).
        const arrivedTop =
          Number.parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) + Number.parseFloat(getComputedStyle(target).scrollMarginTop);
        // 시작선에서 BACK_ZONE 안쪽까지 내려온 상태에서만 되돌린다. 더 읽고 있으면 그대로 둔다.
        if (arrivedTop - target.getBoundingClientRect().top <= BACK_ZONE) {
          event.preventDefault();
          lockedUntil = event.timeStamp + GLIDE_MS;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
};
