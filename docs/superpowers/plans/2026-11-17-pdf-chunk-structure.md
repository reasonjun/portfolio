# PDF 덩어리 구조 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오 PDF를 "표지 1쪽 + 덩어리 하나에 1쪽"(지금 고른 9개면 10쪽)인 전용 문서로 바꾸고, 사례 데이터와 그림 연결을 덩어리 단위로 옮긴다.

**Architecture:** 사례 데이터는 `Project.caseStudy.chunks[]`가 되고, 덩어리는 섹션(문제 원인·해결 과정·결과)마다 요점(`points`)과 자세한 글(`detail`)을 함께 가진다. 덩어리 id 하나가 그림 파일, 웹 앵커, PDF 목록을 모두 가리킨다. `/export`는 사이트 틀 밖에서 A4 크기 쪽 상자를 직접 그리고, Playwright가 그 페이지를 PDF로 저장한다.

**Tech Stack:** Next.js 16.4.6(App Router, `output: "export"`), React 19, TypeScript 7, Tailwind CSS 4, Biome, vitest, Playwright, pnpm. 새 의존성은 없다.

**Spec:** `docs/superpowers/specs/2026-11-17-pdf-chunk-structure-design.md`. 이 계획은 그 문서의 0단계와 1단계를 다룬다. 2단계(웹 사례 페이지)는 다루지 않는다.

## Global Constraints

- 정적 export 설정을 유지한다: `output: "export"`, `trailingSlash: true`, 운영 `basePath: "/portfolio"`.
- Next.js 관련 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽는다(`AGENTS.md`). 이 계획에서 해당하는 문서는 Task 2에 적었다.
- 의존성을 더하지 않는다.
- 글 규칙: 데이터에 없는 사실과 숫자를 만들지 않는다. 기존 글의 문구를 바꾸려면 먼저 제안하고 사용자 승인을 받는다. 이 계획에서 승인된 문구 변경은 Task 3의 목록뿐이다.
- 수 표기는 "읽는 대로"다(설계 문서 8절). 한, 두, 세로 읽는 한 자리 개수는 한글로 쓰고 띄어 쓴다(한 곳, 두 화면). 일, 이, 삼으로 읽는 수와 10 이상, 잰 값은 숫자로 쓴다(1초, 11곳).
- 검사는 늘리지 않는다. 새로 만드는 확인은 Task 6의 넘침 확인 하나다. 나머지는 PDF를 쪽마다 열어 눈으로 확인한다.
- 사이트 문구는 한국어 존댓말 평서문이다. 코드 스타일은 Biome 규칙과 기존 컴포넌트의 방식을 따른다.
- 커밋과 브랜치는 실행 전에 사용자에게 확인한다. 허락받으면 Task마다 한 번 커밋한다. 메시지는 저장소 관례(`feat: …함`, 한국어)를 따르고 끝에 `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`를 붙인다.

## Review Focus

사용자가 검사를 줄이기로 했으므로, 아래 다섯 가지는 영구 테스트가 아니라 해당 Task의 확인 단계로 잡는다. 넘침만 빌드에 남는다.

1. 데이터를 옮기는 중 글자가 바뀐다(따옴표, 역슬래시, 문단 나눔). 기대: 덩어리 16개의 글이 한 글자도 다르지 않다. Task 1의 Step 1과 Step 7이 잡는다.
2. 요점이 길어 쪽 상자를 넘친다. 기대: 잘린 PDF가 만들어지지 않고 어느 덩어리인지 알려 준다. Task 6의 Step 6과 Step 8이 잡는다.
3. 요점이나 그림이 없는 덩어리가 PDF 목록에 들어간다. 기대: 빌드가 그 id를 말하며 멈춘다. Task 5의 Step 1이 잡는다.
4. 사이트 틀을 옮긴 뒤 404나 하위 페이지에서 메뉴·푸터가 사라지거나, `/export`에 메뉴가 남는다. Task 2의 Step 6이 잡는다.
5. 운영 `basePath`에서 PDF의 그림이 안 나오거나 제목 링크가 상대 주소가 된다. 기대: 그림이 보이고 링크는 `https://reasonjun.github.io/portfolio/…`다. Task 6의 Step 7이 잡는다.

---

## File Structure

| 파일 | 하는 일 | Task |
|---|---|---|
| `app/types/project.ts` | `ChunkId`, `ChunkSection`, `ChunkFigure`, `Chunk`, `CaseStudy.chunks`. `DiagramId`, `CaseVisual`, `CaseProblem`은 없앤다 | 1 |
| `data/projects.ts` | 새 모양의 사례 데이터. 이후 수 표기, 요점, 새 그림 정보가 들어간다 | 1, 3, 4, 7 |
| `lib/projects.ts` | `chunkFigureSrc`, `getPdfChunks`, `PdfChunk`. `getPdfProjects`는 없앤다 | 1, 5, 6 |
| `lib/content-check.ts` | 새 모양에 맞춘 빈칸·백틱 검사 | 1 |
| `components/case-study/case-study-body.tsx` | 웹 사례 본문. 새 모양을 읽고, 덩어리 블록에 앵커를 단다 | 1, 5, 8 |
| `components/case-study/diagram-view.tsx` | 웹 그림(눌러서 확대). 덩어리의 `id`와 `figure`를 받는다 | 1 |
| `components/case-study/{case-visual,code-block,metrics-card,diagrams}.ts(x)` | 삭제 | 1 |
| `components/site-shell.tsx` (새 파일) | 메뉴, 본문 틀, 푸터, 본문 바로가기 | 2 |
| `app/(site)/layout.tsx` (새 파일) | 사이트 페이지에 `SiteShell`을 씌운다. `app/page.tsx`, `app/archive/`, `app/projects/`가 이 그룹으로 옮겨 온다 | 2 |
| `app/layout.tsx`, `app/not-found.tsx` | 루트는 `<html>`·`<body>`·글꼴만. 404는 `SiteShell`로 감싼다 | 2 |
| `data/experiences.ts`, `public/diagrams/*.drawio.svg` 4개 | 수 표기 통일 | 3 |
| `data/project-lists.ts` | `PDF_CHUNK_IDS`. `PDF_PROJECT_IDS`는 없앤다 | 5, 6, 7 |
| `components/case-study/chunk-points.tsx` (새 파일) | 요점 세 칸. PDF가 쓰고, 2단계에서 웹도 쓴다 | 6 |
| `components/portfolio/hero-lego/hero-lego-still.tsx` (새 파일) | 표지에 쓰는 움직이지 않는 레고 장면 | 6 |
| `app/export/paper.css` (새 파일) | `@page`, 종이 범위(색·글자 크기), 쪽 상자 배치 | 6 |
| `app/export/page.tsx` | 표지와 덩어리 쪽 | 6 |
| `scripts/generate-pdf.mjs` | CSS 쪽 크기를 따르고, 넘침이 있으면 PDF를 만들지 않는다 | 6 |
| `public/diagrams/first-load-lcp.drawio.svg` (새 파일) | LCP 덩어리의 그림 | 7 |
| `app/globals.css`, `navbar.tsx`, `footer.tsx`, `skip-link.tsx`, `zoomable-image.tsx` | 옛 인쇄 코드 삭제 | 8 |

