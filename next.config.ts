import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: phase === PHASE_PRODUCTION_BUILD ? "/portfolio" : undefined,
});

export default nextConfig;
