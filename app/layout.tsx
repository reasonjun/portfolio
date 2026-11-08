import type { Metadata } from "next";
import { Archivo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

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

const TITLE = "이성준 - 프런트엔드 개발자 포트폴리오";
const DESCRIPTION =
  "업무 시스템 화면 설계부터 테스트·무중단 배포까지 다루는 프런트엔드 개발자 이성준의 포트폴리오입니다.";

export const metadata: Metadata = {
  title: TITLE,
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
  return (
    <html lang="ko">
      <body
        className={`${archivo.variable} ${notoSansKr.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
