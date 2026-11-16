import { type ClassValue, clsx } from "clsx";
import type { CSSProperties, RefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 본문 속 텍스트 링크(밑줄, hover 시 초록, 키보드 포커스 링). 전체 프로젝트 표와 404 페이지가 함께 쓴다.
export const TEXT_LINK_CLASS =
  "underline underline-offset-4 transition-colors hover:text-primary hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// 공백만 있는 문자열도 빈 값으로 본다.
export const hasText = (value: string): boolean => value.trim() !== "";

// [data-reveal] 요소가 나타나는 순서(globals.css의 --i). React 스타일 타입에는 사용자 정의 속성이 없어 형변환한다.
export const revealDelay = (order: number) =>
  ({ "--i": order }) as CSSProperties;

// 빈 줄로 나눈 문단. 사례 본문은 문단마다 따로 렌더링하고, 콘텐츠 검사도 같은 단위로 백틱 짝을 본다.
export const splitParagraphs = (text: string): string[] => text.split(/\n{2,}/);

// 서로 다른 항목(회사, 기간, 팀 구성) 사이는 쉼표로 잇는다.
// 같은 묶음 안의 가운뎃점("프론트엔드 1·백엔드 2")은 앞뒤를 붙여 데이터에 적는다.
export const joinMeta = (...parts: (string | undefined)[]): string =>
  parts.filter(Boolean).join(", ");

// Radix의 기본 복귀 포커스(focus())는 트리거가 일부만 보이거나 앵커로 이동한 직후 페이지를 스크롤해 읽던 위치가 튄다.
// onCloseAutoFocus에 넘겨 스크롤 없이 트리거로 포커스를 돌려준다.
export const restoreFocusWithoutScroll =
  (ref: RefObject<HTMLElement | null>) => (event: Event) => {
    event.preventDefault();
    ref.current?.focus({ preventScroll: true });
  };
