import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 공백만 있는 문자열도 빈 값으로 본다.
export const hasText = (value: string): boolean => value.trim() !== "";