버리는 스크립트와 비교용 파일은 저장소 밖 임시 폴더에 둔다. 아래에서는 그 폴더를 `$SCRATCH`라고 쓴다.

---

## 0단계

### Task 1: 데이터와 그림 연결을 덩어리 모양으로 옮긴다

화면과 PDF는 바뀌지 않는다. 요점은 아직 쓰지 않는다.

**Files:**
- Modify: `app/types/project.ts`, `data/projects.ts`, `lib/projects.ts`, `lib/content-check.ts`, `components/case-study/case-study-body.tsx`, `components/case-study/diagram-view.tsx`
- Delete: `components/case-study/case-visual.tsx`, `code-block.tsx`, `metrics-card.tsx`, `diagrams.ts`
- Test: `lib/content-check.test.ts`, `lib/projects.test.ts`, `lib/data.test.ts`

**Interfaces:**
- Produces: `ChunkId`, `Chunk`, `ChunkSection`, `ChunkFigure`(`@/app/types/project`), `CaseStudy.chunks: Chunk[]`, `chunkFigureSrc(id: ChunkId): string`(`@/lib/projects`), `DiagramView({ id, figure }: { id: ChunkId; figure: ChunkFigure })`.

- [ ] **Step 1: 기준선을 뽑는다**

`$SCRATCH/dump-chunks.mjs`를 만든다. 옛 모양과 새 모양을 모두 읽어 같은 형식으로 찍는다.

```js
// 버리는 스크립트. 사용: node dump-chunks.mjs <저장소>/data/projects.ts [<저장소>/components/case-study/diagrams.ts]
const { PROJECTS_DATA } = await import(process.argv[2]);
const { DIAGRAMS = {} } = process.argv[3] ? await import(process.argv[3]) : {};
const paragraphs = (value) => (typeof value === "string" ? value.split(/\n{2,}/) : value.detail);
for (const project of PROJECTS_DATA) {
  for (const chunk of project.caseStudy?.chunks ?? project.caseStudy?.problems ?? []) {
    const figureId = chunk.figure ? chunk.id : chunk.visual?.id;
    console.log(`## ${project.id} ${figureId ?? "(그림 없음)"}`);
    console.log(`제목: ${chunk.title}`);
    for (const key of ["problem", "solution", "result"])
      for (const paragraph of paragraphs(chunk[key])) console.log(`${key}: ${paragraph}`);
    console.log(`그림 설명: ${chunk.figure?.caption ?? chunk.visual?.caption ?? ""}`);
    console.log(`대체 텍스트: ${chunk.figure?.alt ?? DIAGRAMS[figureId]?.alt ?? ""}`);
  }
}
```

Run:
```bash
node $SCRATCH/dump-chunks.mjs "$PWD/data/projects.ts" "$PWD/components/case-study/diagrams.ts" > $SCRATCH/before-chunks.txt
pnpm build && pdftotext out/portfolio.pdf $SCRATCH/before-pdf.txt && pdfinfo out/portfolio.pdf | grep Pages
```
Expected: `before-chunks.txt`에 `## `로 시작하는 줄이 16개이고, PDF는 `Pages: 29`다.

- [ ] **Step 2: `app/types/project.ts`의 타입을 바꾼다**

`DiagramId`, `CaseVisual`, `CaseProblem`을 지우고 아래를 넣는다. `CaseStudy`의 `problems: CaseProblem[]`은 `chunks: Chunk[]`가 된다.

```ts
// 덩어리 id. 그림 파일 이름(public/diagrams/<id>.drawio.svg), 웹 앵커(#id), PDF 목록이 모두 이 값을 쓴다.
export type ChunkId =
  | "blue-green-deploy" | "bff-auth-flow" | "msw-mock-switch"
  | "settlement-domain-config" | "s3-cache-policy"
  | "e2e-regression-baseline" | "ai-agent-guardrails" | "vite-rolldown-chunks" | "content-form-unify"
  | "nextauth-token-refresh"
  | "design-token-pipeline" | "chromatic-visual-test"
  | "ckeditor-virtual-scroll" | "a11y-export-check"
  | "first-load-lcp" | "fabric-group-batch-add";

export interface ChunkSection {
  // PDF에 나오는 짧은 글. 섹션마다 3개 이상 쓴다. 웹은 2단계부터 쓴다.
  points?: string[];
  // 자세한 글. 문단마다 한 항목이다.
  detail: string[];
}

export interface ChunkFigure {
  alt: string;
  caption: string;
}

// 문제 해결 사례 하나. 웹 사례 카드와 PDF의 한 쪽이 이 단위다.
export interface Chunk {
  id: ChunkId;
  title: string;
  figure?: ChunkFigure;
  problem: ChunkSection;
  solution: ChunkSection;
  result: ChunkSection;
}
```

- [ ] **Step 3: `data/projects.ts`를 새 모양으로 다시 쓴다**

파일에 주석이 없어서, 데이터를 읽어 바꾼 뒤 통째로 다시 써도 잃는 것이 없다. `$SCRATCH/migrate.mjs`:

