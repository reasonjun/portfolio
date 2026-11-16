import type { Metadata } from "next";
import { Archivo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { Footer } from "@/components/portfolio/footer";
import { Navbar } from "@/components/portfolio/navbar";
import { SkipLink } from "@/components/skip-link";
import { PROFILE } from "@/data/profile";

// 라틴·숫자는 Archivo가, 한글은 아래 Noto Sans KR이 맡는다.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// 한글 글리프는 unicode-range로 필요한 조각만 불러오므로 preload하지 않는다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  preload: false,
});

const TITLE = "이성준 - 프론트엔드 개발자 포트폴리오";
const DESCRIPTION =
  "업무 시스템 화면 설계부터 테스트·무중단 배포까지 다루는 프론트엔드 개발자 이성준의 포트폴리오입니다.";

export const metadata: Metadata = {
  // 하위 페이지 제목 뒤에 사이트 이름을 붙인다. og:title에는 적용되지 않는다.
  title: { default: TITLE, template: `%s | ${PROFILE.siteName}` },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 글꼴 변수는 <html>에 둔다. PDF 쪽 여백 상자(@page)는 <body>가 아니라 <html>에서 글꼴을 물려받는다.
  return (
    <html lang="ko" className={`${archivo.variable} ${notoSansKr.variable}`}>
      <body className="antialiased">
        {/* 모든 페이지의 <main id="main-content">로 건너뛴다. */}
        <SkipLink />
        {/* 모든 페이지가 같은 네비·본문·푸터 골격을 쓴다. 인쇄본(/export → PDF)에는 본문만 나간다. */}
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
      </body>
    </html>
  );
}
