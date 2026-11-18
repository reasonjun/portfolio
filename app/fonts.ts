import localFont from "next/font/local";

// Next.js는 글꼴을 불러온 경로에서만 미리 받으므로, 루트 레이아웃이 아니라 코드가 있는 페이지에서 불러온다.
// D2Coding 1.4.0(NAVER, SIL OFL 1.1 — fonts/d2-coding-font-OFL.txt)에서 영문·숫자·기호(U+0020~007E)만 남겼다.
// 라이선스상 일부만 남긴 파일은 글꼴 이름으로 D2Coding을 쓸 수 없어, 파일 안의 이름을 지우고 상수 이름을 역할로 지었다.
// 다시 만들기: hb-subset --unicodes=20-7E --name-IDs=0,7,13,14 -o d2-coding-font.ttf <원본.ttf> && woff2_compress d2-coding-font.ttf
export const codeFont = localFont({
  src: "./fonts/d2-coding-font.woff2",
  variable: "--font-code",
  // 기본값은 Arial을 흉내 낸 대체 글꼴이라 고정폭이 아니다. 못 불러오면 CSS의 시스템 고정폭 글꼴을 쓴다.
  adjustFontFallback: false,
});