```js
// 버리는 스크립트. 사용: node migrate.mjs <저장소>
import { writeFileSync } from "node:fs";
const root = process.argv[2];
const { PROJECTS_DATA } = await import(`${root}/data/projects.ts`);
const { DIAGRAMS } = await import(`${root}/components/case-study/diagrams.ts`);
const section = (text) => ({ detail: text.split(/\n{2,}/) });
const toChunk = ({ title, problem, solution, result, visual }) => ({
  id: visual?.id ?? "first-load-lcp", // 그림이 없는 문제는 LCP 사례 하나뿐이다
  title,
  ...(visual && { figure: { alt: DIAGRAMS[visual.id].alt, caption: visual.caption } }),
  problem: section(problem),
  solution: section(solution),
  result: section(result),
});
const projects = PROJECTS_DATA.map((project) => {
  if (!project.caseStudy) return project;
  const { problems, ...rest } = project.caseStudy;
  return { ...project, caseStudy: { ...rest, chunks: problems.map(toChunk) } };
});
writeFileSync(
  `${root}/data/projects.ts`,
  `import type { Project } from "@/app/types/project";\n\nexport const PROJECTS_DATA: Project[] = ${JSON.stringify(projects, null, 2)};\n`,
);
```

Run: `node $SCRATCH/migrate.mjs "$PWD" && pnpm exec biome format --write data/projects.ts`
Expected: `grep -c 'id: "first-load-lcp"' data/projects.ts`가 1이고, `grep -c "problems:" data/projects.ts`가 0이다.

- [ ] **Step 4: `lib/projects.ts`에 `chunkFigureSrc(id: ChunkId): string`을 더한다**

`/diagrams/${id}.drawio.svg`를 돌려준다. 그림 경로를 만드는 곳은 이 함수 하나다.

- [ ] **Step 5: 데이터를 읽는 코드를 맞춘다**

- `components/case-study/diagram-view.tsx`: props를 `{ id: ChunkId; figure: ChunkFigure }`로 바꾼다. `src`는 `chunkFigureSrc(id)`, `alt`와 설명은 `figure`에서 읽는다. 마크업은 그대로 둔다.
- `components/case-study/case-study-body.tsx`: `ProblemBlock`을 `ChunkBlock({ chunk }: { chunk: Chunk })`으로 바꾼다. 그림은 `chunk.figure`가 있을 때 `<DiagramView id={chunk.id} figure={chunk.figure} />`로 그린다. "문제 확인", "해결 과정", "결과"는 각 섹션의 `detail`을 문단마다 `<p>`로 그린다. 지금 해결 과정을 그리는 방식(`space-y-[1lh]` 묶음)을 세 섹션에 똑같이 써도 된다. 문제 확인과 결과는 문단이 하나라서 화면이 달라지지 않는다. `keepTogether`를 계산하던 글자 수는 세 섹션 `detail`의 글자 수 합으로 구한다. 목록의 `key`는 `chunk.id`다.
- `components/case-study/case-visual.tsx`, `code-block.tsx`, `metrics-card.tsx`, `diagrams.ts`를 지운다.
- `lib/content-check.ts`: 순회 대상을 `caseStudy.chunks`로 바꾼다. 섹션의 `detail`에 글이 있는 문단이 하나도 없으면 `${id}: chunks[${index}].problem 비어 있음`(solution, result도 같은 꼴)을 낸다. 백틱 짝은 세 섹션 모두 문단마다 보고, 그림 설명의 경로는 `chunks[${index}].figure.caption`이다. 요점(`points`)은 검사하지 않는다.

- [ ] **Step 6: 테스트를 새 모양에 맞춘다**

- `lib/content-check.test.ts`: `makeProblem`을 `makeChunk`으로 바꾸고 기본값을 `{ id: "blue-green-deploy", title: "문제 제목", problem: { detail: ["무엇이 위험했는가"] }, solution: { detail: ["해결 과정"] }, result: { detail: ["결과"] } }`로 둔다. 기대 문자열의 `problems[0]`은 `chunks[0]`이 된다. "해결 과정은 빈 줄로 나눈 문단마다 백틱 짝을 본다" 테스트의 입력은 `solution: { detail: ["첫 문단 \`a", "둘째 문단 b\`"] }`다.
- `lib/projects.test.ts`: 픽스처의 `problems: []`를 `chunks: []`로 바꾼다.
- `lib/data.test.ts`: "법무관리 프로젝트의 문제에 배포와 인증 흐름 도식이 연결되어 있다"는 그 프로젝트에서 `figure`가 있는 덩어리의 `id`가 `["blue-green-deploy", "bff-auth-flow", "msw-mock-switch"]`인지 본다. 나머지 테스트는 그대로다.

- [ ] **Step 7: 바뀐 것이 없는지 확인한다**

Run:
```bash
pnpm exec tsc --noEmit && pnpm test && pnpm lint
node $SCRATCH/dump-chunks.mjs "$PWD/data/projects.ts" > $SCRATCH/after-chunks.txt && diff $SCRATCH/before-chunks.txt $SCRATCH/after-chunks.txt && echo "글 동일"
pnpm build && pdftotext out/portfolio.pdf $SCRATCH/after-pdf.txt && diff $SCRATCH/before-pdf.txt $SCRATCH/after-pdf.txt && echo "PDF 글 동일" && pdfinfo out/portfolio.pdf | grep Pages
grep -rnE "DiagramId|DIAGRAMS|CaseVisual|CaseProblem|CodeBlock|MetricsCard" app components lib data ; echo "남은 이름 없음(위가 비어 있어야 함)"
```
Expected: 타입 검사·테스트(69개)·린트 통과, "글 동일", "PDF 글 동일", `Pages: 29`, 마지막 `grep`은 아무것도 찍지 않는다. 그리고 `pnpm dev`로 `/projects/enterprise-legal-management/`와, PDF에 실리지 않아 위 비교에 들어가지 않는 `/projects/ats-monitoring-system/`을 열어 그림과 글이 전과 같은지 본다.

- [ ] **Step 8: 커밋**

