import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getPublicImageSize, readImageSize } from "./image-size";

// 형식별 판별은 직접 만든 헤더로 검사한다. public 파일의 실제 픽셀 값을 적어 두면
// 그림을 다시 내보낼 때마다 테스트가 깨져 배포가 막힌다(크기를 파일에서 읽는 이유와 어긋난다).
const png = (width: number, height: number) => {
  const buffer = Buffer.alloc(24);
  buffer.writeUInt32BE(0x89504e47, 0);
  buffer.writeUInt32BE(0x0d0a1a0a, 4);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
};

const webp = (chunk: string, writeSize: (buffer: Buffer) => void) => {
  const buffer = Buffer.alloc(30);
  buffer.write("RIFF", 0, "ascii");
  buffer.write("WEBP", 8, "ascii");
  buffer.write(chunk, 12, "ascii");
  writeSize(buffer);
  return buffer;
};

describe("readImageSize", () => {
  it("PNG IHDR에서 크기를 읽는다", () => {
    expect(readImageSize(png(3760, 2160))).toEqual({
      width: 3760,
      height: 2160,
    });
  });

  it("WebP의 세 가지 청크(VP8X·VP8·VP8L)에서 크기를 읽는다", () => {
    const vp8x = webp("VP8X", (buffer) => {
      buffer.writeUIntLE(426 - 1, 24, 3);
      buffer.writeUIntLE(375 - 1, 27, 3);
    });
    const vp8 = webp("VP8 ", (buffer) => {
      buffer.writeUInt16LE(640, 26);
      buffer.writeUInt16LE(480, 28);
    });
    const vp8l = webp("VP8L", (buffer) => {
      buffer[20] = 0x2f;
      buffer.writeUInt32LE((1234 - 1) | ((567 - 1) << 14), 21);
    });

    expect(readImageSize(vp8x)).toEqual({ width: 426, height: 375 });
    expect(readImageSize(vp8)).toEqual({ width: 640, height: 480 });
    expect(readImageSize(vp8l)).toEqual({ width: 1234, height: 567 });
  });

  it("SVG 루트 태그의 width/height를 읽고, 편집용 content 안의 값은 무시한다", () => {
    // draw.io SVG처럼 루트 태그가 앞 4KB 안에서 닫히지 않아도 읽는다.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="992px" height="732px" viewBox="0 0 992 732" content="&lt;mxGeometry width=&quot;170&quot; height=&quot;54&quot;/&gt;${"x".repeat(5000)}`;
    expect(readImageSize(Buffer.from(svg).subarray(0, 4096))).toEqual({
      width: 992,
      height: 732,
    });
  });

  it("width/height가 없으면 viewBox에서 읽는다", () => {
    expect(
      readImageSize(Buffer.from('<svg xmlns="x" viewBox="0 0 320 240"></svg>')),
    ).toEqual({ width: 320, height: 240 });
  });

  it("지원하지 않는 형식이면 알린다", () => {
    expect(() =>
      readImageSize(Buffer.from("GIF89a-not-supported-xxxxxxxxxx")),
    ).toThrow();
  });
});

describe("getPublicImageSize", () => {
  it("앞부분만 읽어도 파일 전체를 읽은 것과 같은 크기를 낸다(앞의 '/'는 무시)", () => {
    for (const publicPath of [
      "design-system/image-1.png",
      "dot-canvas/image-4.webp",
      "diagrams/blue-green-deploy.drawio.svg",
    ]) {
      const whole = readImageSize(
        readFileSync(path.join(process.cwd(), "public", publicPath)),
      );
      expect(getPublicImageSize(publicPath)).toEqual(whole);
      expect(getPublicImageSize(`/${publicPath}`)).toEqual(whole);
    }
  });

  it("읽지 못하는 파일이면 오류에 파일 경로를 붙인다", () => {
    // public 밖이지만 확실히 이미지가 아닌 파일로 형식 오류를 낸다.
    expect(() => getPublicImageSize("../package.json")).toThrow(
      /package\.json: 지원하지 않는 이미지 형식/,
    );
  });
});
