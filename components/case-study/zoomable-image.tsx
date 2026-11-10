"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

// 좁은 화면에서 모달에 띄울 최소 폭. 폭에 맞추면 본문과 크기가 같아 확대 의미가 없다.
const MIN_ZOOM_WIDTH = 960;

interface ZoomableImageProps {
  /** public 기준 경로("/"로 시작) */
  src: string;
  alt: string;
  /** 원본 픽셀 크기 */
  width: number;
  height: number;
  /** 모달 제목(스크린리더용). 없으면 alt를 쓴다. */
  title?: string;
  /**
   * 모달에 띄울 크기 = 원본 × zoomScale.
   * 다이어그램은 1, 고해상도(2배)로 캡처한 스크린샷은 0.5가 원래 화면 크기다.
   */
  zoomScale?: number;
  /**
   * inline: 본문 폭에 맞춰 그림 높이가 정해진다(다이어그램).
   * contain: 부모 상자를 채우되 원본보다 크게 늘리지 않는다(캐러셀 스크린샷).
   */
  variant?: "inline" | "contain";
  className?: string;
  /** 첫 화면에 보이는 이미지(LCP 후보)는 지연 로딩하지 않는다. */
  eager?: boolean;
}

// 본문에서는 폭에 맞춰 보여 주고, 클릭하면 모달로 크게 띄운다.
// 화면보다 크면 모달 안쪽 상자에서 스크롤된다. 인쇄본에서는 확대 아이콘을 숨긴다.
export const ZoomableImage = ({
  src,
  alt,
  width,
  height,
  title = alt,
  zoomScale = 1,
  variant = "inline",
  className,
  eager = false,
}: ZoomableImageProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const url = withBasePath(src);
  const zoomWidth = Math.round(width * zoomScale);
  const sizing =
    variant === "inline"
      ? { width, height, className: cn("mx-auto h-auto w-full", className) }
      : // scale-down: 상자보다 크면 줄이고, 작으면 원본 크기 그대로 둔다(흐려지지 않게).
        { fill: true, className: cn("object-scale-down", className) };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            // 포커스 링은 ::after로 그림 위에 안쪽으로 그린다. 바깥 링은 캐러셀 뷰포트(overflow-hidden)에 잘려 보이지 않는다.
            "group relative block w-full cursor-zoom-in rounded focus-visible:outline-none after:pointer-events-none after:absolute after:inset-0 after:rounded focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring",
            variant === "contain" && "h-full",
          )}
        >
          <Image
            src={url}
            alt={alt}
            loading={eager ? "eager" : undefined}
            {...sizing}
          />
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 rounded-md border bg-background/90 p-1.5 text-muted-foreground shadow-sm transition-colors group-hover:text-foreground print:hidden"
          >
            <Maximize2 className="size-4" />
          </span>
          {/* 버튼 이름은 이미지 alt에 이 문구를 이어 붙여 만든다. aria-label을 쓰면 alt가 가려진다. */}
          <span className="sr-only">, 크게 보기</span>
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        // 기본 복귀 포커스(focus())는 트리거가 일부만 보이면 페이지를 스크롤해 읽던 위치가 튄다. 스크롤 없이 돌려준다.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
        className="w-full bg-white p-4 pt-12"
        // 화면 폭과 띄울 폭(+p-4 좌우 여백 2rem, 테두리 2px) 중 작은 쪽. 안쪽 스크롤 상자는 폭을 스스로 정하지 못해 여기서 정한다.
        style={{
          maxWidth: `min(calc(100vw - 2rem), calc(${zoomWidth}px + 2rem + 2px))`,
        }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {/* 스크롤은 안쪽 상자에서만 일어나게 해, 닫기 버튼이 이미지와 함께 화면 밖으로 밀려나지 않게 한다.
            키보드로도 넘친 부분을 볼 수 있게 상자가 포커스를 받는다(열면 이 상자에 먼저 포커스가 간다). */}
        <div
          // biome-ignore lint/a11y/noNoninteractiveTabindex: 스크롤 상자는 키보드로 스크롤하려면 포커스를 받아야 한다.
          tabIndex={0}
          className="max-h-[calc(100dvh-6rem)] overflow-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Image
            src={url}
            alt={alt}
            width={width}
            height={height}
            // 모달 폭에 맞추되 최소 960px(좁은 화면은 가로 스크롤), 띄울 폭(원본 × zoomScale)보다 크게는 늘리지 않는다.
            style={{
              width: `min(${zoomWidth}px, max(100%, ${MIN_ZOOM_WIDTH}px))`,
            }}
            className="h-auto max-w-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