`feat: 사례 데이터를 덩어리 단위(섹션별 요점·자세한 글)로 옮기고 그림을 덩어리 id로 찾게 함`

---

## 1단계

### Task 2: 사이트 틀을 `(site)` 그룹으로 옮긴다

**Files:**
- Create: `components/site-shell.tsx`, `app/(site)/layout.tsx`
- Move: `app/page.tsx` → `app/(site)/page.tsx`, `app/archive/` → `app/(site)/archive/`, `app/projects/` → `app/(site)/projects/`
- Modify: `app/layout.tsx`, `app/not-found.tsx`

**Interfaces:**
- Produces: `SiteShell({ children }: { children: ReactNode })`(`@/components/site-shell`). `app/export/`는 루트 레이아웃만 받는다.

- [ ] **Step 1: Next 문서를 읽는다**

`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/`의 `route-groups.md`, `layout.md`, `not-found.md`. 확인할 것은 두 가지다. 그룹 폴더가 주소에 나오지 않는다는 것과, 루트 `app/not-found.tsx`가 맞는 경로가 없는 모든 주소를 맡는다는 것이다.

- [ ] **Step 2: `components/site-shell.tsx`를 만든다**

지금 `app/layout.tsx`의 `<body>` 안에 있는 것을 그대로 옮긴다. `<SkipLink />`, 그리고 `<div className="flex min-h-svh flex-col">` 안의 `<Navbar />`, `<main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-6 focus:outline-none">{children}</main>`, `<Footer />`다.

- [ ] **Step 3: `app/(site)/layout.tsx`를 만들고 페이지를 옮긴다**

레이아웃은 `<SiteShell>{children}</SiteShell>`만 돌려준다. 페이지는 `git mv`로 옮긴다. `app/types/`, `app/export/`, `app/not-found.tsx`, `app/globals.css`, `app/favicon.ico`는 옮기지 않는다.

- [ ] **Step 4: `app/layout.tsx`를 줄인다**

`<html>`(글꼴 변수 클래스), `<body className="antialiased">{children}</body>`, 메타데이터만 남긴다. `Navbar`, `Footer`, `SkipLink` import를 지운다.

- [ ] **Step 5: `app/not-found.tsx`를 `SiteShell`로 감싼다**

"네비·푸터는 루트 레이아웃이 그린다"는 주석을, 루트 404는 그룹 밖이라 `SiteShell`을 직접 쓴다는 내용으로 고친다.

- [ ] **Step 6: 확인한다**

Run:
```bash
pnpm exec tsc --noEmit && pnpm test && pnpm lint && pnpm build:site
for f in out/index.html out/archive/index.html out/projects/enterprise-legal-management/index.html out/404.html; do echo "$f 메뉴 $(grep -c 'aria-label="주 메뉴"' $f) 본문틀 $(grep -c 'id="main-content"' $f)"; done
echo "export 메뉴 $(grep -c 'aria-label="주 메뉴"' out/export/index.html)"
```
Expected: 네 파일 모두 메뉴 1, 본문틀 1. `export 메뉴 0`. `pnpm dev`로 홈과 사례 페이지 하나를 열어 화면이 전과 같은지 본다.

옛 `/export`는 본문 틀이 빠지면서 쪽 나눔이 조금 달라질 수 있다. Task 6에서 통째로 바꾸므로 문제 삼지 않는다.

- [ ] **Step 7: 커밋**

`feat: 메뉴·본문 틀·푸터를 SiteShell로 묶고 사이트 페이지를 (site) 그룹으로 옮겨 export가 빈 종이에서 시작하게 함`

### Task 3: 수 표기를 통일한다

설계 문서 8절 "수 표기를 통일할 곳"의 표를 그대로 적용한다. 사용자가 승인한 목록이고, 목록에 없는 문구는 건드리지 않는다.

**Files:**
- Modify: `data/projects.ts`(글 17행과 대체 텍스트 5행), `data/experiences.ts`(1행), `public/diagrams/content-form-unify.drawio.svg`, `design-token-pipeline.drawio.svg`, `e2e-regression-baseline.drawio.svg`, `vite-rolldown-chunks.drawio.svg`

- [ ] **Step 1: 글과 대체 텍스트를 고친다**

표의 "지금"을 "바꾼 뒤"로 바꾼다. Task 1 뒤로 대체 텍스트는 `data/projects.ts`의 `figure.alt`에 있다. `content-form-unify`의 "5개 화면에 복제돼"는 제목과 해결 과정에 한 번씩, 대체 텍스트의 "5개 화면이"는 두 번 나온다.

- [ ] **Step 2: 그림 안 글자를 고친다**

`.drawio.svg`에는 같은 글자가 두 곳에 있다. draw.io가 다시 열 때 쓰는 원본(`content` 속성)과 브라우저가 그리는 부분이다. 파일 안에서 아래 문자열을 모두 바꾸면 두 곳이 함께 바뀐다.

| 파일 | 지금 | 바꾼 뒤 |
|---|---|---|
| `content-form-unify` | `기준: 5곳 → 1곳` | `기준: 다섯 곳 → 한 곳` |
| `content-form-unify` | `기준 1곳` | `기준 한 곳` |
| `design-token-pipeline` | `변수 4개가 함께 바뀜` | `변수 네 개가 함께 바뀜` |
| `e2e-regression-baseline` | `순수 함수 모듈 1곳` | `순수 함수 모듈 한 곳` |
| `e2e-regression-baseline` | `2곳 → 1곳` | `두 곳 → 한 곳` |
| `vite-rolldown-chunks` | `번들러 2개` | `번들러 두 개` |

- [ ] **Step 3: 확인한다**

Run:
```bash
grep -nE "3개 정산 유형|3개 유형으로|설정 파일 3개|1곳으로|4개 축|2곳에서|단언 7건|5개 화면|5곳에서|브랜드 색 1곳|변수 4개|레이아웃 3개" data/projects.ts; grep -n "앱 6개" data/experiences.ts
grep -cE "5곳|기준 1곳|변수 4개|모듈 1곳|2곳 → 1곳|번들러 2개" public/diagrams/{content-form-unify,design-token-pipeline,e2e-regression-baseline,vite-rolldown-chunks}.drawio.svg
pnpm test && pnpm lint
```
Expected: 앞의 두 `grep`은 아무것도 찍지 않고, 셋째는 네 파일 모두 `0`이다. 그리고 `pnpm dev`로 네 그림이 있는 사례 페이지를 열어, 바꾼 글자가 상자 밖으로 넘치지 않는지 본다.

