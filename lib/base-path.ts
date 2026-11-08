// 정적 export에서는 next/image가 basePath를 붙이지 않으므로 직접 붙인다.
// path는 "/"로 시작해야 한다.
export const withBasePath = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
