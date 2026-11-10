import type { Metadata } from "next";
import Link from "next/link";
import { TEXT_LINK_CLASS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | 이성준 포트폴리오",
};

// 네비·푸터는 루트 레이아웃이 그린다. 여기서는 본문만 채운다.
export default function NotFound() {
  return (
    <div className="py-24 space-y-6">
      <p className="text-sm font-medium text-muted-foreground tabular-nums">
        404
      </p>
      <h1 className="text-3xl font-bold text-balance">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-muted-foreground">
        주소가 바뀌었거나 없는 페이지입니다.
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
        <li>
          <Link href="/" className={TEXT_LINK_CLASS}>
            홈으로
          </Link>
        </li>
        <li>
          <Link href="/archive/" className={TEXT_LINK_CLASS}>
            전체 프로젝트 보기
          </Link>
        </li>
      </ul>
    </div>
  );
}