- [ ] **Step 4: 커밋**

`feat: 한 자리 개수를 읽는 대로 한글로 적어 수 표기를 통일함`

### Task 4: `blue-green-deploy`의 요점을 써서 형식을 확정한다

**Files:**
- Modify: `data/projects.ts`

- [ ] **Step 1: 초안을 쓴다**

`blue-green-deploy`의 `detail`만 근거로 쓴다. 규칙은 설계 문서 8절의 "요점을 쓰는 규칙"이다.

- 문제 원인, 해결 과정, 결과마다 3개 이상. 상한은 없고, 한 쪽에 들어가는 만큼이 한도다.
- 요점 하나는 한두 줄. 명사로 끝나는 개조식.
- 문제 원인에는 증상만이 아니라 원인까지.
- 자세한 글에 없는 사실과 숫자는 넣지 않는다. 수 표기는 자세한 글과 같게.

- [ ] **Step 2: 사용자에게 보여 주고 승인받는다**

초안을 대화에 그대로 보여 준다. 고칠 곳을 반영한 뒤 승인을 받는다. 이 덩어리의 형식이 나머지 8개의 기준이 된다.

- [ ] **Step 3: 승인된 요점을 `problem.points`, `solution.points`, `result.points`에 넣는다**

Run: `pnpm exec tsc --noEmit && pnpm test`
Expected: 통과.

- [ ] **Step 4: 커밋**

`feat: blue/green 배포 덩어리에 PDF용 요점을 넣음`

### Task 5: PDF 목록을 덩어리 단위로 만들고 웹에 앵커를 단다

**Files:**
- Modify: `data/project-lists.ts`, `lib/projects.ts`, `components/case-study/case-study-body.tsx`
- Test: `lib/data.test.ts`

**Interfaces:**
- Consumes: `Chunk`, `ChunkId`, `ChunkFigure`(Task 1).
- Produces: `PDF_CHUNK_IDS: ChunkId[]`(`@/data/project-lists`), `PdfChunk`, `getPdfChunks(): { project: CaseStudyProject; chunk: PdfChunk }[]`(`@/lib/projects`). 웹 덩어리 블록의 `id`는 덩어리 id다.

- [ ] **Step 1: 테스트를 쓴다**

`lib/data.test.ts`에 더한다.

```ts
it("PDF 목록의 덩어리는 모두 실을 수 있다", () => {
  expect(() => getPdfChunks()).not.toThrow();
  expect(getPdfChunks().map(({ chunk }) => chunk.id)).toEqual(PDF_CHUNK_IDS);
});
```

Run: `pnpm test`
Expected: FAIL. `getPdfChunks`와 `PDF_CHUNK_IDS`가 없다.

- [ ] **Step 2: `data/project-lists.ts`에 `PDF_CHUNK_IDS`를 더한다**

`export const PDF_CHUNK_IDS: ChunkId[] = ["blue-green-deploy"];` 주석에는 적힌 순서가 PDF의 쪽 순서이고, 요점과 그림이 있는 덩어리만 넣을 수 있다고 적는다. `PDF_PROJECT_IDS`는 옛 export 페이지가 쓰고 있으므로 Task 6까지 둔다.

- [ ] **Step 3: `lib/projects.ts`에 `PdfChunk`와 `getPdfChunks`를 더한다**

```ts
type PdfSection = ChunkSection & { points: string[] };
// PDF에 실을 수 있는 덩어리. 그림과 세 섹션의 요점이 반드시 있다.
export type PdfChunk = Chunk & { figure: ChunkFigure; problem: PdfSection; solution: PdfSection; result: PdfSection };

export const getPdfChunks = (
  ids: ChunkId[] = PDF_CHUNK_IDS,
  projects: Project[] = PROJECTS_DATA,
): { project: CaseStudyProject; chunk: PdfChunk }[]
```

목록 순서대로 돌려준다. id에 해당하는 덩어리가 없으면 `${id}: 덩어리가 없음`을, 그림이 없거나 세 섹션 중 요점이 비어 있는 곳이 있으면 `${id}: 그림이나 요점이 없어 PDF에 실을 수 없음`을 던진다.

- [ ] **Step 4: 웹 덩어리 블록에 앵커를 단다**

`case-study-body.tsx`의 `ChunkBlock`이 그리는 `<section>`에 `id={chunk.id}`를 준다. 고정 메뉴에 가려지지 않게 하는 일은 `app/globals.css`의 `scroll-padding-top`이 이미 한다.

- [ ] **Step 5: 확인한다**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm lint`
Expected: 통과. `pnpm dev`로 `/projects/enterprise-legal-management/#blue-green-deploy`를 열어 덩어리 제목이 메뉴 아래에 보이는지 본다.

- [ ] **Step 6: 커밋**

`feat: PDF 목록을 덩어리 단위로 만들고 웹 사례의 덩어리에 앵커를 닮`

### Task 6: PDF 문서를 A4 쪽 상자로 다시 만든다

**Files:**
- Create: `components/case-study/chunk-points.tsx`, `components/portfolio/hero-lego/hero-lego-still.tsx`, `app/export/paper.css`
- Modify: `app/export/page.tsx`, `scripts/generate-pdf.mjs`, `lib/projects.ts`, `data/project-lists.ts`
- Test: `lib/data.test.ts`

**Interfaces:**
- Consumes: `getPdfChunks`, `PdfChunk`(Task 5), `chunkFigureSrc`(Task 1), `getMainTech`, `joinMeta`, `renderInlineCode`, `keepLineStart`, `getPublicImageSize`, `withBasePath`, `PROFILE`.
- Produces: `ChunkPoints({ chunk }: { chunk: PdfChunk })`, `HeroLegoStill()`. 쪽 상자는 `data-sheet` 속성으로 찾는다. 값은 표지가 `cover`, 덩어리 쪽이 덩어리 id다.

