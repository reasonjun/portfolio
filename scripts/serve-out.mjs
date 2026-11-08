import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../out",
);
const BASE_PATH = "/portfolio";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const isFile = async (filePath) => {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
};

const send = (res, status, filePath) => {
  res.writeHead(status, {
    "Content-Type":
      MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(res);
};

const handleRequest = async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const inBasePath =
    pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`);

  if (inBasePath) {
    const relative = decodeURIComponent(pathname.slice(BASE_PATH.length));
    const target = path.join(
      OUT_DIR,
      relative.endsWith("/") || relative === ""
        ? `${relative}index.html`
        : relative,
    );

    // out/ 바깥 경로 접근 차단
    if (target.startsWith(`${OUT_DIR}${path.sep}`) && (await isFile(target))) {
      return send(res, 200, target);
    }
  }

  const notFoundPage = path.join(OUT_DIR, "404.html");
  if (await isFile(notFoundPage)) return send(res, 404, notFoundPage);

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
};

export const startServer = (port) =>
  new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      handleRequest(req, res).catch(() => {
        res.writeHead(500);
        res.end();
      });
    });
    server.once("error", reject);
    server.listen(port, () => resolve(server));
  });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4173);
  await startServer(port);
  console.log(`serving out/ at http://localhost:${port}${BASE_PATH}/`);
}
