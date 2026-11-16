import type { ReactNode } from "react";

// 프로젝트·경력 섹션의 바깥 여백. 넓은 화면에서는 sticky 네비 높이만큼 앵커 위치를 올린다.
export const HOME_SECTION_CLASS =
  "scroll-mt-3 py-16 lg:-scroll-mt-11 lg:py-[7.5rem]";

interface SectionHeadingProps {
  id?: string;
  children: ReactNode;
}

export const SectionHeading = ({ id, children }: SectionHeadingProps) => (
  <h2
    id={id}
    data-reveal
    className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-balance"
  >
    {children}
  </h2>
);