- [ ] **Step 1: `components/case-study/chunk-points.tsx`를 만든다**

칸 이름 "문제 원인", "해결 과정", "결과"와 각 칸의 요점 목록을 그린다. 요점은 `renderInlineCode`로 그린다. 여백과 글자 크기는 쓰는 쪽의 CSS가 정하도록 클래스만 붙인다(`chunk-points`).

- [ ] **Step 2: `components/portfolio/hero-lego/hero-lego-still.tsx`를 만든다**

`hero-lego.tsx`가 불러오는 스타일 두 개(`@/components/iso/iso.css`, `./hero-lego.css`)를 불러오고 `<div className="hero-lego iso" aria-hidden="true">{SCENE}</div>`를 돌려준다. `"use client"`를 붙이지 않는다. `.hero-lego.iso`는 부모를 꽉 채우는 절대 배치라서, 쓰는 쪽이 `position: relative`와 크기를 가진 상자로 감싼다. 장면의 비율은 540:520이다.

- [ ] **Step 3: `app/export/paper.css`를 만든다**

```css
/* PDF 문서 전용. 화면과 인쇄에서 똑같이 보이도록 @media print에 기대지 않는다. */
@page { size: A4; margin: 0; }

/* 종이 범위: 흰 종이에 남색 잉크 */
.paper {
  --background: #ffffff; --foreground: #141a33;
  --card: #ffffff; --card-foreground: #141a33;
  --muted: #f1f3f9; --muted-foreground: #444d70;
  --secondary: #f1f3f9; --secondary-foreground: #141a33;
  --accent: #f1f3f9; --accent-foreground: #141a33;
  --primary: #141a33; --primary-foreground: #ffffff;
  --border: #b5b8c4;
  color: var(--foreground);
  font-size: 11pt;
  line-height: 1.7;
}
.paper :not(pre) > code { white-space: nowrap; font-size: 0.88em; padding: 0 2px; border-radius: 2px; background: var(--muted); }

/* 쪽 상자: 높이가 고정이라 글이 넘쳐도 쪽 수는 늘지 않는다. 넘침은 scripts/generate-pdf.mjs가 막는다. */
.sheet {
  box-sizing: border-box; width: 210mm; height: 297mm; padding: 16mm 14mm 12mm;
  display: flex; flex-direction: column; gap: 4mm;
  background: var(--background); break-after: page;
}
.sheet:last-child { break-after: auto; }
.sheet-meta { font-size: 9pt; color: var(--muted-foreground); border-bottom: 1px solid var(--border); padding-bottom: 2mm; }
.sheet-title { font-size: 15pt; font-weight: 600; line-height: 1.4; }
.sheet-title a { color: inherit; text-decoration: none; }
/* 그림은 원래 비율(인라인 aspect-ratio)로 놓고, 자리가 모자랄 때만 줄어든다. */
.sheet-figure { flex: 0 1 auto; min-height: 0; width: 100%; }
.sheet-figure img { display: block; width: 100%; height: 100%; object-fit: contain; }
.sheet-caption { font-size: 9.5pt; color: var(--muted-foreground); }
.sheet-foot { margin-top: auto; display: flex; justify-content: space-between; font-size: 8pt; color: var(--muted-foreground); }

/* 화면 미리보기에서만 낱장처럼 띄운다. */
@media screen {
  .paper { display: grid; justify-content: center; gap: 8mm; padding: 8mm 0; }
  .sheet { box-shadow: 0 0 0 1px var(--border); }
}
```

치수와 글자 크기는 시작값이다. Step 7에서 실제 글꼴로 본 뒤 고친다. 넘친 글은 숨기지 않는다. 미리보기에서 넘친 것이 보여야 하기 때문이다.

- [ ] **Step 4: `app/export/page.tsx`를 다시 쓴다**

`./paper.css`를 불러온다. `metadata`는 그대로 둔다. `CaseStudyBody`, `Positioning`, `EXPERIENCES_DATA`, 쪽 여백 상자용 `<style>`은 쓰지 않는다. 구조는 다음과 같다.

```tsx
<div className="paper">
  <section className="sheet" data-sheet="cover">
    {/* 이름(PROFILE.name, h1), "프론트엔드 포트폴리오", <HeroLegoStill />을 감싼 상자, 사이트 주소 링크(href는 PROFILE.siteUrl) */}
  </section>
  {chunks.map(({ project, chunk }, index) => (
    <section key={chunk.id} className="sheet" data-sheet={chunk.id}>
      <header className="sheet-meta">
        {/* joinMeta(project.title, project.company, project.period, project.caseStudy.team), 다음 줄에 getMainTech(project.techStack).join(" · ") */}
      </header>
      <h2 className="sheet-title">
        <a href={`${PROFILE.siteUrl}projects/${project.id}/#${chunk.id}`}>{keepLineStart(chunk.title)}</a>
      </h2>
      <figure className="sheet-figure" style={{ aspectRatio: `${size.width} / ${size.height}` }}>
        {/* next/image의 Image. src는 withBasePath(chunkFigureSrc(chunk.id)), alt는 chunk.figure.alt, 크기는 getPublicImageSize(chunkFigureSrc(chunk.id)), loading="eager" */}
      </figure>
      <p className="sheet-caption">{renderInlineCode(chunk.figure.caption)}</p>
      <ChunkPoints chunk={chunk} />
      <footer className="sheet-foot">
        <span>{PROFILE.name} · 프론트엔드 포트폴리오</span>
        <span>{index + 2} / {chunks.length + 1}</span>
      </footer>
    </section>
  ))}
