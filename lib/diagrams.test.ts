import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// 그림은 원본(diagrams/*.drawio)을 구워서(pnpm diagrams) 만든다. 굽는 일은 글꼴이 있는 컴퓨터에서 손으로 하므로,
// 원본만 고치고 굽지 않은 채 배포되는 일을 여기서 막는다.
const names = (dir: string, extension: string) =>
  readdirSync(dir)
    .filter((name) => name.endsWith(extension))
    .map((name) => name.slice(0, -extension.length))
    .sort();

describe("구운 그림(public/diagrams)", () => {
  const ids = names("diagrams", ".drawio");

  it("원본과 하나씩 짝이 맞는다", () => {
    expect(names("public/diagrams", ".svg")).toEqual(ids);
  });

  it.each(ids)("%s: 지금 원본으로 구웠고 글자가 남아 있지 않다", (id) => {
    const baked = readFileSync(`public/diagrams/${id}.svg`, "utf8");
    // scripts/bake-diagrams.mjs가 적는 값과 같은 식이다.
    const source = createHash("sha256")
      .update(readFileSync(`diagrams/${id}.drawio`))
      .digest("hex")
      .slice(0, 16);
    expect(
      baked.match(/data-source="([^"]*)"/)?.[1],
      "원본이 바뀌었다. pnpm diagrams로 다시 굽고 커밋한다",
    ).toBe(source);
    // 글자가 남아 있으면 그리는 기계의 글꼴에 따라 모양이 달라진다. 굽는 스크립트와 같은 규칙이다.
    expect(baked).not.toMatch(/<(text|foreignObject|image)\b/);
  });
});
