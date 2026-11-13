import type { Project } from "@/app/types/project";

export const PROJECTS_DATA: Project[] = [
  {
    id: "enterprise-legal-management",
    title: "계약 검토·관리 시스템 재구축",
    description:
      "현업 부서가 계약 검토를 요청하고 표준계약서·계약서를 찾는 시스템",
    company: "㈜키다리스튜디오",
    period: "2026.08. ~ 2026.10.",
    techStack: [
      "TypeScript 7",
      "Next.js 16",
      "React 19",
      "Ant Design 6",
      "TanStack Query",
      "iron-session",
      "Zod",
      "Feature-Sliced Design",
      "Docker",
      "Nginx",
      "GitLab CI/CD",
      "AWS EC2·ALB·ECR",
    ],
    images: [],
    homeOrder: 1,
    caseStudy: {
      team: "프런트엔드 1 · 백엔드 2",
      summary:
        "브라우저 스크립트에서 토큰을 분리한 BFF 인증과, 헬스체크를 통과한 버전만 전환하는 blue/green 배포를 설계·구현",
      background:
        "2008년경 구축된 JSP 레거시 시스템을 대체하는 신규 시스템입니다. 계약 정보 오입력을 줄이고 이후 AI 기반 계약서 정보 추출과 콘텐츠 IP·계약 관리 시스템 연동으로 업무를 자동화하기 위한 기반입니다.",
      problems: [
        {
          title:
            "Next.js blue/green 배포 후 구버전 탭에서 나던 Server Action 404를 배포 ID 라우팅으로 해결",
          problem:
            "신규 구축이라 배포 구조부터 정해야 했습니다. 업무 시간 중에도 배포해야 했고 여러 단계의 신청서나 긴 폼을 작성하는 화면이 많았습니다. 배포 때마다 작성 중인 내용이 사라지면 업무 중단과 문의로 이어질 위험이 있었습니다. 컨테이너를 내렸다가 다시 띄우는 방식에서는 교체하는 동안 들어온 요청이 실패하고 처리 중이던 요청도 끊깁니다. 새 버전이 뜨지 않거나 떠도 정상 동작하지 않으면 서비스가 멈출 위험도 있었습니다. 트래픽을 안전하게 넘긴 뒤에도 문제가 남는지 로컬에서 빌드를 교체해 재현해 보니 버전 스큐(version skew)가 생겼습니다. 배포 전에 열어 둔 탭(구버전 탭)이 이전 빌드의 코드로 새 서버를 호출하는 현상입니다. 링크 이동은 전체 새로고침으로 복구됐지만 Server Action은 404로 실패했습니다. 빌드마다 바뀌는 액션 ID를 새 서버가 찾지 못했기 때문입니다. 새로고침하면 입력 중이던 내용도 사라졌습니다.",
          solution:
            "제공된 인프라가 EC2·ALB 구성이어서 ECR 이미지를 받아 인스턴스 안의 Nginx로 blue/green 전환을 구현했습니다. ALB가 백엔드 분기도 함께 맡고 있어 ALB 타깃 그룹을 바꾸는 방식으로는 배포마다 규칙을 바꿔야 하고 영향 범위가 백엔드까지 넓어집니다. 그래서 전환과 검사·원복을 인스턴스 안에서 끝내도록 했습니다. 대기 슬롯에 새 컨테이너를 띄워 헬스체크를 통과해야 upstream을 전환합니다. 헬스체크에 실패하면 새 컨테이너를 중지하고 `nginx -t`나 reload가 실패하면 설정을 원복한 뒤 새 컨테이너를 중지합니다.\n\n버전 스큐는 Vercel Skew Protection과 같은 원리의 배포 단위 라우팅을 EC2 위 Nginx로 구현해 풀었습니다. Next.js `deploymentId`만 설정하는 방법은 문서상 배포별로 요청을 라우팅할 때만 버전 스큐를 피합니다. 모든 트래픽을 한 번에 새 슬롯으로 넘기는 구조에서는 재현해 봐도 404가 그대로여서 Nginx 라우팅과 함께 썼습니다. 빌드마다 `deploymentId`를 넣으면 Next.js가 Server Action·RSC 요청에는 `X-Deployment-Id` 헤더를, 정적 자산(`/_next/static`·폰트·`/_next/image`) 요청에는 `?dpl=` 쿼리를 붙입니다. Nginx map에서 두 값을 조합해 배포 ID를 꺼낸 뒤 이전 배포 ID의 요청은 이전 슬롯으로 보냅니다. 둘 다 없는 요청, 즉 URL 직접 진입·새로고침 같은 페이지 요청, public 파일 직접 참조, 직접 작성한 fetch 등은 현재 활성 슬롯으로 보냅니다.\n\n이전 컨테이너를 오래 남겨 두기만 해서는 전환 뒤 구버전 탭의 요청도 새 슬롯으로 갑니다. 그래서 유지 기간은 배포 ID 라우팅과 함께 둡니다. 이전 컨테이너는 새 컨테이너와 같은 EC2 인스턴스의 메모리를 나눠 쓰기 때문에 전환 후 30분만 남겨 둡니다. 유지 기간이 끝나면 먼저 그 배포 ID를 Nginx 만료 목록에 넣고 reload합니다. 이때부터 새 요청에는 `X-Deployment-Expired` 헤더를 붙인 410을 바로 반환합니다. 그다음 `SIGTERM`을 보내 최대 30초의 종료 유예 안에 기존 요청을 정리하고 내리도록 설정했습니다. 슬롯이 둘뿐이라 30분 안에 다시 배포하면 이전 슬롯을 비워야 합니다. 이때는 유지 타이머를 취소하고 같은 만료 절차를 바로 실행한 뒤, 비운 슬롯에 새 버전을 띄웁니다.\n\n프런트엔드는 `window.fetch`를 감싼 전역 래퍼로 Next.js 내부의 Server Action·RSC 요청까지 확인합니다. 백엔드 API의 410과 섞이지 않도록 `X-Deployment-Expired` 헤더가 붙은 410만 배포 만료로 보고 청크 로드 실패는 `ChunkLoadError`로 감지합니다. 폼이 수정된 상태(dirty)가 아닐 때만 바로 새로고침합니다. 실패할 때마다 무조건 새로고침하면 입력 중이던 내용이 사라지기 때문입니다. 수정된 상태라면 이전 화면에 머무르는 한 Server Action·RSC·청크 요청이 계속 410으로 실패합니다. 이 경우에는 닫을 수 없는 안내 모달로 새로고침을 유도합니다. 배포 만료(410)로 강제 새로고침이 필요한 상황에서 작성 중인 내용을 잃지 않도록 안전장치를 두었습니다. 검토요청 등록 같은 주요 등록 폼에는 민감 정보가 없어서 410을 감지하면 첨부 파일을 뺀 입력값을 `draft:{사용자ID}:{페이지경로}` 키로 `sessionStorage`에 백업합니다. 이 백업은 새로고침 복원 직후나 정상 제출·로그아웃 시 즉시 삭제하도록 했습니다.",
          result:
            "새 버전은 헬스체크를 통과한 뒤에만 트래픽을 받고 전환 전 검증에 실패하면 기존 버전이 서비스를 유지합니다. 구버전 탭의 Server Action과 지연 로드 청크는 전환 후 최대 30분(그 사이 다시 배포하면 그 시점까지) 이전 버전이 처리하고 새로 연 탭은 처음부터 새 버전을 받습니다. 주요 등록 폼은 유지 기간이 지나도 첨부 파일 외의 입력을 잃지 않고 다시 제출할 수 있습니다. 로컬과 개발 환경에서 폼에 입력해 둔 탭을 연 채 슬롯을 전환했습니다. Nginx 액세스 로그에는 유지 기간 동안 이전 슬롯이 요청을 처리한 기록이 남았습니다. E2E 시나리오에서는 유지 시간을 단축해 만료 목록 반영과 Nginx reload까지 실행한 뒤 dirty 상태에 따른 모달·복원과 자동 새로고침을 확인했습니다. 전환 뒤 런타임 오류율 기반의 자동 롤백은 구현하지 않았고 헬스체크·설정 검증 실패 시의 중단과 원복까지만 자동화했습니다. 다만 이전 슬롯이 남아 있는 동안은 수동으로 바로 되돌릴 수 있습니다. 운영은 오픈 전이라 blue/green은 개발 환경까지 적용했습니다.",
          visual: {
            type: "diagram",
            id: "blue-green-deploy",
            caption:
              "Nginx map이 배포 ID로 요청을 활성 슬롯·이전 슬롯·410으로 나누는 구조와, 같은 번호(①②③)로 대응하는 배포 순서",
          },
        },
        {
          title:
            "로그인 토큰을 BFF 암호화 쿠키로 옮겨 XSS 탈취를 막고 동시 refresh 호출을 10회에서 1회로 통합",
          problem:
            "신규 구축이라 토큰을 어디에 둘지부터 정해야 했습니다. 브라우저 저장소에 두면 XSS로 탈취될 위험이 있었습니다. 쿠키로 옮기면 브라우저가 자동으로 전송하니 CSRF에 대비해야 했습니다. BFF 핸들러가 병렬로 호출되면 같은 토큰으로 refresh가 동시에 나갑니다. 그러면 토큰 회전 정책 때문에 일부 요청이 실패할 수 있었습니다.",
          solution:
            "BFF가 백엔드 호출을 대신 맡고 액세스·리프레시 토큰은 iron-session으로 암호화한 HttpOnly 쿠키에 담았습니다. 브라우저는 백엔드를 직접 호출하지 않습니다. 로그인과 토큰 회전은 백엔드가 맡고 있어 프런트에는 토큰을 쿠키에 암호화해 담는 기능만 필요했습니다. 그래서 OAuth 중심의 인증 프레임워크인 NextAuth.js 대신 이 기능만 제공하는 iron-session을 선택했습니다.\n\n만료 5분 전부터 자동으로 갱신하고 진행 중인 refresh Promise를 토큰별로 공유해 같은 서버 모듈 안의 동시 요청을 하나로 합쳤습니다. 서버를 넘는 경합은 백엔드의 재사용 유예가 처리합니다.\n\n세션 쿠키는 `SameSite=Lax`로 설정하고 GET으로 동작하는 세션 파기 경로는 `Sec-Fetch-Site`를 허용 목록 방식으로 검사해 로그아웃 CSRF를 막았습니다.",
          result:
            "토큰 값을 브라우저 스크립트에서 읽을 수 없게 했습니다. 로컬 프로덕션 빌드에서 만료 직전 세션으로 동시 요청 10건을 보내자 refresh 호출이 10회에서 1회로 줄었습니다.",
          visual: {
            type: "diagram",
            id: "bff-auth-flow",
            caption:
              "BFF가 토큰을 암호화 쿠키에 담고 백엔드 호출을 대신하는 인증 흐름",
          },
        },
        {
          title:
            "백엔드 API 연동에서 mock을 전체로만 켜고 끌 수 있던 문제를 MSW 서버 가로채기로 해결해 먼저 나온 API부터 엔드포인트 단위로 실API 전환",
          problem:
            "백엔드 API는 화면 개발보다 늦게, 도메인별로 나눠서 나왔습니다. API를 기다리지 않도록 mock 72개로 화면을 먼저 만들었지만 mock은 환경변수 하나로 전체를 켜거나 끄는 구조였습니다. 먼저 나온 API만 골라 실서버에 붙일 방법이 없었습니다. mock 로그인이 발급한 가짜 JWT로는 실API가 모두 401을 반환했습니다. 인증부터 실API로 넘겨야 나머지도 전환할 수 있었습니다. 또 이 앱에서는 브라우저가 백엔드를 직접 부르지 않고 RSC·Server Action·BFF가 서버에서 호출해서 브라우저 Service Worker 방식의 mock으로는 요청을 가로채지 못했습니다.",
          solution:
            '세 가지 방식을 비교했습니다. 경로 allowlist 환경변수는 구현과 검증까지 마쳤지만 API가 나올 때마다 설정을 바꿔야 했고 catch-all 프록시는 mock 서버 동작을 직접 재현해 유지해야 했습니다. MSW는 표준 도구지만 Next.js App Router 서버 쪽 가로채기가 프로세스 분리 문제로 미해결 종료된 이슈(msw#1644)가 있었기 때문에 공통코드·부서 도메인으로 먼저 파일럿을 돌렸습니다. Next 16 + Turbopack에서 재현되지 않는 것을 확인한 뒤 Route Handler 72개를 리졸버 40개로 이관했습니다.\n\n`instrumentation.ts`에서 mock 모드일 때만 `server.listen({ onUnhandledRequest: "bypass" })`로 서버의 fetch를 가로챕니다. 핸들러가 있는 엔드포인트는 mock이 응답하고 없는 엔드포인트는 실API로 그대로 나갑니다. API가 나오면 해당 핸들러를 지우는 것으로 전환됩니다.\n\nmock 로그인은 아무 자격증명에나 JWT를 발급해서 운영 산출물에 실리면 안 됩니다. 리뷰에서 `NEXT_PUBLIC_*` 값은 빌드 시점에 변수가 있어야만 상수로 인라인된다는 것을 확인했습니다. 변수가 없으면 런타임 조회로 남아 mock 코드가 산출물에서 제거되지 않습니다. 이 때문에 운영·스테이징 빌드 스크립트에 `NEXT_PUBLIC_USE_MOCK=false`를 고정했습니다.\n\n같은 핸들러를 Vitest의 `setupServer`로 통합테스트에서도 재사용했습니다. async Server Component는 테스트에서 렌더링하기 어려워, 테스트 경계를 API 게이트웨이와 Server Action 계층에 뒀습니다. 화면에서 쓰는 zod 스키마로 mock 응답과 실API 응답을 모두 검증하는 계약 테스트를 뒀습니다. 백엔드 스펙이 바뀌면 mock과 실API 중 어긋난 쪽에서 테스트가 실패합니다. 가로채기 자체가 동작하는지 확인하는 스모크 테스트도 둬서 Next를 업그레이드할 때 msw#1644류 문제가 다시 생기면 바로 알 수 있게 했습니다.',
          result:
            "인증·사용자·메뉴·대시보드·공통코드부터 실API로 순차 전환했습니다. 검토요청은 목록·엑셀 다운로드는 실API, 상세·수정·상태 전이는 mock으로 한 업무 흐름 안에서도 엔드포인트 단위로 섞어 썼습니다. API가 나오면 프런트엔드에서 할 일은 해당 핸들러 삭제와 계약 테스트 통과 확인뿐이었습니다. 운영 빌드 산출물을 검사한 결과 mock 시드와 `setupServer`는 0건이었습니다. 배포 이미지에 env 파일로 mock을 켜 봐도 서버 산출물에 MSW 코드가 없어 동작하지 않았습니다. mock 리졸버가 UI 배럴을 거치지 않도록 import를 바꿔 dev 서버 부팅도 약 1.3~1.7초에서 0.66초로 줄었습니다. dev 서버가 모듈을 다시 불러온 뒤 가로채기가 풀리는 현상은 근본 원인을 확정하지 못해 재시작으로 대응하고 있습니다. mock 코드 파일은 Docker 이미지에 포함된 채 빌드 값으로만 비활성화됩니다.",
          visual: {
            type: "diagram",
            id: "msw-mock-switch",
            caption:
              "핸들러 유무로 mock과 실API가 나뉘는 개발 환경, 같은 핸들러로 계약을 검증하는 테스트, mock 코드를 제거하는 운영 빌드",
          },
        },
      ],
    },
  },
  {
    id: "external-settlement-system",
    title: "저작권자용 외부정산 시스템 기능 확장",
    description:
      "저작권자가 정산을 조회하고 관리자가 정산서를 올리는 웹 페이지",
    company: "㈜키다리스튜디오",
    period: "2026.03. ~ 2026.04.",
    techStack: [
      "JavaScript",
      "TypeScript 6",
      "Vue 3",
      "Vite 8",
      "Vue Router",
      "Pinia",
      "Vuetify 3",
      "RealGrid2",
      "AWS S3·CloudFront",
    ],
    images: [],
    homeOrder: 3,
    caseStudy: {
      team: "프런트엔드 1 · 백엔드 1",
      summary:
        "양식이 다른 3개 정산 유형을 설정 추가 중심으로 늘릴 수 있게 정산 조회 화면을 설계",
      background:
        "저작권자가 정산 내역을 확인하는 웹 페이지입니다. 봄툰KR 정산 하나에 맞춰 개발돼 있었는데, 양식이 다른 소설유통·부가판권 정산도 이 웹 페이지에서 제공해야 했습니다.",
      problems: [
        {
          title:
            "봄툰KR 하나에 맞춰진 정산 화면을 유형별 설정 객체로 분리해 3개 유형으로 확장하고 설정 누락을 타입 체크로 검출",
          problem:
            "세 유형은 정산서 양식이 서로 달라 정산 내역 화면, 엑셀 업로드 시트, 안내 메일 항목이 모두 달랐습니다. 화면은 봄툰KR 기준으로 짜여 있었습니다. 이 차이를 화면 코드의 분기로 처리하면 유형이 늘 때마다 목록·업로드·메일 화면을 모두 고쳐야 했습니다.",
          solution:
            "목록·업로드·메일 화면이 유형마다 다르게 쓰는 값과 데이터 변환 함수를 유형별 설정 객체로 분리했습니다. 처음에는 추상 클래스 기반 전략 패턴으로 만들었습니다. 하지만 유형 간 차이가 대부분 값이어서 유형 키로 꺼내 쓰는 설정 객체로 단순화했습니다. 화면은 현재 정산 유형의 설정에 따라 탭과 엑셀 시트 매핑을 구성합니다. 설정 객체에는 TypeScript의 `satisfies`를 적용해, 한 유형이라도 설정이 빠지면 타입 오류가 나게 했습니다.\n\n부가판권은 정산요약 탭을 표 대신 내역서 양식으로 보여 줘야 했습니다. 화면 코드가 유형 이름으로 분기하면 유형을 추가할 때마다 화면을 다시 고쳐야 합니다. 그래서 탭 설정에 표시 방식(`viewType`)을 두고, 화면은 이 값으로만 분기하게 했습니다.",
          result:
            "화면 코드에서 유형 이름으로 분기하는 곳은 0건이 됐습니다. 세 유형의 차이는 설정 파일 3개에 모였습니다. 기존 표시 방식을 쓰는 유형이라면 화면 코드를 고치지 않고 유형 키와 설정, 컬럼 정의만 추가해 붙일 수 있습니다. 설정이 하나라도 빠지면 타입 체크에서 검출됩니다.",
          visual: {
            type: "diagram",
            id: "settlement-domain-config",
            caption:
              "현재 정산 유형의 키로 목록·업로드·메일 설정을 조회해 각 화면을 구성하는 구조",
          },
        },
        {
          title:
            "배포 후 일부 사용자에게 정산 업로드 화면의 신규 컬럼이 보이지 않던 문제를 index.html과 해시 정적 자산의 캐시 정책 분리로 해결해 새로고침·재접속 시 새 배포 반영",
          problem:
            "배포 후에도 정산 업로드 화면의 신규 컬럼이 사용자마다 보였다 안 보였다 한다는 사용자·운영자 문의가 있었습니다. 이 웹 페이지는 빌드한 정적 파일을 S3에 올리고 CDN(CloudFront)으로 제공합니다. 배포마다 엣지 캐시는 전체 무효화로 비우고 있었지만, 올린 파일에 `Cache-Control` 헤더가 없었습니다. 그래서 브라우저가 `Last-Modified` 기반 휴리스틱 캐시로 이전 버전의 `index.html`을 재검증 없이 사용했습니다.",
          solution:
            "S3에 한 번에 올리던 배포를 두 단계로 나눠 파일 성격별로 캐시 정책을 다르게 줬습니다. 전부 장기 캐시하면 `index.html`이 갱신되지 않고, 전부 `no-cache`로 두면 바뀌지 않은 JS·CSS까지 매번 재검증하기 때문입니다.\n\nVite가 빌드한 `assets/*`는 파일명에 내용 해시가 붙어 같은 URL의 내용이 바뀌지 않습니다. 그래서 `max-age=31536000, immutable`로 1년간 재검증 없이 캐시합니다. `index.html`은 URL이 고정된 채 배포마다 내용이 바뀌고 어떤 해시 파일을 불러올지 정합니다. 그래서 `index.html` 등 나머지 파일은 `no-cache`로 올렸습니다. 저장하지 않고 매번 본문 전체를 받는 `no-store`와 달리, `no-cache`는 사본을 저장하되 쓰기 전에 ETag로 서버에 변경 여부를 확인해 그대로면 304만 받습니다. CDN 엣지에 남은 이전 사본은 기존대로 배포 후 `/*` 무효화로 비웁니다.\n\n`assets/*`를 먼저, `index.html` 등 나머지 파일을 나중에 올리므로 새 `index.html`이 아직 없는 해시 파일을 가리키는 순간이 생기지 않습니다. 업로드할 때 이전 배포의 해시 파일은 지우지 않으므로, 배포 전에 열어 둔 탭도 이전 해시 파일을 계속 불러올 수 있습니다.",
          result:
            "브라우저가 `index.html`을 매번 재검증해 새 배포를 받고 해시 파일은 계속 장기 캐시를 사용합니다. 스테이징에서 curl로 확인한 결과 `index.html`은 `cache-control: no-cache`와 ETag가 붙어 내려왔습니다. 같은 ETag로 조건부 요청을 보내면 본문 없이 304(`X-Cache: Hit from cloudfront`)로 응답했습니다. 해시 자산은 `public, max-age=31536000, immutable`로 내려왔습니다. 엣지에 처음 요청할 때만 Miss였고 이후 요청은 Hit이었습니다. 변경 후 이전 버전 화면 관련 문의는 없었습니다.",
          visual: {
            type: "diagram",
            id: "s3-cache-policy",
            caption:
              "`Cache-Control` 없이 한 번에 올리던 배포와, 해시 자산과 나머지 파일을 나눠 올리고 `index.html`을 ETag로 재검증하는 배포의 캐시 동작 비교",
          },
        },
      ],
    },
  },
  {
    id: "ip-management-system",
    title: "콘텐츠 IP·계약 관리 시스템 개선",
    description:
      "사내 담당자가 콘텐츠 IP와 계약·정산 조건을 등록하는 업무 시스템",
    company: "㈜키다리스튜디오",
    period: "2025.10. ~ 2026.10.",
    techStack: [
      "TypeScript 6",
      "Vue 3",
      "Vite 8",
      "Vue Router",
      "Pinia",
      "RealGrid2",
      "Playwright",
    ],
    images: [],
    highlights: [
      { value: "326", label: "E2E 기준선으로 고정한 정산 조합" },
      { value: "10,374 → [실측]", label: "계약등록 화면 파일 줄 수" },
    ],
    homeOrder: 2,
    caseStudy: {
      team: "프런트엔드 1 · 백엔드 1",
      summary:
        "1만 줄 계약 화면을 326가지 조합 E2E로 검증하며 AI 에이전트로 리팩터링해 두 화면의 정산 규칙을 1곳으로 통합",
      background:
        "콘텐츠 IP를 관리하는 사내 업무 시스템입니다. 계약등록 화면은 기능 추가·수정이 어렵고 수정할 때마다 다른 화면에 회귀가 발생하던 약 1만 줄 단일 파일이었습니다.",
      problems: [
        {
          title:
            "두 화면에 중복된 정산 규칙을 326가지 조합 E2E 기준선 위에서 AI 에이전트로 리팩터링해 1곳으로 통합",
          problem:
            "계약등록·계약변경 두 화면에 같은 정산 규칙이 따로 구현돼 있었습니다. 규칙 하나를 바꾸려면 두 곳을 함께 고쳐야 했습니다. 이미 어긋난 곳도 수십 건이어서 같은 조건이어도 어느 화면에서 저장하느냐에 따라 필수 검증과 저장되는 값이 달랐습니다. 정산 입력은 정산방식·계약분류·콘텐츠형태·지급방식의 조합에 따라 달라집니다. 그래서 코드를 고치면 어느 조합에서 회귀가 생겼는지 알아차리기도, 원인을 찾기도 어려웠습니다.",
          solution:
            "리팩터링에 앞서 4개 축의 조합 중 분석상 도달 가능한 326가지의 현재 동작을 Playwright E2E로 고정해 기준선으로 삼았습니다. 기준선을 만들며 찾은 결함도 고치지 않고 그대로 담았습니다. 결함까지 고치면 리팩터링 중에 바뀐 동작이 개선인지 회귀인지 기준선으로 가를 수 없기 때문입니다.\n\n먼저 도달할 수 없던 일괄등록 코드를 지운 뒤 네 단계로 나눠 리팩터링했습니다. ① 입력·정산 규칙을 순수 함수 모듈 하나로 모으되 화면마다 달랐던 동작은 화면별 분기로 옮기고, ② 정산 입력표의 그리드 설정을 공유 composable로 통일하고, ③ 계약 조건별 화면 표시를 선언형으로 바꾸고, ④ 등록 화면을 단계·영역별 컴포넌트로 나눴습니다.\n\n구현은 AI 코딩 에이전트로 했습니다. 단계마다 같은 E2E를 다시 통과해야 다음 단계로 넘어갔습니다. 셀렉터 같은 테스트 코드는 고칠 수 있어도 기존 단언은 바꾸지 않는다는 규칙도 두었습니다. 에이전트가 테스트를 바꿔 통과시키지 못하게 하기 위해서입니다. 일괄등록 코드 제거와 ① 단계에서는 변경 전후 코드가 보내는 저장 요청도 비교했습니다.",
          result:
            "정산 규칙이 정의된 곳은 계약등록·계약변경 2곳에서 1곳으로 줄었습니다. 계약등록 화면 파일은 10,374줄에서 [실측 필요]줄이 됐습니다. 일괄등록 코드 제거 단계에서는 에이전트가 사용처 검색 결과 0건을 근거로 상태값까지 지웠습니다. E2E가 이 값을 런타임에 직접 읽고 있어 단언 7건이 실패했습니다. 규칙대로 테스트가 아니라 삭제를 되돌렸습니다. 변경 전 저장 요청 291건은 새 코드에서도 모두 나왔습니다. ① 단계에서도 저장 요청을 보내는 테스트 305개의 요청이 모두 같았습니다. 네 단계를 모두 마친 코드는 같은 E2E(계약등록 171가지·계약변경 155가지 조합)를 통과했습니다. 두 화면이 다르게 동작하던 곳은 화면별 분기로 남아 있습니다. 이를 하나로 맞추는 일은 정책 판단이 필요한 별도 문제입니다. 기준선을 만들며 찾은 결함 6건은 버그인지 의도된 동작인지 기획·백엔드가 판단하도록 분리해 두었습니다. 이 E2E는 백엔드 응답을 mock으로 대체한 화면 검증입니다. CI에서 상시 실행되지는 않습니다.",
          visual: {
            type: "diagram",
            id: "e2e-regression-baseline",
            caption:
              "결함까지 포함한 현재 동작을 326가지 조합 E2E로 고정하고 일괄등록 코드 제거와 ①~④ 단계마다 같은 E2E를 다시 통과시킨 과정",
          },
        },
        {
          title:
            "계약등록 개선 요구 한 줄만 보고 기능을 없애려던 AI 에이전트의 판단을 업무 위키·명세(SDD)로 구현 전에 검증",
          problem:
            "리팩터링과 별도로 들어온 계약등록 개선 요구도 AI 코딩 에이전트로 구현했습니다. 이때 에이전트가 요구나 명세에 적힌 한 줄을 근거로 기능을 없애거나 바꾸려는 일이 생겼습니다. 리팩터링은 E2E 기준선과 같게 동작하면 됐습니다. 하지만 개선 요구는 동작을 바꾸는 일이라 기준선으로 판정할 수 없었습니다. 구현 뒤 diff를 봐도 그 해석이 업무에 맞는지는 알기 어려웠습니다.",
          solution:
            "구현에 들어가기 전 확인을 맥락과 명세 두 단계로 나눴습니다. 맥락을 위해서는 업무 매뉴얼과 용어를 정리한 업무 위키와, 세션마다 결정과 원인 조사를 남기는 작업 위키를 직접 구축했습니다. 에이전트는 이 위키에서 업무 규칙과 이전 결정을 확인한 뒤 작업합니다. 명세는 Spec Kit으로 구현 전에 작성해 에이전트의 해석이 코드보다 먼저 드러나게 했습니다. 정책 판단이 필요한 항목은 에이전트가 골라 묻게 했습니다. 기존 기능을 없애거나 막는 항목은 업무 위키에서 근거를 찾은 뒤에만 구현했습니다.",
          result:
            "명세에 있던 기능 제거는 업무 위키 어디에도 근거가 없다는 걸 확인하고 구현 전에 폐기했습니다. 반대로 로드맵 한 줄로 들어온 기능 변경은 위키 확인 대상이 아니었습니다. 그래서 요청자에게 확인하지 않고 에이전트의 해석대로 구현까지 진행했다가 전제가 틀려 폐기했습니다. 명세는 에이전트가 해석한 요구 위에서 쓰이므로 해석의 전제가 틀리면 명세도 함께 틀립니다. 이후에는 구현 전에 요청자에게 요구 원문을 받습니다.",
          visual: {
            type: "diagram",
            id: "ai-agent-guardrails",
            caption:
              "구현 전에 맥락(업무·작업 위키)과 명세(SDD)로 AI 에이전트의 판단을 걸러 낸 사례와 걸러 내지 못한 사례",
          },
        },
        {
          title:
            "운영 빌드 약 145초를 Vite 8 업그레이드로 약 35초로 줄이고 단일 청크 분리와 미사용 코드 제거로 번들을 17% 축소",
          problem:
            "운영 빌드는 로컬 개발에서 쓰는 esbuild와 달리 JavaScript 기반 싱글 스레드 번들러인 Rollup으로 돌아 약 145초가 걸렸습니다. 이 시간이 배포와 CI마다 누적됐습니다. 번들 구성도 정리돼 있지 않았습니다. 청크를 나누기 직전에는 라이브러리와 앱 코드가 2,493KiB 크기의 단일 청크에 묶여 있었습니다. 트리셰이킹되지 않는 CJS 라이브러리와, 시스템 분리 후 쓰지 않게 된 패키지·코드도 그대로 들어 있었습니다.",
          solution:
            "빌드 시간은 도구를 바꿔 줄였습니다. Vite를 5에서 8까지 올려 로컬 개발과 운영 빌드의 도구를 Rust로 작성된 번들러 Rolldown과 컴파일러 Oxc로 통합했습니다. Rolldown은 파싱·변환·코드 생성을 멀티스레드로 병렬 처리해 Rollup보다 빠릅니다.\n\n번들은 직접 정리했습니다. 번들 분석 도구로 청크 구성을 확인한 뒤 자주 바뀌지 않는 대형 라이브러리를 앱 코드와 다른 청크로 분리해, 앱 코드만 바뀌는 배포에서는 라이브러리 청크를 브라우저 캐시에서 다시 쓸 수 있게 했습니다. 트리셰이킹되지 않는 CJS 라이브러리는 ESM 버전이 있으면 ESM 버전과 네이티브 메서드로 바꾸고(lodash → `lodash-es`), ESM 버전이 없는 RealGrid는 별도 청크로 격리했습니다. 미사용 패키지와 시스템 분리 후 남은 미사용 코드도 제거했습니다.",
          result:
            "운영 빌드 시간은 업그레이드로 약 145초에서 약 35초로 약 76% 줄었습니다. JS·CSS 전체 크기는 CJS 라이브러리 교체와 미사용 코드 제거로 6,471KiB에서 5,356KiB로 약 17% 줄었습니다. 2,493KiB 단일 청크는 realgrid·vuetify·vendor·앱 코드 청크로 나뉘었습니다. 앱 코드 한 줄만 바꿔 다시 빌드하면 realgrid·vuetify·vendor 청크는 해시가 그대로여서, 재배포 때 새로 받아야 하는 용량이 3,827KiB에서 1,380KiB로 약 64% 줄었습니다.",
          visual: {
            type: "diagram",
            id: "vite-rolldown-chunks",
            caption:
              "번들러를 Rolldown으로 통합하고 단일 청크를 realgrid·vuetify·vendor·앱 코드로 나눈 변경 전후",
          },
        },
        {
          title:
            "5개 화면에 복제돼 검증 규칙이 제각각이던 콘텐츠 입력 폼을 공통 컴포넌트로 통합해 검증 기준을 1곳으로 통일",
          problem:
            "5개 화면에 중복 구현된 콘텐츠 정보 입력 영역은 필수값·검증 규칙이 서로 달라 오류가 발생했습니다.",
          solution:
            "계약등록, 콘텐츠 등록·변경, 영상 등록·변경 5개 화면에 복제돼 있던 콘텐츠 입력 폼은 공통 컴포넌트 하나로 통합해 필수값과 검증 규칙의 기준을 1곳으로 모았습니다. 그룹콘텐츠 중복 검사는 공통 composable로 분리했습니다.",
          result: "콘텐츠 입력 폼의 기준이 5곳에서 1곳으로 줄었습니다.",
          visual: {
            type: "diagram",
            id: "content-form-unify",
            caption:
              "화면마다 복제된 입력 폼을 공통 컴포넌트와 composable로 모은 변경 전후",
          },
        },
      ],
    },
  },
  {
    id: "dyson-live-monorepo",
    title:
      "다이슨 사전알림·혜택 프로모션 라이브 방송 페이지의 PHP → Next.js 모노레포 전환",
    description:
      "시청자가 알림을 신청하고 운영자가 백오피스에서 신청 내역을 보는 서비스",
    company: "프리랜서",
    period: "2025.09.",
    techStack: [
      "TypeScript 5",
      "React 19",
      "Next.js 15",
      "Ant Design 5",
      "Tailwind CSS 4",
      "pnpm workspaces",
      "Turborepo",
      "Spring Boot",
      "MySQL",
      "Docker",
      "AWS ECR·ECS",
    ],
    images: [],
  },
  {
    id: "ats-monitoring-system",
    title: "사람인 채용관리솔루션(리버스) 정부지원사업 모니터링 시스템 개발",
    description: "관리자가 지원사업 대시보드·리포트·설문을 관리하는 웹 시스템",
    company: "프리랜서",
    period: "2025.05. ~ 2025.08.",
    techStack: ["TypeScript 5", "Next.js 15", "NextAuth.js", "Ant Design 5"],
    images: ["ats/image-1.webp"],
    caseStudy: {
      team: "프런트엔드 1 · 백엔드 1",
      summary:
        "정부지원사업 모니터링 웹 시스템의 Next.js 초기 환경과 개발 아키텍처를 설계하고 NextAuth.js 인증을 연동",
      background:
        "사람인 채용관리솔루션(리버스)의 정부지원사업 운영 현황을 모니터링하는 관리자용 웹 시스템입니다.",
      problems: [
        {
          title: "Next.js 초기 환경과 폴더·레이어 구조, 데이터 페칭 방식, 공통 컴포넌트 설계",
          problem: "",
          solution:
            "폴더·레이어 구조, 상태·데이터 페칭 방식, 공통 컴포넌트를 설계했습니다.",
          result: "",
        },
        {
          title: "NextAuth.js 기반 사용자 인증 연동",
          problem: "",
          solution: "NextAuth.js 기반 사용자 인증을 연동했습니다.",
          result: "",
        },
      ],
    },
  },
  {
    id: "accessibility-ebook-viewer",
    title: "웹 기반 접근성 전자책 뷰어",
    description: "시각장애인이 음성과 점자 디스플레이로 책을 읽는 서비스",
    company: "㈜닷",
    period: "2024.11. ~ 2024.12.",
    techStack: ["JavaScript", "Vue 3"],
    images: ["ebook-reader-web/image-1.webp", "ebook-reader-web/image-2.webp"],
  },
  {
    id: "design-system",
    title: "디자인 시스템 구축",
    description:
      "개발자와 디자이너가 함께 쓰는 버튼·입력창 같은 화면 부품 모음",
    company: "㈜닷",
    period: "2024.08. ~ 2024.10.",
    techStack: ["TypeScript 5", "Vue 3", "Storybook", "Figma"],
    images: [
      "design-system/image-1.webp",
      "design-system/image-2.webp",
      "design-system/image-3.webp",
      "design-system/image-4.webp",
    ],
    homeOrder: 6,
    caseStudy: {
      team: "프런트엔드 1",
      summary:
        "아토믹 디자인 기반 컴포넌트 라이브러리와 디자인 토큰, Storybook·Chromatic 시각적 회귀 테스트를 구축",
      background:
        "개발자와 디자이너가 함께 쓰는 컴포넌트 라이브러리와 디자인 토큰 시스템입니다.",
      problems: [
        {
          title: "아토믹 디자인 패턴으로 컴포넌트 구조 설계",
          problem: "",
          solution:
            "아토믹 디자인 패턴으로 컴포넌트 구조를 설계하고, 컴포넌트마다 하나의 역할만 맡도록 나눴습니다.",
          result: "",
        },
        {
          title: "색상·간격·타이포그래피 디자인 토큰을 정의하고 디자이너와 컴포넌트 기준 조율",
          problem: "",
          solution:
            "디자인 토큰(색상·간격·타이포그래피 등)을 정의하고 공통 스타일을 적용했습니다. 디자이너와 토큰·컴포넌트 기준을 조율했습니다.",
          result: "",
        },
        {
          title: "Storybook으로 컴포넌트를 문서화하고 Chromatic으로 시각적 회귀 테스트 자동화",
          problem: "",
          solution:
            "Storybook으로 컴포넌트를 문서화하고 다른 개발자에게 사용법을 안내했습니다. Chromatic으로 시각적 회귀 테스트를 자동화했습니다.",
          result: "",
        },
      ],
    },
  },
  {
    id: "customer-support-site",
    title: "고객지원 사이트 구축",
    description: "고객이 여러 언어로 문의를 남기고 담당자가 처리하는 지원 창구",
    company: "㈜닷",
    period: "2024.07.",
    techStack: ["TypeScript 5", "Vue 3", "i18n", "Java", "Spring Boot"],
    images: [
      "support/image-1.webp",
      "support/image-2.webp",
      "support/image-3.webp",
    ],
  },
  {
    id: "frontend-framework-refactoring",
    title: "프런트엔드 공통 프레임워크 아키텍처 리팩터링",
    description: "오래 운영돼 온 사내 웹 서비스들이 공통으로 쓰는 화면 기반 코드",
    company: "㈜닷",
    period: "2024.05.",
    techStack: ["TypeScript", "Vue 3", "Vuex", "Pinia", "gulp.js"],
    images: [],
  },
  {
    id: "wysiwyg-editor",
    title: "점자 디스플레이용 웹 WYSIWYG 에디터 개발",
    description: "점자 기기로 읽을 문서를 보이는 그대로 편집하는 웹 도구",
    company: "㈜닷",
    period: "2023.09. ~ 2024.04.",
    techStack: ["JavaScript", "Vue 3", "CKEditor 5"],
    images: ["dot-editor/image-1.webp", "dot-editor/image-2.webp"],
    coverPosition: "left top",
    highlights: [{ value: "20s → 1s", label: "대용량 문서 로딩" }],
    homeOrder: 4,
    caseStudy: {
      team: "프런트엔드 2 · 백엔드 1",
      summary:
        "가상 스크롤로 대용량 문서 로딩을 20초에서 1초로 줄이고 CKEditor 5 기반 접근성 검사 기능을 구현",
      background:
        "시각장애인을 위한 점자 디스플레이(Dot Pad) 출력에 최적화된 웹 기반 WYSIWYG 에디터입니다.",
      problems: [
        {
          title: "대용량 문서 로딩을 가상 스크롤로 20초에서 1초로 단축",
          problem: "",
          solution: "가상 스크롤을 직접 구현했습니다.",
          result:
            "대용량 문서 로딩 시간을 20초에서 1초로(95% 이상) 단축했습니다.",
          visual: {
            type: "metrics",
            items: [
              { label: "대용량 문서 로딩", before: "20초", after: "1초" },
            ],
          },
        },
        {
          title: "CKEditor 5 기반 웹 접근성 검사(alt 텍스트·색상 대비) 기능 구현",
          problem: "",
          solution:
            "CKEditor 5 기반으로 웹 접근성 검사(alt 텍스트·색상 대비 등) 기능을 구현했습니다.",
          result: "",
        },
      ],
    },
  },
  {
    id: "mobile-ebook-viewer",
    title: "모바일 기반 접근성 전자책 뷰어",
    description: "시각장애인이 휴대폰으로 디지털 음성 도서를 읽는 앱",
    company: "㈜닷",
    period: "2023.03. ~ 2023.08.",
    techStack: ["Flutter", "Dart", "Swift"],
    images: [],
  },
  {
    id: "cloud-file-management",
    title: "클라우드 기반 파일 관리 시스템",
    description: "권한에 따라 사용자별로 파일을 올리고 내려받는 저장 서비스",
    company: "㈜닷",
    period: "2023.01. ~ 2023.02.",
    techStack: [
      "JavaScript",
      "Vue 3",
      "Spring Boot",
      "MyBatis",
      "MariaDB",
      "AWS S3",
    ],
    images: ["dot-cloud/image-1.webp", "dot-cloud/image-2.webp"],
  },
  {
    id: "tactile-graphics-editor",
    title: "시각장애인을 위한 웹 기반 촉각 그래픽 편집 도구",
    description: "이미지를 손끝으로 읽는 촉각 그림으로 바꿔 만드는 편집기",
    company: "㈜닷",
    period: "2022.12. ~ 2024.12.",
    techStack: [
      "JavaScript",
      "Vue 3",
      "Fabric.js",
      "OpenCV",
      "Spring Boot",
      "MariaDB",
    ],
    images: [
      "dot-canvas/image-1.webp",
      "dot-canvas/image-2.webp",
      "dot-canvas/image-3.webp",
      "dot-canvas/image-4.webp",
    ],
    homeOrder: 5,
    caseStudy: {
      team: "프런트엔드 1 · 백엔드 1 · SDK 1 · 점역엔진 1",
      summary:
        "CES 2024 접근성 부문 혁신상을 수상한 촉각 그래픽 편집 도구의 캔버스 에디터 개발과 하드웨어 SDK 연동",
      background:
        "시각장애인을 포함한 모든 사용자가 촉각 그래픽을 제작·편집·저장·공유할 수 있도록 설계된 웹 애플리케이션입니다.",
      problems: [
        {
          title: "Fabric.js로 펜·지우개·도형 그리기를 제공하는 캔버스 그래픽 에디터 구현",
          problem: "",
          solution:
            "Fabric.js 기반으로 펜·지우개·도형 그리기 등을 제공하는 캔버스 그래픽 에디터를 구현했습니다. 캔버스 성능과 접근성도 개선했습니다.",
          result: "",
        },
        {
          title: "하드웨어 장치 SDK를 캔버스 웹 에디터에 연동해 편집한 촉각 그래픽을 장치로 출력",
          problem: "",
          solution:
            "SDK 개발자가 만든 하드웨어 장치 SDK를 캔버스 웹 에디터에 연동해 편집한 촉각 그래픽을 장치로 출력할 수 있게 했습니다.",
          result: "",
        },
        {
          title: "PDF·이미지를 촉각 그래픽으로 변환하는 기능 개발",
          problem: "",
          solution: "PDF·이미지를 촉각 그래픽으로 변환하는 기능을 개발했습니다.",
          result: "",
        },
      ],
    },
  },
  {
    id: "buan-water-management",
    title: "부안군 상수도시설 생애주기관리 시스템",
    description: "상수도 시설을 지도에서 관리하고 엑셀 보고서를 만드는 시스템",
    company: "이노데일㈜",
    period: "2022.03. ~ 2022.07.",
    techStack: [
      "AngularJS",
      "JavaScript",
      "Highcharts",
      "OpenLayers",
      "Spring Framework",
      "Tibero",
    ],
    images: [],
  },
  {
    id: "incheon-water-management",
    title: "인천광역시 상수도 운영관리 시스템 고도화",
    description:
      "상수도 시설을 지도에서 관리하고 배관 연결도를 편집하는 시스템",
    company: "이노데일㈜",
    period: "2021.03. ~ 2022.02.",
    techStack: [
      "JSP",
      "JavaScript",
      "Highcharts",
      "OpenLayers",
      "Spring Framework",
      "PostgreSQL",
    ],
    images: [],
  },
  {
    id: "web-based-mes",
    title: "제조 실행 시스템(MES)",
    description: "생산 현장의 설비 가동률·불량률·다운타임을 보는 관리 화면",
    company: "이노데일㈜",
    period: "2020.03. ~ 2021.02.",
    techStack: [
      "JSP",
      "JavaScript",
      "Highcharts",
      "ParamQuery Grid",
      "Spring Framework",
      "MariaDB",
    ],
    images: [],
  },
  {
    id: "elevator-complaint-system",
    title: "공공민원 모바일화 시스템 – 승강기민원24 고도화",
    description: "시민이 휴대폰으로 승강기 민원을 신청하는 모바일 웹 화면",
    company: "이노데일㈜",
    period: "2019.12. ~ 2020.02.",
    techStack: ["JSP", "JavaScript", "jQuery", "NICE API"],
    images: [],
  },
  {
    id: "uljin-sewage-management",
    title: "울진군 하수관로 운영관리 시스템",
    description: "하수 시설 데이터를 차트로 모니터링하는 화면",
    company: "이노데일㈜",
    period: "2019.02. ~ 2019.11.",
    techStack: ["AngularJS", "JavaScript", "Highcharts", "jqGrid"],
    images: [],
  },
];
