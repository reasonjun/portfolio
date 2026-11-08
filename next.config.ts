import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  const basePath = phase === PHASE_PRODUCTION_BUILD ? "/portfolio" : undefined;

  return {
    output: "export",
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
