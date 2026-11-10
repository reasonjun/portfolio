# 포트폴리오 재구성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이력서/경력기술서 형태인 현재 사이트를, 대표 사례 7개를 깊게 보여 주는 포트폴리오 전용 사이트와 같은 내용의 PDF로 바꾼다.

**Architecture:** 콘텐츠는 기존처럼 `data/*.ts` 정적 데이터로 두고 `Project`에 선택 필드 `caseStudy`를 더한다. 순수 셀렉터(`lib/projects.ts`)가 메인·사례 페이지(`/projects/[id]`)·아카이브(`/archive`)·인쇄 페이지(`/export`)에 데이터를 공급한다. 빌드 후 Playwright가 `/export`를 PDF로 저장한다.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS 4 + `tw-animate-css`, shadcn/ui, Biome, pnpm. 신규 devDependency: `vitest`, `@playwright/test`.

**Spec:** 이 문서의 "Spec" 절 (사용자와 하나씩 확정한 결정. 별도 문서 없음)

## Spec (확정된 결정)
| # | 항목 | 결정 |
|---|---|---|
| 1 | 사이트 역할 | 포트폴리오 전용. 경력·기술은 짧게 두고, 이력서는 사이트에 올리지 않고 지원할 때 별도 제출 (이력서 PDF 버튼 없음) |
| 2 | 대표 사례 (7개, 모두 같은 깊이) | `legal-management-system`, `ip-management-system`, `external-settlement-system`, `wysiwyg-editor`, `tactile-graphics-editor`, `design-system`, `ats-monitoring-system` |
| 3 | 사례 구조 | 개요(배경·역할·기간·스택) + 핵심 문제 2~3개(문제 → 검토한 방법·선택 이유 → 결과) + 회고 |
| 4 | 사례 표시 | 사례별 별도 페이지 `/projects/[id]/` |
| 5 | 메인 구성 | Hero → 대표 사례 7개 → 기술(분류형) → 경력 요약 → 연락처(푸터) |
| 6 | 나머지 10개 | `/archive/` 표: 연도 · 프로젝트 · 회사 · 기술. 전체 17개, 대표 사례 행은 사례 페이지로 링크 |
| 7 | PDF | 표지 + 대표 사례 7개를 빌드 시 Playwright로 생성, 다운로드 버튼 |
| 8 | Hero | "화면부터 배포까지 책임진다" + 파이프라인(설계 → 구현 → 테스트 → 배포) 단계 점등 + 핵심 수치 3개 |
| 9 | 시각 자료 | 스크린샷 없는 사례는 SVG 도식 + 축약 코드(개념 재작성, 회사 코드 아님) + 수치 비교 카드 |
| 10 | 내용 수집 | 사례별 인터뷰. 수치·사실은 지어내지 않음 |
| 11 | 이력서와의 관계 | 이력서(접근성·성능 최우선)와 사이트(설계~배포 책임) 방향은 각각 유지. Hero 수치에 성능 수치(60s → 1s)를 넣어 두 서류를 연결 |

