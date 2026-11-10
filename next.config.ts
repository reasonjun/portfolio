import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  const basePath = phase === PHASE_PRODUCTION_BUILD ? "/portfolio" : undefined;

  return {
    output: "export",
    // 개발 서버에 휴대폰으로 같은 와이파이의 IP(192.168.x.x)로 접속할 때, Next.js가 다른 주소에서 오는
    // 개발용 JS 요청을 막아 하이드레이션이 안 된다(메뉴·확대 등 클릭이 동작하지 않음). 개발 서버에만 적용된다.
    allowedDevOrigins: ["192.168.*.*"],
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    basePath,
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath ?? "",
    },
  };
};

export default nextConfig;
