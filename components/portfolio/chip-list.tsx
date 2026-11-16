import { cn } from "@/lib/utils";

interface ChipListProps {
  items: string[];
  // 목록을 설명하는 제목(dt 등)이 곁에 없을 때 스크린리더가 읽을 목록 이름
  label?: string;
  className?: string;
}

// 기술 이름 칩. 고유 명사라 번역기가 바꾸지 않게 translate="no"를 붙인다.
export const ChipList = ({ items, label, className }: ChipListProps) => (
  <ul
    aria-label={label}
    className={cn("flex flex-wrap gap-2 text-sm font-medium", className)}
  >
    {items.map((item) => (
      <li
        key={item}
        translate="no"
        className="whitespace-nowrap rounded-full border border-foreground/25 px-3 py-0.5"
      >
        {item}
      </li>
    ))}
  </ul>
);
