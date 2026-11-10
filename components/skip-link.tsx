"use client";

import type { MouseEvent } from "react";

const MAIN_ID = "main-content";

// 본문(<main id="main-content">)으로 건너뛴다. 기본 동작인 해시 이동은 Next.js가 모르는(state가 null인)
// 방문 기록을 남겨, 다른 페이지로 갔다가 뒤로 가기로 그 기록에 돌아오면 주소만 바뀌고 화면은 앞 페이지로 남는다.
// 그래서 기록을 남기지 않고 포커스와 스크롤만 옮긴다. 하이드레이션 전에는 일반 해시 링크로 동작한다.
export const SkipLink = () => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById(MAIN_ID);
    if (!main) return;
    event.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };

  return (
    <a
      href={`#${MAIN_ID}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring print:hidden"
    >
      본문으로 건너뛰기
    </a>
  );
};
