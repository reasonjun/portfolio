import { afterEach, describe, expect, it, vi } from "vitest";
import { withBasePath } from "./base-path";

describe("withBasePath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NEXT_PUBLIC_BASE_PATH가 있으면 경로 앞에 붙인다", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio");
    expect(withBasePath("/ats/image-1.png")).toBe("/portfolio/ats/image-1.png");
  });

  it("NEXT_PUBLIC_BASE_PATH가 없으면 경로를 그대로 반환한다", () => {
    expect(withBasePath("/ats/image-1.png")).toBe("/ats/image-1.png");
  });
});