</div>
```

표지에는 꼬리말을 두지 않는다. 레고 그림은 흰 바탕에 두고 이름보다 작게 한다. 표지의 배치는 Step 7에서 보고 정한다.

- [ ] **Step 5: 옛 PDF 목록을 없앤다**

`lib/projects.ts`에서 `getPdfProjects`를, `data/project-lists.ts`에서 `PDF_PROJECT_IDS`와 그 주석을 지운다. `lib/data.test.ts`는 이렇게 바꾼다.

- "홈·PDF 목록은 사례가 있는 프로젝트만 중복 없이 가리킨다": 홈 목록만 본다. 이름도 홈 목록에 맞게 고친다.
- "PDF 목록의 사례는 빈칸 없이 다 쓴 것이다": 지운다. `getPdfChunks`가 요점과 그림이 없는 덩어리를 받지 않는다.
- "다 쓴 사례 중 PDF에 없는 것은 웹 전용으로 정한 사례뿐이다": 지운다. 덩어리를 골라 싣는 구조에서는 빠진 것이 실수가 아니다.

- [ ] **Step 6: `scripts/generate-pdf.mjs`를 고친다**

- 시작할 때 `out/portfolio.pdf`를 지운다(`rm`, `force: true`). 실패했을 때 옛 파일이 남지 않게 하기 위해서다.
- 글꼴과 그림을 기다린 뒤, PDF를 쓰기 전에 넘침을 본다.

```js
const overflowing = await page.$$eval("[data-sheet]", (sheets) =>
  sheets
    .filter((sheet) => sheet.scrollHeight > sheet.clientHeight + 1)
    .map((sheet) => `${sheet.dataset.sheet}: ${sheet.scrollHeight - sheet.clientHeight}px 넘침`),
);
if (overflowing.length > 0) {
  throw new Error(`쪽 상자를 넘친 내용이 있어 PDF를 만들지 않음\n${overflowing.join("\n")}`);
}
```

- `page.pdf`는 `{ path: OUTPUT_PATH, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true }`로 부른다. `format`과 `margin`은 없앤다.

- [ ] **Step 7: PDF를 뽑아 쪽마다 본다**

Run:
```bash
pnpm exec tsc --noEmit && pnpm test && pnpm lint && pnpm build
pdfinfo out/portfolio.pdf | grep -E "Pages|Page size" && pdfinfo -url out/portfolio.pdf
pdftoppm -r 70 -png out/portfolio.pdf $SCRATCH/page
```
Expected: `Pages: 2`(표지와 `blue-green-deploy`), A4. 링크 목록에 `https://reasonjun.github.io/portfolio/`와 `https://reasonjun.github.io/portfolio/projects/enterprise-legal-management/#blue-green-deploy`가 있다.

`$SCRATCH/page-*.png`를 모두 열어 본다. 그림이 보이는지, 글이 꼬리말과 겹치지 않는지, 글자가 읽을 만한지, 표지가 허전하거나 그림이 이름보다 두드러지지 않는지 확인한다. 고칠 것은 `paper.css`와 표지 마크업에서 고친다. `pnpm dev`로 `/export/`를 열어 PDF와 같은 모습인지도 본다. PDF 뷰어의 책갈피에 이름과 덩어리 제목이 나오는지 확인한다.

- [ ] **Step 8: 넘침 확인이 실제로 막는지 본다**

`blue-green-deploy`의 `solution.points`에 긴 문장 40개를 임시로 더하고 `pnpm build:pdf`를 돌린다.
Expected: `blue-green-deploy: …px 넘침`을 찍고 실패하며 `out/portfolio.pdf`가 없다. 확인한 뒤 임시로 더한 것을 지운다(`git diff data/projects.ts`가 비어야 한다).

- [ ] **Step 9: 커밋**

`feat: PDF를 표지와 덩어리마다 한 쪽인 A4 쪽 상자 문서로 다시 만들고 넘친 글이 있으면 PDF를 만들지 않게 함`

### Task 7: 나머지 요점 8개와 새 그림을 넣는다

글 작업이다. 덩어리마다 사용자 승인을 받는다. 순서는 PDF 순서를 따른다.

**Files:**
- Modify: `data/projects.ts`, `data/project-lists.ts`
- Create: `public/diagrams/first-load-lcp.drawio.svg`

- [ ] **Step 1: 요점이 바로 나오는 덩어리 다섯 개를 쓴다**

`bff-auth-flow`, `e2e-regression-baseline`, `settlement-domain-config`, `design-token-pipeline`, `ckeditor-virtual-scroll`. 규칙은 Task 4와 같고, Task 4에서 승인된 형식을 따른다. `bff-auth-flow`는 결과 문단에 사실이 둘뿐이다. 같은 덩어리의 자세한 글에 있는 측정 조건(로컬 프로덕션 빌드, 만료 직전 세션, 동시 요청 10건)을 결과의 셋째 요점으로 쓴다.

덩어리마다 이렇게 한다. 초안을 사용자에게 보여 주고 승인받는다. `points`에 넣는다. `PDF_CHUNK_IDS`에 id를 더한다. `pnpm build` 뒤 그 쪽을 그림으로 뽑아 넘침과 그림 크기를 본다.

- [ ] **Step 2: `content-form-unify`는 자세한 글부터 보강한다**

자세한 글이 세 문장이고 결과는 한 문장이라 요점 3개가 나오지 않는다. 사용자에게 두 가지를 묻는다. 어느 화면의 규칙을 기준으로 맞췄는지, 통합한 뒤 무엇이 달라졌는지다. 답으로 `detail`에 더할 문장을 제안하고 승인받은 뒤 넣는다. 그다음 Step 1과 같은 순서로 요점을 쓴다. 답에 없는 사실은 쓰지 않는다.

- [ ] **Step 3: `fabric-group-batch-add`의 요점을 쓴다**

결과 문단에 사실이 둘뿐이다. 해결 과정에 있는 계산량(약 288만 번에서 2,400번, 코드 구조로 계산한 최대값)을 결과의 요점으로 쓴다. 이 덩어리의 "한 번"은 자세한 글이 한글로 쓰고 있으므로 요점도 한글로 쓴다.

- [ ] **Step 4: `first-load-lcp`의 그림을 만든다**