## Global Constraints
- 정적 export 유지: `next.config.ts`의 `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, 프로덕션 `basePath: "/portfolio"`.
- 새 런타임 의존성 없음. devDependency는 `vitest`, `@playwright/test`만 추가.
- 애니메이션은 CSS + `tw-animate-css`만 사용. `prefers-reduced-motion: reduce`이면 정적 최종 상태로 표시.
- `robots: { index: false, follow: false }` 유지.
- 데이터에 없는 사실·수치를 만들지 않는다. 확인되지 않은 칸은 빈 값으로 두고 `pnpm check:content`가 보고한다.
- 문체: 사이트 문구는 한국어 존댓말 평서문.
- 코드 스타일: Biome 규칙, 2칸 들여쓰기, 기존 컴포넌트처럼 화살표 함수 컴포넌트 + default export.
- 커밋 메시지: 저장소 관례(`feat: …`, `chore: …`, 한국어)를 따르고 끝에 커밋 시점의 attribution 안내에 있는 `Co-Authored-By` 줄.
- 작업 브랜치: `develop`에서 분기한 `feature/portfolio-restructure`.

## Review Focus
1. **하위 페이지의 정적 파일 경로**: `/portfolio/projects/<id>/`에서 이미지(`ats/image-1.png` 같은 상대 경로)와 PDF 링크가 basePath 아래에서 정상 로드되어야 한다 → Task 5, Task 10 테스트.
2. **하위 페이지에서 내비게이션**: 사례·아카이브 페이지에서 "기술" 등을 누르면 메인의 해당 섹션으로 이동해야 한다 → Task 7 테스트.
3. **다크 모드 도식**: SVG 도식 선·글자가 다크 배경에서 보여야 한다(`currentColor`) → Task 6 테스트.
4. **PDF 한글·분량**: CI(Ubuntu) Chromium으로 만든 PDF에서 한글이 깨지지 않고, 표지 + 사례 7개가 모두 들어가야 한다 → Task 9, Task 10 테스트.
5. **없는 사례 주소 접근**: 대표 사례가 아닌 id(`/projects/unknown/`)는 빈 페이지가 아니라 404여야 한다 → Task 5 테스트.

---

### Task 0: 준비

**Files:**
- Create: `docs/superpowers/plans/2026-11-01-portfolio-restructure.md` (이 계획 복사)

- [ ] **Step 1:** `git status`, `git diff`로 사용자 미커밋 변경(`project-card.tsx`, `project-detail-modal.tsx`, `data/projects.ts`, `pnpm-lock.yaml`, `public/` 이미지)을 보여 주고, 먼저 커밋할지 사용자에게 확인한다. 확인 전에는 진행하지 않는다.
- [ ] **Step 2:** `git switch -c feature/portfolio-restructure`
- [ ] **Step 3:** 계획 파일 복사 후 커밋 `docs: 포트폴리오 재구성 계획 추가`

### Task 1: 데이터 모델 · 셀렉터 · 단위 테스트 기반

**Files:**
- Create: `vitest.config.ts`, `lib/projects.ts`, `lib/projects.test.ts`, `lib/base-path.ts`, `lib/base-path.test.ts`
- Modify: `app/types/project.ts`, `app/types/experience.ts`, `next.config.ts`, `package.json`

**Interfaces:**
- Produces:
  - `app/types/project.ts`
    ```ts
    export type DiagramId = "bff-auth-flow" | "blue-green-deploy";
    export type CaseVisual =
      | { type: "diagram"; id: DiagramId; caption: string }
      | { type: "code"; lang: string; code: string; caption?: string }
      | { type: "metrics"; items: { label: string; before: string; after: string }[] };
    export interface CaseProblem {
      title: string; problem: string; considered: string[];
      decision: string; result: string; visual?: CaseVisual;
    }
    export interface CaseStudy {
      summary: string; background: string; role: string;
      problems: CaseProblem[]; retrospective: string;
    }
    export interface Project { /* 기존 필드 */ caseStudy?: CaseStudy }
    export type CaseStudyProject = Project & { caseStudy: CaseStudy };
    export interface ArchiveRow {
      id: string; year: string; title: string; company: string;
      techStack: string[]; href?: string;
    }
    ```
  - `app/types/experience.ts`: `summary?: string` 추가.
  - `lib/projects.ts`
    - `getStartYear(period: string): string` — 기간 문자열의 첫 4자리 연도
    - `getCaseStudies(projects?: Project[]): CaseStudyProject[]` — 기본값 `PROJECTS_DATA`, 데이터 순서 유지
    - `getCaseStudyById(id: string, projects?: Project[]): CaseStudyProject | undefined`
    - `getArchiveRows(projects?: Project[]): ArchiveRow[]` — 전체, 데이터 순서, caseStudy가 있으면 `href: \`/projects/${id}/\``
  - `lib/base-path.ts`: `withBasePath(path: string): string` — `process.env.NEXT_PUBLIC_BASE_PATH ?? ""`를 앞에 붙임. `path`는 `/`로 시작해야 함.
  - `next.config.ts`: 프로덕션 빌드에서 `env: { NEXT_PUBLIC_BASE_PATH: "/portfolio" }`, 그 외 `""`.
  - `package.json` scripts: `"test": "vitest run"`

