import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 본문 속 텍스트 링크(밑줄, hover 시 초록, 키보드 포커스 링). 전체 프로젝트 표와 404 페이지가 함께 쓴다.
export const TEXT_LINK_CLASS =
  "underline underline-offset-4 transition-colors hover:text-primary hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// 공백만 있는 문자열도 빈 값으로 본다.
export const hasText = (value: string): boolean => value.trim() !== "";
