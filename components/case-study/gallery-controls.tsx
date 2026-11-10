"use client";

import { useEffect, useState } from "react";
import {
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";

// 화살표를 이미지 위가 아니라 아래 줄로 빼서, 화살표 옆을 누르다 확대가 열리는 일을 막는다.
// 44px은 Apple HIG의 최소 터치 영역이다. 몇 번째 이미지인지도 함께 보여 준다.
export const GalleryControls = ({ count }: { count: number }) => {
  const { api } = useCarousel();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    // 보이는 슬라이드의 확대 버튼만 Tab 순서에 둔다. 숨은 슬라이드의 버튼까지 Tab으로 거치면 Embla가 포커스를 받은
    // 슬라이드로 넘겨 Tab마다 이미지가 바뀐다. 슬라이드 이동은 화살표 키와 이전/다음 버튼이 맡는다.
    const update = () => {
      const index = api.selectedScrollSnap();
      setCurrent(index + 1);
      api.slideNodes().forEach((slide, i) => {
        slide
          .querySelector("button")
          ?.setAttribute("tabindex", i === index ? "0" : "-1");
      });
    };
    const onSelect = () => {
      update();
      // 화살표 키로 넘기면 포커스가 화면 밖으로 밀려난 이전 슬라이드의 확대 버튼에 남아, Enter가 보이지 않는 이미지를 연다.
      // 포커스가 다른 슬라이드 안에 있었다면 새로 보이는 슬라이드의 확대 버튼으로 옮긴다(슬라이드 하나가 한 칸이다).
      const slides = api.slideNodes();
      const selected = slides[api.selectedScrollSnap()];
      const active = document.activeElement;
      if (!selected || !active || selected.contains(active)) return;
      if (!slides.some((slide) => slide.contains(active))) return;
      selected
        .querySelector<HTMLElement>("button")
        ?.focus({ preventScroll: true });
    };
    update();
    api.on("select", onSelect);
    api.on("reInit", update);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", update);
    };
  }, [api]);

  if (count < 2) return null;

  return (
    <div className="mt-3 flex items-center justify-center gap-4 print:hidden">
      {/* 프리미티브의 숨김 문구가 영어("Previous slide")라 한국어 이름으로 덮는다. */}
      <CarouselPrevious
        aria-label="이전 이미지"
        className="static size-11 translate-y-0"
      />
      <p
        className="min-w-12 text-center text-sm text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        <span className="sr-only">이미지 </span>
        {current} / {count}
      </p>
      <CarouselNext
        aria-label="다음 이미지"
        className="static size-11 translate-y-0"
      />
    </div>
  );
};