- [ ] **Step 1:** `pnpm add -D vitest`. `vitest.config.ts`: `environment: "node"`, `include: ["lib/**/*.test.ts"]`, `resolve.alias: { "@": <프로젝트 루트> }`.
- [ ] **Step 2: 실패하는 테스트 작성** (`lib/projects.test.ts`, 픽스처 프로젝트 3개: caseStudy 1개 + 일반 2개)
  ```ts
  expect(getStartYear("2026.07. - 진행 중")).toBe("2026");
  expect(getStartYear("2024.07.")).toBe("2024");
  expect(getCaseStudies(fixtures).map((p) => p.id)).toEqual(["case-a"]);
  expect(getCaseStudyById("plain-b", fixtures)).toBeUndefined();
  expect(getArchiveRows(fixtures)).toHaveLength(3);
  expect(getArchiveRows(fixtures)[0].href).toBe("/projects/case-a/");
  expect(getArchiveRows(fixtures)[1].href).toBeUndefined();
  ```
  `lib/base-path.test.ts`: `vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio")` → `withBasePath("/ats/image-1.png") === "/portfolio/ats/image-1.png"`, env 없음 → `"/ats/image-1.png"`.
- [ ] **Step 3:** `pnpm test` → FAIL (모듈 없음)
- [ ] **Step 4:** 타입·셀렉터·`withBasePath`·`next.config.ts` env 구현
- [ ] **Step 5:** `pnpm test` → PASS, `pnpm lint` → 오류 0
- [ ] **Step 6:** 커밋 `feat: 대표 사례 데이터 모델과 셀렉터 추가`

### Task 2: 콘텐츠 완성도 검사

