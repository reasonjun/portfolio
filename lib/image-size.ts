import { closeSync, openSync, readSync } from "node:fs";
import path from "node:path";

export interface ImageSize {
  width: number;
  height: number;
}

// 정적 export 빌드 시점에 public 이미지의 원본 크기를 헤더에서 읽는다(PNG·WebP·SVG).
// 데이터에 크기를 손으로 적지 않아도 확대 모달이 원본 비율로 띄울 수 있게 하기 위함이다.
export const readImageSize = (buffer: Buffer): ImageSize => {
  const isPng =
    buffer.length >= 24 &&
    buffer.readUInt32BE(0) === 0x89504e47 &&
    buffer.toString("ascii", 12, 16) === "IHDR";
  if (isPng) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  const isWebp =
    buffer.length >= 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  if (isWebp) {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8 ") {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === "VP8L") {
      const [b0, b1, b2, b3] = [21, 22, 23, 24].map((i) => buffer[i]);
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
  }

  // SVG: 루트 <svg>의 width/height(px), 없으면 viewBox. draw.io SVG는 루트 태그에 편집용 원본(content)이 커서
  // 앞부분만 읽으면 태그가 닫히지 않으므로 닫는 ">"를 요구하지 않는다.
  const svgTag = buffer.toString("utf8").match(/<svg\b[^>]*/)?.[0];
  if (svgTag) {
    const attr = (name: string) =>
      svgTag.match(new RegExp(`\\s${name}="([\\d.]+)(?:px)?"`))?.[1];
    const [width, height] = [attr("width"), attr("height")].map(Number);
    if (width && height) return { width, height };
    const viewBox = svgTag.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/);
    if (viewBox)
      return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  }

  throw new Error("지원하지 않는 이미지 형식입니다(PNG·WebP·SVG만 지원).");
};

// 크기는 파일 앞부분에만 있으므로 앞 4KB만 읽는다(SVG 루트 태그까지 포함).
// 결과는 모듈에 저장하지 않는다. 개발 서버에서는 모듈이 계속 살아 있어, 그림을 다시 내보내도 옛 크기가 남는다.
const HEADER_BYTES = 4096;

/** public 기준 경로(예: "dot-canvas/image-1.png", 앞의 "/"는 무시)의 원본 크기 */
export const getPublicImageSize = (publicPath: string): ImageSize => {
  const filePath = path.join("public", publicPath);
  const fd = openSync(path.join(process.cwd(), filePath), "r");
  try {
    const buffer = Buffer.alloc(HEADER_BYTES);
    const bytesRead = readSync(fd, buffer, 0, HEADER_BYTES, 0);
    return readImageSize(buffer.subarray(0, bytesRead));
  } catch (error) {
    // 형식 오류 메시지에는 파일 이름이 없어, 빌드가 멈췄을 때 어느 이미지인지 알 수 있게 붙인다.
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${filePath}: ${reason}`, { cause: error });
  } finally {
    closeSync(fd);
  }
};