1. 그림에 넣을 내용을 글로 적어 사용자에게 보여 주고 승인받는다. 개선 전은 개발용 번들을 미국 리전 서버에서 받는 흐름이고, 개선 후는 운영 번들을 분할·지연 로딩으로 나눠 CloudFront 엣지에서 받는 흐름이다. 숫자(1분 이상, 1초, 약 46%, 14개 언어, 11곳)는 자세한 글에 있는 것만 쓴다.
2. 전후 비교 그림인 `vite-rolldown-chunks.drawio.svg`의 원본을 틀로 삼는다. 원본은 루트 `<svg>`의 `content` 속성에 HTML 이스케이프된 `mxfile`로 들어 있다. 꺼내서 `$SCRATCH/first-load-lcp.drawio`로 저장하고 내용을 바꾼다. 사각형과 글자만 쓰고 아이콘은 쓰지 않는다.
3. 내보낸다: `drawio -x -f svg -e --theme light -o public/diagrams/first-load-lcp.drawio.svg $SCRATCH/first-load-lcp.drawio`
4. 내보낸 파일의 `<switch>` 안에 PNG 폴백 `<image>`가 있으면 지운다(`grep -c "<image" public/diagrams/first-load-lcp.drawio.svg`가 0이어야 한다).
5. 대체 텍스트와 그림 설명을 써서 사용자 승인을 받고 `figure: { alt, caption }`으로 넣는다.

Run: `pnpm dev`로 `/projects/tactile-graphics-editor/`를 열어 그림이 보이는지 본다.

- [ ] **Step 5: `first-load-lcp`의 요점을 쓴다**

결과 문단에 사실이 둘뿐이다. 측정 조건(캐시를 비운 첫 접속, 운영 환경, 데스크톱 Lighthouse LCP)을 결과의 요점으로 쓴다. 문제 원인에는 해결 과정 문단에 있는 원인(운영 설정 파일의 `NODE_ENV=development` 때문에 개발용 번들이 배포됨)을 쓴다.

- [ ] **Step 6: 목록을 완성하고 전체를 본다**

`PDF_CHUNK_IDS`를 설계 문서 6.3의 순서로 맞춘다: `blue-green-deploy`, `bff-auth-flow`, `e2e-regression-baseline`, `content-form-unify`, `settlement-domain-config`, `design-token-pipeline`, `ckeditor-virtual-scroll`, `first-load-lcp`, `fabric-group-batch-add`.

Run:
```bash
pnpm exec tsc --noEmit && pnpm test && pnpm lint && pnpm build
pdfinfo out/portfolio.pdf | grep Pages && pdfinfo -url out/portfolio.pdf | grep -c "#"
pdftoppm -r 70 -png out/portfolio.pdf $SCRATCH/final
```
Expected: `Pages: 10`, 덩어리 링크 9개. `$SCRATCH/final-*.png` 10장을 모두 열어 넘침, 글자 크기, 그림 크기를 확인한다. 그림이 읽기 어려울 만큼 작아진 쪽이 있으면 그 덩어리의 요점을 줄이는 안을 사용자에게 제안한다.

- [ ] **Step 7: 커밋**

덩어리마다 나눠 커밋해도 된다. 메시지 예: `feat: 가상 스크롤 덩어리에 PDF용 요점을 넣고 PDF 목록에 더함`

### Task 8: 옛 인쇄 코드를 지우고 마무리한다

새 PDF는 `@media print`와 `print:` 클래스에 기대지 않는다. 설계 문서 6.8의 표대로 지운다.

**Files:**
- Modify: `app/globals.css`, `components/case-study/case-study-body.tsx`, `components/case-study/diagram-view.tsx`, `components/case-study/zoomable-image.tsx`, `components/portfolio/navbar.tsx`, `components/portfolio/footer.tsx`, `components/skip-link.tsx`

- [ ] **Step 1: 지우기 전 모습을 남긴다**

Run: `pdftotext out/portfolio.pdf $SCRATCH/pdf-before-cleanup.txt && pdftoppm -r 70 -png out/portfolio.pdf $SCRATCH/cleanup-before`

- [ ] **Step 2: 지운다**

- `app/globals.css`: `@media print` 블록 두 개를 통째로 지운다. 종이 색과 글자 크기는 Task 6에서 `paper.css`로 이미 옮겼다.
- `case-study-body.tsx`: `KEEP_TOGETHER_MAX_CHARS`, `keepTogether`와 그 계산, `print:`로 시작하는 클래스, `break-after-avoid`와 `break-inside-avoid` 클래스, 인쇄를 설명하는 주석을 지운다.
- `diagram-view.tsx`, `zoomable-image.tsx`: `print:` 클래스를 지운다.
- `navbar.tsx`, `footer.tsx`, `skip-link.tsx`: `print:hidden`을 지운다.

- [ ] **Step 3: 확인한다**

Run:
```bash
grep -rnE "print:|break-after-avoid|break-inside-avoid|KEEP_TOGETHER" app components; grep -n "@media print" app/globals.css; echo "(위가 비어 있어야 함)"
pnpm exec tsc --noEmit && pnpm test && pnpm lint && pnpm build
pdftotext out/portfolio.pdf $SCRATCH/pdf-after-cleanup.txt && diff $SCRATCH/pdf-before-cleanup.txt $SCRATCH/pdf-after-cleanup.txt && echo "PDF 글 동일"
pdftoppm -r 70 -png out/portfolio.pdf $SCRATCH/cleanup-after
```
Expected: `grep`은 아무것도 찍지 않는다. "PDF 글 동일". `cleanup-before-*.png`와 `cleanup-after-*.png`를 나란히 보아 쪽 모양이 같은지 확인한다. `pnpm dev`로 홈과 사례 페이지 하나를 열어 화면이 전과 같은지 본다.

- [ ] **Step 4: 1단계 완료 기준을 하나씩 확인한다**

설계 문서 7절의 1단계 완료 기준이다.

- `out/portfolio.pdf`가 10쪽이고 책갈피에 덩어리 제목 9개가 있다.
- 덩어리 제목을 누르면 사이트의 그 덩어리 위치가 열린다.
- 브라우저의 `/export/`가 PDF와 같은 모습이다.
- 없는 주소로 가면 메뉴와 푸터가 있는 404가 나온다.
- 설계 문서 8절의 수 표기 목록이 모두 반영됐다.

- [ ] **Step 5: 커밋**

`feat: 새 PDF가 쓰지 않는 인쇄 전용 스타일과 쪽 나눔 코드를 지움`