**Files:**
- Create: `lib/content-check.ts`, `lib/content-check.test.ts`, `data/content.check.ts`, `vitest.content.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `CaseStudy`, `getCaseStudies` (Task 1)
- Produces: `validateCaseStudy(id: string, cs: CaseStudy): string[]` — 문제 목록(빈 배열이면 완성). 규칙: `summary`·`background`·`role`·`retrospective` 비어 있으면 안 됨, `problems` 2~3개, 각 문제의 `problem`·`decision`·`result` 비어 있으면 안 됨, `considered` 1개 이상. 메시지 형식: `` `${id}: ${필드 경로} 비어 있음` `` (예: `legal-management-system: problems[0].considered 비어 있음`).
- Produces: script `"check:content": "vitest run --config vitest.content.config.ts"` — 실제 데이터 전체에 대해 `validateCaseStudy` 결과가 모두 빈 배열인지 단언.

- [ ] **Step 1: 실패하는 테스트** — 완성된 픽스처는 `[]`. `problems` 1개면 `"x: problems 2~3개 필요 (현재 1개)"`. `considered: []`면 `"x: problems[0].considered 비어 있음"`. `role: ""`이면 `"x: role 비어 있음"`.
- [ ] **Step 2:** `pnpm test` → FAIL
- [ ] **Step 3:** 구현. `data/content.check.ts`는 `getCaseStudies()` 전체를 검사하고, 실패하면 모든 메시지를 출력.
- [ ] **Step 4:** `pnpm test` → PASS. `pnpm check:content`는 이 시점에 데이터가 없어 실패해도 된다(Task 3 이후에도 인터뷰 전까지 실패가 정상).
- [ ] **Step 5:** 커밋 `feat: 대표 사례 콘텐츠 완성도 검사 추가`

### Task 3: 사례·프로필 데이터 시드

**Files:**
- Modify: `data/projects.ts`, `data/experiences.ts`
- Create: `data/profile.ts`, `lib/data.test.ts`

**Interfaces:**
- Produces: `data/profile.ts`
  ```ts
  export const PROFILE: {
    name: string; role: string; positioning: string[];  // 줄 단위
    metrics: { value: string; label: string }[];      // 정확히 3개
    pipeline: string[];                               // ["설계","구현","테스트","배포"]
    githubUrl: string; email: string;
  };
  ```
  값: `name: "이성준"`, `role: "프론트엔드 개발자"`, `positioning: ["복잡한 업무 화면을 설계하고,", "테스트와 무중단 배포까지 책임집니다."]`, `metrics: [{ value: "11.6s → 2.77s", label: "로컬 빌드" }, { value: "326", label: "E2E 정산 조합" }, { value: "60s → 1s", label: "초기 로딩 (닷 사내 웹 서비스)" }]` (초안. 20s → 1s는 WYSIWYG 사례의 결과로 유지하고, Hero 수치는 인터뷰에서 확정), `githubUrl: "https://github.com/reasonjun"`, `email: "xmaseve96@naver.com"`.
- `PROJECTS_PER_PAGE` 제거.

- [ ] **Step 1: 실패하는 테스트** (`lib/data.test.ts`, 실제 데이터)
  ```ts
  expect(getCaseStudies().map((p) => p.id)).toEqual([
    "legal-management-system", "external-settlement-system", "ip-management-system",
    "ats-monitoring-system", "design-system", "wysiwyg-editor", "tactile-graphics-editor",
  ]);
  expect(getArchiveRows()).toHaveLength(17);
  expect(PROFILE.metrics).toHaveLength(3);
  ```
- [ ] **Step 2:** `pnpm test` → FAIL
- [ ] **Step 3:** 7개 프로젝트에 `caseStudy` 추가. **기존 `detailDescription`·`description`과 이력서 PDF(`/Users/seongjun/Project/hiring/랠릿프로필-이성준의 프로필.pdf`)에 있는 사실만** 해당 필드로 옮기고, 기술 스택은 이력서 기준으로 보정한다(법무관리: Ant Design 6·Feature-Sliced Design·AWS EC2/ALB/ECR 추가, 외부정산: RealGrid2 추가, IP관리는 확정된 "5개 화면"으로 표기, 닷 경력 `summary`에는 "사내 웹 서비스(모놀리스) 초기 로딩 60초 → 1초, 캐시 비운 첫 접속·운영 환경 기준" 포함). 없는 정보는 빈 문자열/빈 배열로 둔다(예: 법무관리 문제 ① "토큰을 브라우저에 노출하지 않는 인증" — decision: BFF 중계 + JWT 암호화 쿠키, result: 동시 refresh 1회로 합쳐 토큰 회전 무효화 위험 감소, considered: `[]`). 법무관리 문제에 `visual: { type: "diagram", id: "bff-auth-flow", … }`, `{ id: "blue-green-deploy" }`를 연결. 수치가 있는 결과는 `metrics` visual로(IP관리 빌드 11.6s→2.77s, WYSIWYG 20s→1s). "채용 관리 솔루션" 표기를 "채용관리솔루션"으로 통일.
- [ ] **Step 4:** `pnpm test` → PASS. `pnpm check:content` 출력(남은 빈칸 목록)을 사용자에게 보여 준다.
- [ ] **Step 5:** 커밋 `feat: 대표 사례와 프로필 데이터 시드`

### Task 4: E2E 기반

**Files:**
- Create: `scripts/serve-out.mjs`, `playwright.config.ts`, `e2e/home.spec.ts`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces: `scripts/serve-out.mjs` — `export function startServer(port: number): Promise<import("node:http").Server>`. `out/`을 `/portfolio` 접두어로 서빙, `/`로 끝나면 `index.html`, 없는 파일은 404. CLI로 실행하면 `PORT`(기본 4173)로 시작. MIME: html, css, js, json, txt, png, webp, svg, woff2, pdf.
- Produces: `playwright.config.ts` — `testDir: "e2e"`, `use.baseURL: "http://localhost:4173/portfolio/"`, `webServer: { command: "node scripts/serve-out.mjs", port: 4173, reuseExistingServer: !process.env.CI }`, 프로젝트는 chromium만.
- scripts: `"build:site": "next build --turbopack"`, `"build": "pnpm build:site"`(Task 10에서 PDF 추가), `"test:e2e": "playwright test"`.

- [ ] **Step 1:** `pnpm add -D @playwright/test`, `pnpm exec playwright install chromium`. `.gitignore`에 `test-results/`, `playwright-report/` 추가.
- [ ] **Step 2: 테스트** `e2e/home.spec.ts`: `page.goto("./")` → `getByRole("heading", { level: 1 })`가 `"이성준"`.
- [ ] **Step 3:** `pnpm build && pnpm test:e2e` → PASS (현재 사이트로 통과해야 기반이 맞음)
- [ ] **Step 4:** 커밋 `chore: Playwright E2E 기반 추가`

### Task 5: 사례 페이지와 공용 사례 컴포넌트

**Files:**
- Create: `app/projects/[id]/page.tsx`, `components/case-study/case-study-body.tsx`, `components/case-study/case-visual.tsx`, `components/case-study/metrics-card.tsx`, `components/case-study/code-block.tsx`, `components/case-study/case-gallery.tsx`, `e2e/case-study.spec.ts`

**Interfaces:**
- Consumes: `getCaseStudies`, `getCaseStudyById`, `withBasePath`, `CaseStudyProject`, `CaseVisual`
- Produces:
  - `CaseStudyBody({ project }: { project: CaseStudyProject })` — 제목, `회사 | 기간`, 기술 배지, 섹션 순서 `배경` → `역할` → 문제마다 `h3`(문제 제목) + `문제`/`검토한 방법`/`선택`/`결과` + visual → `회고`. 빈 값인 항목은 렌더링하지 않는다. Task 9 인쇄 페이지에서도 재사용.
  - `CaseVisual({ visual }: { visual: CaseVisual })` — type별로 `DiagramView`(Task 6), `CodeBlock`, `MetricsCard` 위임. Task 6 전에는 diagram이면 `null`.
  - `CodeBlock({ lang, code, caption })` — `<figure><pre><code>` + 언어 라벨, 하이라이팅 없음.
  - `MetricsCard({ items })` — `label`, `before → after`.
  - `CaseGallery({ project })` — 이미지가 있으면 기존 `components/ui/carousel.tsx`, `src={withBasePath(\`/${image}\`)}`.
  - 페이지: `generateStaticParams` = 사례 7개 id, `export const dynamicParams = false`, `generateMetadata` 제목 `` `${title} | 이성준 포트폴리오` ``, 하단에 "← 메인으로" 링크와 "전체 프로젝트 보기" 링크.

- [ ] **Step 1: 실패하는 테스트** `e2e/case-study.spec.ts`
  - 7개 id 각각 `goto(\`projects/${id}/\`)` → 응답 200, h1이 해당 title
  - `legal-management-system` 페이지에 `getByRole("heading", { name: "배경" })`, 문제 제목 `"토큰을 브라우저에 노출하지 않는 인증"` heading 존재
  - (Review Focus 1) `ats-monitoring-system` 페이지의 첫 이미지 `naturalWidth > 0`
  - (Review Focus 5) `goto("projects/unknown/")` → 응답 404
- [ ] **Step 2:** `pnpm build && pnpm test:e2e` → FAIL
- [ ] **Step 3:** 구현
- [ ] **Step 4:** `pnpm build && pnpm test:e2e` → PASS, `pnpm lint` → 오류 0
- [ ] **Step 5:** 커밋 `feat: 대표 사례 상세 페이지 추가`

### Task 6: SVG 도식

**Files:**
- Create: `components/case-study/diagrams/bff-auth-flow.tsx`, `components/case-study/diagrams/blue-green-deploy.tsx`, `components/case-study/diagram-view.tsx`, `e2e/diagram.spec.ts`
- Modify: `components/case-study/case-visual.tsx`

**Interfaces:**
- Consumes: `DiagramId`
- Produces: `DiagramView({ id, caption }: { id: DiagramId; caption: string })` — `Record<DiagramId, ComponentType>` 레지스트리로 SVG를 고르고 `<figure>` + `<figcaption>`. SVG는 `role="img"` + `aria-label`, 선·글자는 `stroke="currentColor"` / `fill="currentColor"`, 강조색은 테마 CSS 변수(`var(--primary)`).
- 도식 내용(데이터에 있는 사실만):
  - `bff-auth-flow`: 브라우저 ↔ BFF(Next.js) ↔ API. 브라우저에는 암호화 쿠키만, JWT는 BFF가 보관, 동시 refresh 요청을 BFF가 1회로 합침.
  - `blue-green-deploy`: GitLab CI/CD → Docker 이미지 → 개발·스테이징·운영 → Nginx가 blue/green 중 헬스체크 통과한 쪽으로 트래픽 전환.

- [ ] **Step 1: 실패하는 테스트** `e2e/diagram.spec.ts` — 법무관리 페이지에서 `getByRole("img", { name: /인증 흐름/ })`, `getByRole("img", { name: /배포/ })` 존재. (Review Focus 3) `html`에 `dark` 클래스를 추가한 뒤, 도식 안 첫 `path`/`line`의 computed `stroke`가 `body`의 computed `color`와 같음.
- [ ] **Step 2:** `pnpm build && pnpm test:e2e` → FAIL
- [ ] **Step 3:** 구현, `CaseVisual`의 diagram 분기 연결
- [ ] **Step 4:** PASS 확인, `pnpm lint`
- [ ] **Step 5:** 커밋 `feat: 인증 흐름과 배포 파이프라인 도식 추가`

### Task 7: 메인 페이지 재구성

**Files:**
- Create: `components/portfolio/pipeline.tsx`, `components/portfolio/case-studies-section.tsx`, `e2e/main.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css`, `components/portfolio/hero-section.tsx`, `components/portfolio/project-card.tsx`, `components/portfolio/skills-section.tsx`, `components/portfolio/experience-section.tsx`, `components/portfolio/navbar.tsx`, `data/experiences.ts`
- Delete: `components/project-detail-modal.tsx`, `components/portfolio/projects-section.tsx`, `hooks/useProjects.ts`

**Interfaces:**
- Consumes: `PROFILE`, `getCaseStudies`, `withBasePath`
- Produces:
  - `app/page.tsx` 순서: `Navbar` → `HeroSection`(id `about`) → `CaseStudiesSection`(id `case-studies`) → `SkillsSection`(id `skills`) → `ExperienceSection`(id `experience`) → `Footer`
  - `Pipeline({ stages }: { stages: string[] })` — 점과 연결선. `globals.css`에 `@keyframes pipeline-light`, 단계 i의 `animation-delay: i * 400ms`, `motion-safe:`에서만 재생, `motion-reduce:`에서는 애니메이션 없이 켜진 상태. 각 단계 요소에 `data-stage`.
  - `HeroSection`: `PROFILE`의 이름(h1)·직함·positioning·metrics·Pipeline. 버튼: "포트폴리오 PDF"(`href={withBasePath("/portfolio.pdf")}`, `download`), GitHub, 이메일.
  - `ProjectCard({ project }: { project: CaseStudyProject })` — 카드 전체가 `next/link`로 `/projects/${id}/`. 이미지 있으면 `withBasePath(\`/${images[0]}\`)`, 없으면 회색 박스 대신 `caseStudy.summary` + `회사 · 기간`.
  - `CaseStudiesSection` — 카드 7개 + "전체 프로젝트 보기" → `/archive/`.
  - `SkillsSection` 분류(이 순서·이 값 그대로):
    주력: TypeScript, React, Next.js, Vue 3 / 상태·데이터: TanStack Query, Pinia, Zod / 테스트·품질: Playwright, Storybook / 빌드·배포: Vite, Docker, Nginx, GitLab CI/CD, AWS S3·CloudFront / 그 외: Spring Boot, Flutter
  - `ExperienceSection`: role 아래 `summary`(있을 때만).
  - `Navbar` 항목: `사례 → /#case-studies`, `기술 → /#skills`, `경력 → /#experience`, `next/link` 사용.

- [ ] **Step 1: 실패하는 테스트** `e2e/main.spec.ts`
  - 메인에 사례 카드 링크 7개, 각 `href`가 `/portfolio/projects/<id>/`
  - 이미지 없는 `legal-management-system` 카드에 해당 `summary` 텍스트 표시
  - 기술 섹션에 `"빌드·배포"` 분류와 `"GitLab CI/CD"` 존재
  - Hero에 `"포트폴리오 PDF"` 링크만 있고 `"이력서"` 텍스트를 가진 링크는 0개
  - (Review Focus 2) `projects/legal-management-system/`에서 내비 "기술" 클릭 → URL이 `/portfolio/#skills`, `#skills` 섹션이 viewport 안
  - `test.use({ reducedMotion: "reduce" })` 블록: `[data-stage]` 4개 모두 computed `animation-name`이 `none`
- [ ] **Step 2:** `pnpm build && pnpm test:e2e` → FAIL
- [ ] **Step 3:** 구현 및 삭제 파일 제거(참조가 남지 않게 `pnpm build`로 확인)
- [ ] **Step 4:** `pnpm build && pnpm test:e2e && pnpm test && pnpm lint` → 모두 통과
- [ ] **Step 5:** 커밋 `feat: 메인 페이지를 포트폴리오 구성으로 재구성`

### Task 8: 아카이브 페이지

**Files:**
- Create: `app/archive/page.tsx`, `e2e/archive.spec.ts`

**Interfaces:**
- Consumes: `getArchiveRows`
- Produces: `/archive/` — 제목 "전체 프로젝트", `<table>` 열 `연도 | 프로젝트 | 회사 | 기술`, `href`가 있는 행은 프로젝트명을 `next/link`로, 상단에 "← 메인으로". Navbar 포함.

- [ ] **Step 1: 실패하는 테스트** — `tbody tr` 17개. `"법무관리 시스템 재구축"` 링크 href `/portfolio/projects/legal-management-system/`. `"울진군 하수관로 운영관리 시스템"` 행에는 링크 없음. 메인의 "전체 프로젝트 보기" 클릭 → `/portfolio/archive/`.
- [ ] **Step 2:** FAIL 확인 → **Step 3:** 구현 → **Step 4:** PASS, `pnpm lint`
- [ ] **Step 5:** 커밋 `feat: 전체 프로젝트 아카이브 페이지 추가`

### Task 9: 한글 웹폰트 · 메타데이터

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `e2e/meta.spec.ts`

**Interfaces:**
- `next/font/google`의 `Noto_Sans_KR`(weight 400·500·600·700, CSS 변수 `--font-noto-sans-kr`)을 본문 기본 폰트로, 영문 Geist는 유지(코드 블록은 Geist Mono).
- metadata: `title: "이성준 - 프론트엔드 개발자 포트폴리오"`, `description: "업무 시스템 화면 설계부터 테스트·무중단 배포까지 다루는 프론트엔드 개발자 이성준의 포트폴리오입니다."`, `openGraph: { title, description, type: "website", locale: "ko_KR" }`, robots 유지.

- [ ] **Step 1: 실패하는 테스트** — 메인 `title`이 위 값, `body` computed `font-family`에 `Noto Sans KR` 포함, `meta[name="robots"]` content에 `noindex`.
- [ ] **Step 2:** FAIL → **Step 3:** 구현 → **Step 4:** PASS
- [ ] **Step 5:** 커밋 `feat: 한글 웹폰트와 메타데이터 정비`

### Task 10: 인쇄 페이지 · PDF 생성 · CI

**Files:**
- Create: `app/export/page.tsx`, `scripts/generate-pdf.mjs`, `e2e/pdf.spec.ts`
- Modify: `app/globals.css`, `package.json`, `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `CaseStudyBody`, `getCaseStudies`, `PROFILE`, `startServer`
- Produces:
  - `/export/` (메뉴에 노출 안 함, Navbar·Footer 없음): 표지(이름·직함·positioning·metrics·경력 4개 회사·기간·GitHub·이메일·사이트 주소) + 사례 7개를 `CaseStudyBody`로. 각 사례는 `break-before: page`. `@media print`에서 애니메이션·다크 배경 제거, 이미지는 첫 장만.
  - `scripts/generate-pdf.mjs`: `startServer(4174)` → `chromium.launch()`(`@playwright/test`) → `goto("http://localhost:4174/portfolio/export/")` → `emulateMedia({ media: "print" })` → `document.fonts.ready` 대기 → `page.pdf({ path: "out/portfolio.pdf", format: "A4", printBackground: true, margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" } })` → 서버·브라우저 종료.
  - scripts: `"build:pdf": "node scripts/generate-pdf.mjs"`, `"build": "pnpm build:site && pnpm build:pdf"`.
  - `deploy.yml`: `Install dependencies` 다음에 `pnpm exec playwright install --with-deps chromium`, `pnpm test`, `pnpm check:content`. `Build with Next.js` 다음에 `pnpm test:e2e`.

- [ ] **Step 1: 실패하는 테스트** `e2e/pdf.spec.ts`
  - (Review Focus 4) `out/portfolio.pdf` 존재, `/Type /Page`(뒤에 `s`가 아닌 것) 개수 ≥ 8, 파일 바이트에 `NotoSansKR` 문자열 포함(한글 폰트 임베드)
  - (Review Focus 1) `request.get("portfolio.pdf")` → 200, `content-type` `application/pdf`
  - 메인 Hero의 "포트폴리오 PDF" 링크 href가 `/portfolio/portfolio.pdf`
- [ ] **Step 2:** `pnpm build && pnpm test:e2e` → FAIL
- [ ] **Step 3:** 구현
- [ ] **Step 4:** `pnpm build && pnpm test:e2e` → PASS. 생성된 PDF를 직접 열어 표지·페이지 나눔·도식·한글을 눈으로 확인하고 결과를 사용자에게 보고.
- [ ] **Step 5:** 커밋 `feat: 포트폴리오 PDF 빌드 시 자동 생성`

---

## 코드 작업 이후: 사례 인터뷰 (코드 태스크 아님)
Task 10까지 끝나면 사이트 구조는 완성되고 `pnpm check:content`만 실패한다. 이 상태에서는 `main` 배포가 CI에서 막히는 것이 의도된 동작이다. 이후 사례마다(법무관리부터) 다음 순서로 진행한다.
1. 질문: 역할·팀 규모 → 문제별 "무엇이 위험했나 / 무엇을 검토했나 / 왜 이것을 골랐나 / 결과 수치" → 회고 → 도식·축약 코드로 보여 줄 장면
2. 답변으로 `data/projects.ts`의 해당 `caseStudy`를 채우고 사용자 확인
3. 새 도식이 필요하면 `DiagramId`에 추가하고 Task 6 방식으로 컴포넌트 + 테스트
4. Hero 수치 3개·문구, 경력 `summary`도 인터뷰 중 확정. 이력서 PDF 대조에서 나온 확인 사항을 함께 처리(IP관리 5개 화면, 60초→1초는 닷 모놀리스 전체 성과로 이미 확정): 약 10,000줄 계약등록 화면 분리가 "설계"까지인지 완료인지와 결과, E2E 정산 조합 326 수치의 이력서 반영 여부, 프리랜서 기간(2025.05~08)의 이력서 경력란 누락
5. `pnpm check:content`가 통과하면 `develop` → `main` 머지로 배포

## 최종 검증
- `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e` 모두 통과
- Chrome DevTools MCP로 메인·사례·아카이브를 라이트/다크, 모바일 폭(375px)에서 확인, Hero 점등 애니메이션 확인
