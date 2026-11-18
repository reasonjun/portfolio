// 그림 원본(diagrams/*.drawio)을 글자가 도형(윤곽선)인 SVG(public/diagrams/*.svg)로 굽는다.
// 사용: pnpm diagrams (원본을 고친 뒤 이 컴퓨터에서 실행하고, 결과를 커밋한다)
//
// draw.io가 내보낸 SVG는 글자를 글꼴 이름만 적어 두고, 줄바꿈도 그림을 그리는 기계가 자기 글꼴로 계산한다.
// 그래서 방문자 기기나 PDF를 만드는 서버마다 글꼴·글자 폭·줄바꿈이 달라졌다.
// 구운 SVG에는 글자가 없어 어디서 그려도 같다. 대신 굽는 일은 글꼴이 설치된 컴퓨터에서만 한다.
// 필요한 것: draw.io 명령줄 도구(drawio), poppler의 pdftocairo, 설치된 글꼴(FONT).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";

const SOURCE_DIR = "diagrams";
const OUTPUT_DIR = "public/diagrams";
// 사이트 본문과 같은 글꼴. 원본의 모든 칸이 style에 fontFamily로 적어야 draw.io 편집 화면과 구운 결과가 같다.
const FONT = "Noto Sans KR";
const FONT_HANGUL_ADVANCE_EM = 0.92;

const trimDecimals = (text) => text.replace(/(\d+\.\d{2})\d+/g, "$1");

// 글꼴이 없으면 브라우저가 OS 대체 글꼴로 그려 오류 없이 다른 모양으로 구워진다.
const assertFontInstalled = async (page) => {
  const advance = await page.evaluate((font) => {
    const context = document.createElement("canvas").getContext("2d");
    context.font = `100px "${font}"`;
    return context.measureText("가").width / 100;
  }, FONT);
  if (Math.abs(advance - FONT_HANGUL_ADVANCE_EM) > 0.005) {
    throw new Error(`${FONT} 글꼴이 이 컴퓨터에 설치되어 있지 않음`);
  }
};

const ids = readdirSync(SOURCE_DIR)
  .filter((name) => name.endsWith(".drawio"))
  .map((name) => path.basename(name, ".drawio"));
const work = mkdtempSync(path.join(tmpdir(), "diagrams-"));
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await assertFontInstalled(page);

  // 사이트에 다크 모드가 없어 색을 라이트로 고정한다.
  execFileSync(
    "drawio",
    ["-x", "-f", "svg", "--theme", "light", "-o", work, SOURCE_DIR],
    { stdio: "pipe" },
  );

  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const id of ids) {
    const rawPath = path.join(work, `${id}.svg`);
    if (!existsSync(rawPath)) throw new Error(`${id}: draw.io가 내보내지 못함`);
    const raw = readFileSync(rawPath, "utf8");

    // 글꼴을 적지 않은 칸은 draw.io 기본 글꼴(Helvetica)로 구워져 다른 칸과 달라진다.
    const otherFont = [...raw.matchAll(/font-family: ([^;]*);/g)]
      .filter((match) => !match[1].includes(FONT))
      .map((match) => {
        const cell = raw.lastIndexOf('data-cell-id="', match.index);
        return raw.slice(cell + 14, raw.indexOf('"', cell + 14));
      });
    if (otherFont.length > 0) {
      throw new Error(
        `${id}: style에 fontFamily=${FONT}; 가 없는 칸: ${[...new Set(otherFont)].join(", ")}`,
      );
    }

    const tag = raw.match(/<svg\b[^>]*/)[0];
    const width = tag.match(/\swidth="([\d.]+)/)[1];
    const height = tag.match(/\sheight="([\d.]+)/)[1];

    // 그림과 같은 크기의 쪽에 찍으면 글자가 글꼴과 함께 PDF에 들어가고, pdftocairo가 그 글자를 도형으로 바꾼다.
    await page.setContent(
      `<!doctype html><style>@page{size:${width}px ${height}px;margin:0}body{margin:0}svg{display:block}</style>${raw}`,
    );
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
    });

    // 원본이 바뀐 뒤 다시 구웠는지 테스트(lib/diagrams.test.ts)가 확인할 수 있게 원본의 해시를 적는다.
    const source = createHash("sha256")
      .update(readFileSync(path.join(SOURCE_DIR, `${id}.drawio`)))
      .digest("hex")
      .slice(0, 16);
    // "-"는 표준 입력·출력이다. 출력이 1MB를 넘기도 해서 기본 한도(maxBuffer 1MiB)를 푼다.
    const baked = execFileSync("pdftocairo", ["-svg", "-", "-"], {
      input: pdf,
      encoding: "utf8",
      maxBuffer: Number.POSITIVE_INFINITY,
    })
      // pdftocairo는 크기를 pt로 적는다. px로 되돌려야 원래 크기로 읽힌다(lib/image-size.ts).
      // 첫 width·height 짝이 루트 <svg>의 것이다.
      .replace(
        /width="[^"]*" height="[^"]*"/,
        `width="${width}" height="${height}" data-source="${source}"`,
      )
      .replace(/ d="[^"]*"|<use [^>]*>/g, trimDecimals);
    if (/<(text|foreignObject|image)\b/.test(baked)) {
      throw new Error(`${id}: 구운 그림에 글자나 비트맵이 남음`);
    }
    writeFileSync(path.join(OUTPUT_DIR, `${id}.svg`), baked);
    console.log(`baked ${id} (${width}×${height})`);
  }
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
