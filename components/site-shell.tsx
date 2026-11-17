import type { ReactNode } from "react";
import { Footer } from "@/components/portfolio/footer";
import { Navbar } from "@/components/portfolio/navbar";
import { SkipLink } from "@/components/skip-link";

interface SiteShellProps {
  children: ReactNode;
}

// 사이트 페이지의 골격(본문 바로가기, 메뉴, 본문 틀, 푸터).
// (site) 그룹의 레이아웃과 루트 404가 쓴다. PDF 문서(/export)는 이 골격 밖에서 빈 종이로 시작한다.
export const SiteShell = ({ children }: SiteShellProps) => (
  <>
    {/* 모든 페이지의 <main id="main-content">로 건너뛴다. */}
    <SkipLink />
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-6 focus:outline-none"
      >
        {children}
      </main>
      <Footer />
    </div>
  </>
);
