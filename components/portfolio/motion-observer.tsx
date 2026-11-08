"use client";

import { useEffect } from "react";

/**
 * [data-reveal] 요소가 화면에 들어올 때 한 번만 data-in을 붙인다.
 * 스크립트가 돌기 전에는 아무것도 숨기지 않고, 이미 보이는 요소는 숨기기 전에 먼저 표시한다.
 */
export const MotionObserver = () => {
  useEffect(() => {
    const targets = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    const viewportHeight = window.innerHeight;

    for (const element of targets) {
      if (element.getBoundingClientRect().top < viewportHeight) {
        element.setAttribute("data-in", "");
      }
    }
    document.documentElement.classList.add("js-motion");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer.unobserve(entry.target);
        }
      },
      // 아래쪽 여백은 마지막 섹션의 아래 패딩(64px)보다 작아야 한다.
      // 더 크면 페이지 맨 끝에서 영영 교차하지 않는 요소가 생긴다.
      { rootMargin: "0px 0px -48px 0px" },
    );

    for (const element of targets) {
      if (!element.hasAttribute("data-in")) observer.observe(element);
    }

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("js-motion");
    };
  }, []);

  return null;
};
