import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startServer } from "./serve-out.mjs";

const PORT = 4174;
const EXPORT_URL = `http://localhost:${PORT}/portfolio/export/`;
const OUTPUT_PATH = "out/portfolio.pdf";

const server = await startServer(PORT);
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(EXPORT_URL, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print", colorScheme: "light" });

  // lazy 이미지를 모두 불러오고, 한글 글꼴 조각이 로드될 때까지 기다린다.
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";
    await Promise.all(
      images.map((image) => image.decode().catch(() => undefined)),
    );
    await document.fonts.ready;
  });

  await mkdir("out", { recursive: true });
  await page.pdf({
    path: OUTPUT_PATH,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  });
  console.log(`generated ${OUTPUT_PATH}`);
} finally {
  await browser.close();
  server.close();
}
