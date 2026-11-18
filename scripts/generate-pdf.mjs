import { mkdir, rm } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startServer } from "./serve-out.mjs";

const PORT = 4174;
const EXPORT_URL = `http://localhost:${PORT}/portfolio/export/`;
const OUTPUT_PATH = "out/portfolio.pdf";

const server = await startServer(PORT);
// 리눅스(배포 빌드)의 headless Chromium은 글자 폭을 정수 픽셀로 맞춰, 같은 글꼴 파일인데도 영문·숫자가 맥보다 넓게 찍힌다.
// 힌팅을 끄면 글꼴에 적힌 폭 그대로 배치해, PDF를 어느 컴퓨터에서 만들어도 글자 간격이 같다.
const browser = await chromium.launch({
  args: ["--font-render-hinting=none"],
});

try {
  // 실패했을 때 예전 PDF가 남아 배포되지 않게 먼저 지운다.
  await rm(OUTPUT_PATH, { force: true });

  const page = await browser.newPage();
  await page.goto(EXPORT_URL, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print", colorScheme: "light" });

  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";
    await Promise.all(
      images.map((image) => image.decode().catch(() => undefined)),
    );
    await document.fonts.ready;
  });

  // 쪽 상자(app/export/page.tsx의 data-sheet)는 높이가 고정이라 글이 넘쳐도 쪽 수가 늘지 않고 넘친 부분이 잘린다.
  // 잘린 PDF가 소리 없이 배포되지 않게, 넘친 쪽이 있으면 만들지 않는다.
  const overflowing = await page.$$eval("[data-sheet]", (sheets) =>
    sheets
      .filter((sheet) => sheet.scrollHeight > sheet.clientHeight + 1)
      .map(
        (sheet) =>
          `${sheet.dataset.sheet}: ${sheet.scrollHeight - sheet.clientHeight}px 넘침`,
      ),
  );
  if (overflowing.length > 0) {
    throw new Error(
      `쪽 상자를 넘친 내용이 있어 PDF를 만들지 않음\n${overflowing.join("\n")}`,
    );
  }

  await mkdir("out", { recursive: true });
  await page.pdf({
    path: OUTPUT_PATH,
    // 쪽 크기와 여백은 app/export/paper.css의 @page와 쪽 상자가 정한다.
    preferCSSPageSize: true,
    printBackground: true,
    // 제목 요소로 책갈피를 만든다. 책갈피는 태그가 있어야 만들어진다.
    tagged: true,
    outline: true,
  });
  console.log(`generated ${OUTPUT_PATH}`);
} finally {
  await browser.close();
  server.close();
}
