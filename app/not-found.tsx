import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { PROFILE } from "@/data/profile";
import { TEXT_LINK_CLASS } from "@/lib/utils";

// 루트 세그먼트라 레이아웃의 title.template이 적용되지 않아 사이트 이름을 직접 붙인다.
export const metadata: Metadata = {
  title: { absolute: `페이지를 찾을 수 없습니다 | ${PROFILE.siteName}` },
};

// 루트 404는 맞는 경로가 없는 모든 주소를 맡아서 (site) 그룹 밖에 둔다. 그래서 사이트 골격을 직접 쓴다.
export default function NotFound() {
  return (
    <SiteShell>
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
    </SiteShell>
  );
}
