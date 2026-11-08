import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// 대표 사례 콘텐츠 완성도 검사 전용 설정. 일반 `pnpm test`에는 포함하지 않는다.
export default defineConfig({
  test: {
    environment: "node",
    include: ["data/**/*.check.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
