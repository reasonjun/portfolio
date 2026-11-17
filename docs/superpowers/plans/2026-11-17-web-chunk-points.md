# 웹 사례 페이지 요점·접힌 자세한 글 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 웹 사례 페이지(`/projects/<id>/`)의 덩어리마다 PDF와 같은 요점을 먼저 보여 주고, 자세한 글은 접힌 "자세한 과정"(`<details>`)으로 옮긴다.

**Architecture:** 웹 덩어리 블록은 제목 → 그림 → `ChunkPoints`(PDF와 같은 컴포넌트) → `<details>` 순서다. 접힌 글 안쪽 맨 앞의 `id="<덩어리 id>-detail"`을 PDF 제목 링크가 가리켜, 브라우저가 접힌 글을 스스로 연다. 요점이 아직 없는 덩어리는 요점 데이터가 들어올 때까지(Task 3) 지금처럼 문단을 펼쳐 그린다.

**Tech Stack:** Next.js 16.4.6(App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS 4, lucide-react, Biome, vitest, Playwright, pnpm. 새 의존성은 없다.

**Spec:** `docs/superpowers/specs/2026-11-17-pdf-chunk-structure-design.md` 12절(2단계에서 정한 것). 6.6절과 7절의 2단계 완료 기준도 함께 본다.

## Global Constraints

- 자세한 글(`detail`)은 한 글자도 바꾸지 않는다. 지우거나 줄이지 않고 접을 뿐이다.
- 요점은 Task 3 부록의 승인된 문구를 그대로 넣는다. 다른 문구를 만들지 않는다. `nextauth-token-refresh`의 결과 요점은 한 개다(사용자 결정, 3개 규칙의 예외).
- PDF는 10쪽이고 글이 바뀌지 않는다. 바뀌는 것은 덩어리 제목 링크의 주소뿐이다.
- 칸 이름: 요점은 "문제 원인 / 해결 과정 / 결과"(`ChunkPoints` 그대로), 접힌 글 안쪽은 "문제 확인 / 해결 과정 / 결과"(지금 그대로).
- 스크립트를 더하지 않는다. 앵커로 접힌 글이 열리지 않는 옛 브라우저는 고려하지 않는다.
- 새 테스트를 만들지 않는다. 타입 변경으로 깨지는 기존 픽스처만 고친다. 확인은 결과물을 직접 열어 본다.
- 의존성을 더하지 않는다. Next 관련 판단은 `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`를 따른다. 전역 CSS는 경로를 옮겨도 지워지지 않으므로, 웹의 요점 모양은 `paper.css`가 아니라 Tailwind 클래스로 준다.
- 같은 작업 폴더를 다른 세션이 쓴다. `git stash`처럼 폴더 전체를 건드리는 명령을 쓰지 않는다. 스테이징은 이 계획이 바꾼 파일만 파일 단위로 한다. 남의 수정이 섞인 파일은 스테이징하지 않고 멈춰서 사용자에게 묻는다.
- `pnpm build`는 `out/`을 덮어쓴다. 다른 세션이 빌드 중이면 기다린다.
- 커밋은 Task마다 한 번 한다. 메시지는 `feat: …함`(한국어)이고 끝 줄은 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`이다. push와 main 병합은 하지 않는다.
- 임시 스크립트, 캡처, 비교 파일은 `$SCRATCH`(`/private/tmp/claude-501/-Users-seongjun-Project-career/a4f37748-e613-4e89-bd2a-d9a014265571/scratchpad/stage2`)에 둔다. 저장소 루트에 만들었다면 쓰고 나서 지운다.
- `.next/dev/types`의 옛 생성 파일 때문에 타입 검사나 빌드가 실패하면 그 폴더를 지운다.

## Review Focus

새 테스트를 만들지 않으므로, 아래 다섯 가지는 해당 Task의 확인 단계에서 직접 연다.

1. 요점이 있는 덩어리와 없는 덩어리가 한 페이지에 섞인 중간 상태에서 페이지가 깨진다. 기대: 요점 없는 덩어리는 지금과 똑같이 문단이 펼쳐져 있다. Task 1 Step 5.
2. 자세한 글 문단이 접힌 영역으로 옮기는 중 빠지거나 바뀐다. 기대: 사례 페이지 7개의 `<p>` 글이 전후 같다. Task 1 Step 5, Task 3 Step 6.
3. PDF 링크(`#<id>-detail`)로 들어왔을 때 접힌 글이 열리지 않거나 고정 메뉴에 가린다. 기대: Chromium·WebKit 모두 `details.open === true`이고 대상의 위쪽이 메뉴(`--navbar-height`, 4rem) 아래에 보인다. Task 2 Step 4.
4. 예전 앵커(`#<덩어리 id>`)로 들어오는 링크가 깨진다. 기대: 덩어리 제목 위치에 도착하고 글은 접힌 채다. Task 2 Step 4.
5. PDF의 쪽 수나 글이 바뀐다. 기대: 10쪽, `pdftotext` 전후 같음. Task 2 Step 3, Task 3 Step 6.

---

## File Structure

| 파일 | 하는 일 | Task |
|---|---|---|
| `lib/projects.ts` | `chunkDetailAnchor`, 요점 있는 덩어리 타입과 판별. Task 3에서 요점 판별을 지운다 | 1, 3 |
| `components/case-study/chunk-points.tsx` | 요점 세 칸. 웹이 쓸 수 있게 `className`을 받는다 | 1, 3 |
| `components/case-study/case-study-body.tsx` | 덩어리 블록을 요점 + 접힌 글로 | 1, 3 |
| `app/export/page.tsx` | 제목 링크 주소를 `#<id>-detail`로 | 2 |
| `app/types/project.ts` | `points` 필수 | 3 |
| `data/projects.ts` | 덩어리 7개의 요점 | 3 |
| `lib/content-check.test.ts` | 픽스처에 `points` | 3 |

---

### Task 1: 웹 덩어리 블록을 요점 + 접힌 자세한 글로 바꿈

**Files:**
- Modify: `lib/projects.ts:61-75`(PDF 타입 부분)
- Modify: `components/case-study/chunk-points.tsx`
- Modify: `components/case-study/case-study-body.tsx:35-68`(`SECTIONS`, `ChunkBlock`)

**Interfaces:**
- Produces (`lib/projects.ts`):
  - `export const chunkDetailAnchor = (id: ChunkId): string` → `` `${id}-detail` ``. Task 2가 쓴다.
  - `export type PointedChunk = Chunk & { problem: PointedSection; solution: PointedSection; result: PointedSection }` (`PointedSection = ChunkSection & { points: string[] }`, 지금의 `PdfSection`을 이름만 바꾼 것)
  - `export const hasPoints = (chunk: Chunk): chunk is PointedChunk` — 세 섹션 모두 `points`가 있고 비어 있지 않음. 지금 `isPdfChunk`의 요점 조건을 떼어 낸 것.
  - `PdfChunk = PointedChunk & { figure: ChunkFigure }`. `getPdfChunks`의 동작과 오류 문구는 그대로.
- Produces (`chunk-points.tsx`): `ChunkPoints({ chunk: PointedChunk; className?: string })`. 루트 `<dl>`의 클래스는 `cn("chunk-points", className)`. PDF 호출부는 바꾸지 않는다.

- [ ] **Step 1: 기준 자료를 뽑는다**

`pnpm build`(다른 세션이 빌드 중이 아닐 때) 뒤 `node scripts/serve-out.mjs`로 `out/`을 띄우고 다음을 `$SCRATCH/before/`에 남긴다.
- `pdftotext out/portfolio.pdf before/pdf.txt`, `pdfinfo out/portfolio.pdf | grep Pages`(기대: `Pages: 10`)
- 사례 페이지 7개(`getCaseStudies()`의 id)를 Playwright로 1280px·390px 전체 화면 캡처
- 페이지마다 `section[id] p`의 `textContent`를 순서대로 덤프한 `before/<id>.txt`
- `git diff --stat data/` 출력을 `before/data-state.txt`에 남긴다. 이후 비교 때 같은 데이터 상태인지 맞춰 본다.

- [ ] **Step 2: `lib/projects.ts`에 `chunkDetailAnchor`, `PointedChunk`, `hasPoints`를 만들고 `PdfChunk`·`isPdfChunk`를 그 위로 다시 쓴다**

`isPdfChunk`는 `chunk.figure !== undefined && hasPoints(chunk)`가 된다.

- [ ] **Step 3: `ChunkPoints`가 `PointedChunk`와 `className`을 받게 한다**

주석의 "PDF의 덩어리 쪽이 쓴다"를 "PDF의 덩어리 쪽과 웹 사례 페이지가 같이 쓴다. 모양은 쓰는 쪽이 정한다(PDF는 paper.css의 .chunk-points, 웹은 className)"로 고친다.

- [ ] **Step 4: `ChunkBlock`을 바꾼다**

`hasPoints(chunk)`가 거짓이면 지금 마크업을 그대로 그린다(Task 3에서 지운다). 참이면 제목, 그림 다음에:

1. `<ChunkPoints chunk={chunk} className=…>`: 웹 본문 글자 크기와 줄 간격(`leading-[1.75]`)을 따르고, 칸 사이 `space-y-3`. `sm` 이상에서 칸 이름 열 `5.5rem` + 목록 열 두 칸 격자, 그보다 좁으면 칸 이름이 목록 위. 칸 이름은 지금 `Labeled`의 `h4`와 같은 `text-sm font-semibold text-muted-foreground`. 목록은 `list-disc pl-5`. 자식 요소 스타일은 Tailwind 임의 변형(`[&_dt]:…`, `[&_ul]:…`)으로 준다.
2. `<details className="group …">`:
   - `<summary>`: 버튼처럼 보이게(`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium cursor-pointer hover:bg-muted list-none [&::-webkit-details-marker]:hidden`). 앞에 lucide `ChevronRight`(`aria-hidden`, `group-open:rotate-90 transition-transform`). 글자는 `자세한 과정` 뒤에 `<span className="sr-only">: {chunk.title}</span>`.
   - 내용: `<div id={chunkDetailAnchor(chunk.id)} className="mt-4 space-y-4">` 안에 지금의 `SECTIONS` 칸(`Labeled` + 문단)을 그대로.
3. 바깥 `<section id={chunk.id}>`와 그 주석은 그대로 둔다.

- [ ] **Step 5: 확인한다**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm exec biome check app components lib data scripts && pnpm build`
Expected: 모두 통과.

그다음 Step 1과 같은 방법으로 `$SCRATCH/after1/`을 뽑아 비교한다(데이터 상태가 `before/data-state.txt`와 같을 때만).
- `<p>` 덤프는 페이지 7개 모두 `before`와 같다(`diff -r`가 비어 있음). 접힌 `<details>` 안의 `<p>`도 `textContent`로 읽힌다.
- 캡처를 눈으로 본다: 법무관리 페이지에서 blue-green·bff는 요점 + 접힌 줄, msw는 지금처럼 문단이 펼쳐져 있다(중간 상태). 390px에서 칸 이름이 목록 위에 있다. "자세한 과정" 줄이 버튼으로 보인다.
- 한 페이지를 열어 `<details>`를 펼친 캡처도 남겨 펼친 모양을 본다.
- PDF는 `pdftotext` 결과가 `before/pdf.txt`와 같고 10쪽이다.

- [ ] **Step 6: 커밋한다**

```bash
git add lib/projects.ts components/case-study/chunk-points.tsx components/case-study/case-study-body.tsx docs/superpowers/specs/2026-11-17-pdf-chunk-structure-design.md docs/superpowers/plans/2026-11-17-web-chunk-points.md
git commit -m "feat: 웹 사례의 덩어리를 요점 먼저, 자세한 과정은 접어서 보여 주도록 함

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: PDF 제목 링크가 접힌 자세한 글을 열도록 함

**Files:**
- Modify: `app/export/page.tsx:67`(제목 링크의 `href`)

**Interfaces:**
- Consumes: `chunkDetailAnchor(id: ChunkId): string` (Task 1)

- [ ] **Step 1: `href`를 `` `${PROFILE.siteUrl}projects/${project.id}/#${chunkDetailAnchor(chunk.id)}` ``로 바꾼다**

- [ ] **Step 2: `pnpm build`**

Expected: 통과.

- [ ] **Step 3: PDF 글과 쪽 수를 비교한다**

`pdftotext out/portfolio.pdf $SCRATCH/after2/pdf.txt && diff $SCRATCH/before/pdf.txt $SCRATCH/after2/pdf.txt` → 차이 없음. `pdfinfo` → `Pages: 10`. 링크 주소가 바뀌었는지는 `pdftotext`로 보이지 않으므로, PDF를 열어 덩어리 제목 하나를 눌러 주소가 `…/#<id>-detail`인지 본다.

- [ ] **Step 4: 앵커 동작을 Chromium과 WebKit에서 확인한다**

`$SCRATCH/anchor.mjs`: `serve-out.mjs`로 띄운 사이트에서 `/portfolio/projects/enterprise-legal-management/`에 대해 두 브라우저(`chromium`, `webkit`)로 다음을 본다.
- `#blue-green-deploy-detail`로 새로 열기 → `document.querySelector('#blue-green-deploy details').open === true`, `#blue-green-deploy-detail`의 `getBoundingClientRect().top`이 64(4rem) 이상이고 창 높이보다 작다.
- `#blue-green-deploy`로 새로 열기 → 같은 `details.open === false`, 덩어리 `section`의 top이 64 이상.

Firefox는 이 컴퓨터에서 Playwright Firefox가 실행되지 않아 확인하지 않는다(설계 12절).

- [ ] **Step 5: 커밋한다**

```bash
git add app/export/page.tsx
git commit -m "feat: PDF 덩어리 제목 링크가 웹의 접힌 자세한 과정을 펼쳐 열도록 함

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: 나머지 덩어리 7개의 요점을 넣고 요점을 필수로 바꿈

**선행 조건:** 다른 세션의 `data/projects.ts`·`data/project-lists.ts` 수정이 커밋돼 있어야 한다.

**Files:**
- Modify: `data/projects.ts`(덩어리 7개의 세 섹션에 `points`)
- Modify: `app/types/project.ts:20-25`(`ChunkSection.points` 필수)
- Modify: `lib/projects.ts`(`PointedSection`, `PointedChunk`, `hasPoints` 삭제)
- Modify: `components/case-study/chunk-points.tsx`(prop 타입 `Chunk`)
- Modify: `components/case-study/case-study-body.tsx`(요점 없는 경로 삭제)
- Modify: `lib/content-check.test.ts:5-12`(`makeChunk`)

**Interfaces:**
- Consumes: Task 1의 `ChunkBlock`, `ChunkPoints`
- Produces: `ChunkSection { points: string[]; detail: string[] }`, `PdfChunk = Chunk & { figure: ChunkFigure }`, `ChunkPoints({ chunk: Chunk; className?: string })`

- [ ] **Step 1: 선행 조건을 확인한다**

Run: `git status --short data/`
Expected: 출력 없음. `M`이 있으면 멈추고 사용자에게 묻는다.

- [ ] **Step 2: 부록의 요점을 덩어리 7개에 넣는다**

각 섹션의 `detail` 위에 `points: [...]`를 둔다(기존 덩어리와 같은 순서). 문구는 부록 그대로이고, 백틱은 데이터의 다른 요점처럼 인라인 코드 표시다.

- [ ] **Step 3: 데이터에서 요점이 빠진 섹션이 없는지 본다**

Run: `grep -c "points: \[" data/projects.ts`
Expected: `48`(덩어리 16개 × 세 섹션).

- [ ] **Step 4: 타입을 필수로 바꾸고 따라 깨지는 곳을 고친다**

- `app/types/project.ts`: `points: string[]`. 주석의 "웹은 2단계부터 쓴다"를 "PDF와 웹 사례 페이지가 같이 쓴다"로.
- `lib/projects.ts`: `PointedSection`, `PointedChunk`, `hasPoints`를 지운다. `isPdfChunk`는 그림 유무만 본다. `getPdfChunks`의 오류 문구는 `` `${id}: 그림이 없어 PDF에 실을 수 없음` ``. `data/project-lists.ts`의 `PDF_CHUNK_IDS` 주석도 "그림이 있는 덩어리만"으로 맞춘다(그 파일에 남의 수정이 없을 때만).
- `chunk-points.tsx`: prop 타입 `Chunk`.
- `case-study-body.tsx`: `hasPoints` 분기와 요점 없는 경로를 지운다.
- `lib/content-check.test.ts`: `makeChunk`의 세 섹션에 `points: ["요점"]`.

- [ ] **Step 5: 검사를 돌린다**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm exec biome check app components lib data scripts && pnpm build`
Expected: 모두 통과.

- [ ] **Step 6: 결과물을 연다**

Task 1 Step 1의 방법으로 `$SCRATCH/after3/`을 뽑는다.
- 기준 갱신: 다른 세션의 커밋으로 데이터가 바뀌었으므로, 요점을 넣기 직전(Step 1 뒤, Step 2 전)에 `pdftotext`와 `<p>` 덤프를 한 번 더 뽑아 `$SCRATCH/before3/`로 두고 그것과 비교한다.
- `<p>` 덤프: 7개 페이지 모두 `before3`과 같다.
- PDF: `pdftotext`가 `before3`과 같고 10쪽이다.
- 캡처: 사례 페이지 7개 모두 덩어리 16개가 요점 + 접힌 줄이다. 1280px·390px.
- 브라우저 찾기: Chrome에서 사례 페이지를 열고 접힌 글 안에만 있는 낱말(예: `nginx -t`)을 찾기로 검색해, 글이 펼쳐지며 찾아지는지 본다. 자동화가 안 되면 사용자에게 확인을 부탁하고 결과를 보고에 적는다.

- [ ] **Step 7: 커밋한다**

```bash
git add data/projects.ts app/types/project.ts lib/projects.ts components/case-study/chunk-points.tsx components/case-study/case-study-body.tsx lib/content-check.test.ts
git commit -m "feat: 나머지 덩어리 일곱 개에 요점을 넣고 요점을 필수로 바꿔 문단만 그리던 경로를 지움

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

`data/project-lists.ts`를 고쳤다면 같은 커밋에 더한다.

---

## 완료 기준 (사용자 승인 대기)

- 웹 덩어리 16개 모두 요점이 먼저 보이고 자세한 글이 접혀 있다.
- 웹 요점이 PDF와 같은 문구다(같은 데이터, 같은 컴포넌트).
- 자세한 글은 하나도 삭제되지 않았다(`<p>` 덤프 전후 같음).
- PDF는 10쪽이고 글이 같다. 바뀐 것은 제목 링크 주소뿐이다.
- PDF 제목 링크로 들어오면 Chromium·WebKit에서 접힌 글이 열린다.

## 부록: 승인된 요점 (2026-11-17)

### msw-mock-switch

problem
- 백엔드 API는 화면 개발보다 늦게 도메인별로 나오는데, mock 72개는 환경변수 하나로 전체를 켜거나 끄는 구조
- mock 로그인이 발급한 가짜 JWT로는 실API가 모두 401. 인증부터 실API로 넘겨야 나머지도 전환 가능
- 백엔드 호출을 RSC·Server Action·BFF가 서버에서 해서 브라우저 Service Worker 방식의 mock으로는 가로채기 불가

solution
- 세 가지 방식을 비교. 경로 allowlist 환경변수는 API가 나올 때마다 설정 변경이, catch-all 프록시는 mock 서버 동작의 재현·유지가 필요해 제외
- MSW의 App Router 서버 쪽 가로채기 이슈(msw#1644)는 공통코드·부서 도메인 파일럿으로 Next 16 + Turbopack에서 재현되지 않음을 확인
- Route Handler 72개를 리졸버 40개로 이관. `instrumentation.ts`에서 mock 모드일 때만 서버의 fetch를 가로채고 핸들러가 없는 엔드포인트는 실API로 통과
- 운영·스테이징 빌드 스크립트에 `NEXT_PUBLIC_USE_MOCK=false`를 고정해 mock 코드를 산출물에서 제거

result
- 인증·사용자·메뉴·대시보드·공통코드부터 실API로 순차 전환. API가 나오면 프론트엔드 작업은 해당 핸들러 삭제뿐
- 검토요청은 목록·엑셀 다운로드는 실API, 상세·수정·상태 전이는 mock으로 한 업무 흐름 안에서 혼용
- 운영 빌드 산출물 검사에서 mock 시드와 `setupServer` 0건. 배포 이미지에 env 파일로 mock을 켜도 동작하지 않음
- dev 서버가 모듈을 다시 불러온 뒤 가로채기가 풀리는 현상은 원인 미확정, 재시작으로 대응

### s3-cache-policy

problem
- 배포 후에도 정산 업로드 화면의 신규 컬럼이 사용자마다 보였다 안 보였다 한다는 사용자·운영자 문의
- 배포마다 CloudFront 엣지 캐시는 전체 무효화로 비웠지만 S3에 올린 파일에 `Cache-Control` 헤더가 없던 상태
- 브라우저가 `Last-Modified` 기반 휴리스틱 캐시로 이전 버전의 `index.html`을 재검증 없이 사용

solution
- S3 업로드를 두 단계로 나눠 파일 성격별로 캐시 정책 분리. 전부 장기 캐시하면 `index.html`이 갱신되지 않고, 전부 `no-cache`면 바뀌지 않은 JS·CSS까지 매번 재검증
- 파일명에 내용 해시가 붙는 `assets/*`는 `public, max-age=31536000, immutable`로 1년 캐시
- `index.html` 등 나머지 파일은 `no-cache`. 사본을 저장하되 쓰기 전에 ETag로 변경 여부를 확인해 그대로면 304만 수신
- `assets/*`를 먼저, 나머지를 나중에 올려 새 `index.html`이 아직 없는 해시 파일을 가리키는 순간 제거. 이전 배포의 해시 파일은 지우지 않음

result
- 브라우저가 `index.html`을 매번 재검증해 새 배포를 받고, 해시 파일은 계속 장기 캐시 사용
- 변경 후 이전 버전 화면 관련 문의 없음
- 스테이징에서 curl로 확인. 같은 ETag의 조건부 요청에 본문 없는 304(`X-Cache: Hit from cloudfront`) 응답
- 해시 자산은 엣지에 처음 요청할 때만 Miss, 이후 요청은 Hit

### ai-agent-guardrails

problem
- AI 코딩 에이전트가 요구나 명세에 적힌 한 줄을 근거로 기능을 없애거나 바꾸려는 일 발생
- 리팩터링과 달리 개선 요구는 동작을 바꾸는 일이라 E2E 기준선으로 판정 불가
- 구현 뒤 diff를 봐도 그 해석이 업무에 맞는지 알기 어려움

solution
- 구현 전 확인을 맥락과 명세 두 단계로 분리
- 업무 매뉴얼·용어를 정리한 업무 위키와, 세션마다 결정·원인 조사를 남기는 작업 위키를 직접 구축. 에이전트가 업무 규칙과 이전 결정을 확인한 뒤 작업
- 구현 전에 명세를 작성해 에이전트의 해석이 코드보다 먼저 드러나게 하고, 정책 판단이 필요한 항목은 에이전트가 골라 질문
- 기존 기능을 없애거나 막는 항목은 업무 위키에서 근거를 찾은 뒤에만 구현

result
- 명세에 있던 기능 제거는 업무 위키 어디에도 근거가 없음을 확인하고 구현 전에 폐기
- 로드맵 한 줄로 들어온 기능 변경은 위키 확인 대상이 아니어서 에이전트의 해석대로 구현했다가 전제가 틀려 폐기
- 명세는 에이전트가 해석한 요구 위에서 쓰여, 해석의 전제가 틀리면 명세도 함께 틀림
- 이후에는 구현 전에 요청자에게 요구 원문부터 받음

### vite-rolldown-chunks

problem
- 운영 빌드가 JavaScript 기반 싱글 스레드 번들러 Rollup으로 돌아 CI에서 약 145초. 배포와 CI마다 누적
- Vue·Vuetify는 앱 진입 코드와 함께 640KiB 진입 청크에, RealGrid는 앱 컴포넌트와 함께 1,879KiB 공통 청크에 묶여 앱 코드만 바꿔도 라이브러리까지 다시 받는 구성
- 트리셰이킹되지 않는 CJS 라이브러리와 시스템 분리 후 쓰지 않게 된 패키지·코드가 그대로 포함

solution
- Vite를 5에서 8로 올려 로컬 개발과 운영 빌드의 도구를 번들러 Rolldown과 컴파일러 Oxc로 통합. Rolldown은 파싱·변환·코드 생성을 멀티스레드로 병렬 처리
- 번들 분석 도구로 청크 구성을 확인한 뒤 자주 바뀌지 않는 대형 라이브러리를 앱 코드와 다른 청크로 분리
- CJS 라이브러리는 ESM 버전과 네이티브 메서드로 교체(lodash → `lodash-es`), ESM 버전이 없는 RealGrid는 별도 청크로 격리
- 미사용 패키지와 시스템 분리 후 남은 미사용 코드 제거

result
- CI 운영 빌드 시간이 약 145초에서 약 35초로 약 76% 감소
- JS·CSS 전체 6,398KiB에서 5,066KiB로 약 21% 감소. 대부분은 미사용 파일 제거 효과
- 앱 진입 코드 한 줄만 바꿔 다시 빌드하면 새로 받는 JS가 5,002KiB(289개)에서 845KiB(36개)로 약 83% 감소
- 해시가 붙은 파일에 `immutable` 캐시 헤더를 붙여, 이름이 그대로인 라이브러리 청크는 브라우저 캐시에서 바로 사용

### nextauth-token-refresh

problem
- 사람인의 OIDC 인증 서버로 로그인을 붙이고 나니 액세스 토큰이 만료되면 다시 로그인해야 하는 상태
- NextAuth.js는 기본 설정에서 액세스·리프레시 토큰을 세션 쿠키에 저장하지 않고 갱신도 하지 않음
- 관리자가 대시보드·리포트를 보거나 설문을 관리하다가 토큰이 만료될 때마다 작업 중단

solution
- NextAuth.js 공식 가이드처럼 jwt 콜백에 갱신을 배치. 세션을 조회할 때마다 서버에서 실행돼 화면마다 갱신 처리를 넣을 필요 없음
- 로그인 때 받은 액세스·리프레시 토큰을 암호화된 세션 쿠키에 담고, 액세스 토큰(JWT)을 디코딩해 만료 시각(`exp`)도 저장
- 조회할 때 만료됐으면 리프레시 토큰으로 토큰 엔드포인트에 새 토큰 요청
- 새 리프레시 토큰이 오면 교체(회전), 오지 않으면 기존 것 유지

result (사실이 정리되면 채운다)
- 한 화면에 계속 머물며 작업하는 동안에도 로그인 유지. 토큰이 만료될 때마다 다시 로그인할 필요 없음

### chromatic-visual-test

problem
- 컴포넌트 하나를 고치면 그 컴포넌트를 조합한 상위 컴포넌트의 화면도 함께 변경
- 혼자 만드는 라이브러리라 리뷰어 부재
- 고칠 때마다 모든 컴포넌트의 상태별 화면을 눈으로 확인하기는 불가능

solution
- 컴포넌트마다 기본·로딩·에러처럼 상태별로 Storybook 스토리 작성
- develop·main 브랜치에 push하거나 PR을 열면 GitHub Actions가 토큰을 생성하고 Storybook을 빌드해 Chromatic에 업로드
- Chromatic이 스토리마다 화면을 찍어 이전 빌드와 비교. 달라진 화면은 승인해야 새 기준으로 반영
- Storybook 접근성 애드온으로 스토리별 접근성 위반 확인

result
- 37번째 빌드에서 컴포넌트 16개·스토리 47개의 화면을 이전 빌드와 비교
- 달라진 화면 0건
- 접근성 검사는 위반을 Storybook 화면에 표시만 하고 빌드를 실패시키지는 않음

### a11y-export-check

problem
- 문서가 점자 디스플레이와 스크린리더로 읽혀, 대체 텍스트가 없으면 이미지를 알 수 없고 제목 문단이 없으면 문서 구조를 따라갈 수 없음
- 이런 오류를 내보내기 전에 걸러야 하는 상황
- 가상 스크롤을 넣자 화면 밖 문단이 빈 문단이 돼, 에디터의 문서 구조를 훑던 검사기로는 화면 밖 오류를 찾을 수 없게 됨

solution
- 이미지 대체 텍스트(빈 값 포함), 제목 문단 유무, 글자·배경 명도 대비(WCAG AA 기준 4.5:1), 링크 텍스트와 URL, 이미지의 촉각 그래픽 데이터를 검사하는 검사기 구현
- 검사를 내보내기 버튼에 연결. 검사 중에는 버튼을 막고, '모두 무시하고 내보내기'를 따로 제공
- 가상 스크롤 뒤에는 검사 대상을 에디터에서 원본 문단 배열로 변경. 배열 전체를 이어 붙인 HTML을 `DOMParser`로 파싱해 같은 규칙으로 검사
- 화면 밖 DOM은 스크롤할 때마다 다시 만들어지므로 오류 위치를 DOM 참조 대신 자식 순번 경로(예: `[42, 0, 1]`)로 저장
- 오류로 이동할 때 문단이 실제 내용으로 바뀔 때까지 최대 2초 대기. 빠른 수정으로 순번이 밀리면 남은 오류의 경로 재계산

result
- 문서를 내보내려면 접근성 오류를 고치거나 무시를 직접 골라야 함
- 가상 스크롤로 화면에 그려지지 않은 문단도 검사 대상에 포함
- 오류마다 그 위치로 이동해 바로 수정 가능
