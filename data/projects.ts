import type { Project } from "@/app/types/project";

export const PROJECTS_DATA: Project[] = [
  {
    id: "enterprise-legal-management",
    title: "법무관리 시스템 재구축",
    description:
      "계약 검토요청·표준계약서·계약서 DB를 제공하는 사내 법무 시스템",
    detailDescription:
      "토큰이 브라우저에 노출되지 않도록 서버(BFF)가 중계하는 로그인 구조를 설계했습니다. JWT 토큰을 암호화 쿠키로 봉인하고, 같은 서버 모듈 안의 동시 refresh를 하나로 합쳤습니다. GitLab CI/CD·Docker 배포 파이프라인을 구성하고, Nginx blue/green으로 헬스체크를 통과한 뒤에만 트래픽을 전환합니다. 명세 기반 개발과 Git 훅 자동 검증을 적용했습니다.",
    company: "㈜키다리스튜디오",
    period: "2026.08. - 2026.10.",
    techStack: [
      "TypeScript",
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
    roleShort: "프런트엔드 1 · 백엔드 2",
    homeOrder: 1,
    caseStudy: {
      summary:
        "브라우저 스크립트에서 토큰을 분리한 BFF 인증과, 헬스체크를 통과한 버전만 전환하는 blue/green 배포를 설계·구현",
      background:
        "2008년경 구축된 JSP 레거시 법무 시스템을 대체하는 신규 시스템입니다. 계약 정보 오입력을 줄이고, 이후 AI 기반 계약서 정보 추출과 콘텐츠 IP·계약 관리 시스템 연동으로 업무를 자동화하기 위한 기반입니다.",
      role: "프런트엔드를 전담해 기술 스택 선정과 FSD 기반 아키텍처 설계, 인증·화면 구현을 맡았고, 컨테이너 배포 파이프라인을 설계·구현했습니다.",
      problems: [
        {
          title: "BFF 암호화 쿠키로 브라우저 스크립트의 토큰 접근 차단",
          problem:
            "신규 구축이라 토큰을 어디에 둘지부터 정해야 했습니다. 브라우저 저장소에 두면 XSS로 토큰이 탈취될 수 있었고, 쿠키로 옮기면 브라우저가 자동으로 전송하는 만큼 CSRF에 대비해야 했습니다. BFF 핸들러가 병렬로 호출되면 같은 토큰으로 refresh가 동시에 나가 토큰 회전 정책 때문에 일부 요청이 실패할 수 있었습니다.",
          considered: [
            "NextAuth.js: 로그인과 토큰 회전은 백엔드가 이미 담당해 프런트에는 세션 쿠키 봉인만 필요했고, 공식 문서도 비밀번호 방식보다 OAuth 등을 권장하며 refresh 토큰 회전은 내장하지 않아 콜백으로 직접 구현해야 하므로 제외",
          ],
          decision:
            "서버(BFF)가 JWT 액세스·리프레시 토큰을 iron-session의 HttpOnly 암호화 쿠키로 봉인해 중계하고, 브라우저는 백엔드를 직접 호출하지 않게 했습니다. 토큰 갱신은 쿠키를 쓸 수 있는 proxy(페이지 이동)와 BFF 핸들러(클라이언트 리페치) 두 지점으로 한정하고, 만료 5분 전부터 자동으로 갱신합니다. 같은 서버 모듈 안에서는 진행 중인 refresh Promise를 토큰별로 공유해 동시 요청을 하나로 합쳤고, 모듈이나 서버를 넘는 경합은 백엔드의 재사용 유예가 처리합니다. 세션 쿠키는 SameSite=Lax로 설정하고, GET으로 동작하는 세션 파기 경로는 Sec-Fetch-Site를 허용 목록 방식으로 검사해 이 경로의 로그아웃 CSRF를 막았습니다.",
          result:
            "토큰 값을 브라우저 스크립트에서 읽을 수 없게 했고, 같은 서버 모듈 안의 중복 refresh를 줄였습니다.",
          visual: {
            type: "diagram",
            id: "bff-auth-flow",
            caption: "BFF가 토큰을 암호화 쿠키로 봉인해 중계하는 인증 흐름",
          },
        },
        {
          title: "Next.js 서버를 헬스체크 기반 Nginx blue/green으로 배포",
          problem:
            "신규 구축이라 배포 구조부터 정해야 했고, 오픈 후에는 배포 때문에 법무 업무가 끊기지 않아야 했습니다. 컨테이너를 내린 뒤 새로 띄우는 단순한 방식은 교체하는 동안 요청을 받을 수 없고 새 버전이 뜨지 않으면 서비스가 멈추므로, 교체 중에도 요청을 처리하고 문제가 있으면 기존 버전을 유지하는 구조가 필요했습니다.",
          considered: [],
          decision:
            "처음에는 헬스체크 통과 후 교체하는 ECS 배포를 설계했지만, 실제로 제공된 인프라는 EC2·ALB 구성이었습니다. 그래서 ECS에서 얻으려던 확인 후 교체를 ECR 이미지와 Nginx blue/green으로 구현했습니다. 트래픽을 받지 않는 슬롯에 새 컨테이너를 띄우고, 헬스체크를 통과한 뒤에만 Nginx upstream을 전환합니다. 전환 전에 nginx -t로 설정을 검사하고, 검사나 reload 명령이 실패하면 설정을 원복한 뒤 새 컨테이너를 중지합니다. 헬스체크는 세션을 거치지 않아 필수 비밀값이 빠져도 통과하므로, 기동 전에 비밀값 파일을 검사하도록 했습니다.",
          result:
            "새 버전은 헬스체크를 통과한 뒤에만 트래픽을 받고, 전환 전 검증에 실패하면 기존 버전이 서비스를 유지합니다. 문법 오류가 있는 Nginx 설정과 필수 비밀값 누락도 트래픽 전환 전에 걸러집니다. blue/green은 개발 환경까지 적용했습니다.",
          visual: {
            type: "diagram",
            id: "blue-green-deploy",
            caption:
              "헬스체크와 설정 검사를 통과해야 트래픽을 전환하고, 실패하면 기존 버전을 유지하는 배포 흐름",
          },
        },
        {
          title:
            "번들·Suspense 경계를 추적해 첨부 모달 지연 로드가 실제로 동작하도록 개선",
          problem:
            "열지 않으면 필요 없는 모달 코드를 초기 로드에서 분리했습니다. 긴급한 건을 외부에서 모바일로 처리하는 경우도 함께 고려했습니다. 그런데 첨부 모달은 지연 로드를 적용했는데도, 프로덕션 빌드의 4개 라우트 초기 HTML에 구현 청크가 그대로 포함되어 있었습니다. 클릭 시 스피너를 없애려 hover 시점에 미리 마운트하자, 이번에는 필터에 마우스만 올려도 페이지 전체가 스켈레톤으로 바뀌었습니다.",
          considered: [],
          decision:
            "의존성 없는 더미 컴포넌트로 대조 실험을 해, 공용 배럴을 다른 export로 정적 import하는 파일이 있으면 청크가 합쳐진다는 조건을 확인하고 첨부 모달 전용 index로 분리했습니다. React.lazy의 첫 렌더는 항상 서스펜드되므로 첫 렌더를 hover 시점으로 앞당겼습니다. 깜빡임은 Next.js 소스에서 ssr:false와 loading이 모두 없으면 Suspense 경계가 생기지 않음을 확인해, loading: () => null로 모달 자체 경계를 복원했습니다.",
          result:
            "4개 라우트의 초기 HTML에서 첨부 모달 구현 청크가 빠진 것을 빌드 산출물로 확인했습니다. Playwright와 MutationObserver 재현 시나리오에서 페이지 콘텐츠가 숨겨지던 현상은 수정 후 0건이었습니다.",
          visual: {
            type: "diagram",
            id: "modal-lazy-load",
            caption:
              "전용 index로 청크를 분리하고 모달 자체 Suspense 경계로 서스펜션 전파를 막은 전후 흐름",
          },
        },
      ],
      retrospective:
        "검증을 통과했다고 문제가 없는 것은 아니었습니다. 헬스체크가 실제로 무엇을 보장하는지 따로 확인해야 했고, 모달 지연 로드는 청크 로드 시점만 측정한 채 loading 옵션을 제거해 회귀를 만들었습니다. 이후 측정 결과가 어디까지를 증명하는지 함께 확인합니다.",
    },
  },
  {
    id: "external-settlement-system",
    title: "외부정산 시스템 개발 및 개선",
    description: "저작권자용 정산 조회 외부 페이지의 기능 확장",
    detailDescription:
      "양식이 다른 3개 정산 유형의 조회 탭·엑셀 업로드 양식·안내 메일 항목을 유형별 설정으로 분리하고, 신규 유형의 설정 누락을 컴파일 단계에서 검출하도록 설계했습니다. 배포 후에도 옛 화면이 보인다는 문의에 대응해 S3·CloudFront 캐시 정책을 분리했습니다(해시 파일은 장기 캐시, index.html은 매번 재검증).",
    company: "㈜키다리스튜디오",
    period: "2026.03. - 2026.10.",
    techStack: [
      "JavaScript",
      "TypeScript",
      "Vue 3",
      "Vite 8",
      "Vue Router",
      "Pinia",
      "RealGrid2",
      "AWS S3·CloudFront",
    ],
    images: [],
    roleShort: "프런트엔드 1 · 백엔드 1",
    homeOrder: 2,
    caseStudy: {
      summary:
        "양식이 다른 3개 정산 유형을 설정 추가 중심으로 늘릴 수 있게 설계한 저작권자용 정산 조회 웹 페이지",
      background:
        "저작권자가 정산 내역을 확인하는 외부 제공 웹 페이지의 기능을 확장했습니다.",
      role: "정산 유형별 조회·업로드·메일 구조 설계와 프런트엔드 개발을 맡았습니다.",
      problems: [
        {
          title: "설정 추가만으로 늘릴 수 있는 정산 유형 구조",
          problem:
            "봄툰KR·소설유통·부가판권은 조회 탭, 그리드 컬럼, 엑셀 업로드 시트, 안내 메일 항목이 서로 달랐습니다. 이 차이를 화면 코드의 분기로 처리하면 유형이 늘 때마다 목록·업로드·메일 화면을 모두 고쳐야 했습니다.",
          considered: [],
          decision:
            "양식이 서로 다른 3개 유형의 조회 탭·엑셀 업로드 양식·안내 메일 항목을 목록·업로드·메일별 설정 객체로 분리했습니다. 화면은 현재 정산 유형의 설정을 조회해 탭과 엑셀 시트 매핑을 동적으로 구성합니다. 각 설정에 satisfies Record<SettlementDomain, …>를 적용해, 신규 유형을 추가할 때 설정이 빠지면 컴파일 단계에서 검출되도록 했습니다.",
          result:
            "이후 유형은 설정 추가 중심으로 늘릴 수 있는 구조가 되었습니다.",
        },
        {
          title: "배포 후에도 옛 화면이 보이는 문제",
          problem:
            "배포 후에도 옛 화면이 보인다는 사용자·운영자 문의가 있었습니다. S3 객체에 Cache-Control 헤더가 없어 브라우저가 옛 index.html을 재검증 없이 사용했고, 정산 업로드 화면의 신규 컬럼이 사용자마다 보였다 안 보였다 했습니다.",
          considered: [],
          decision:
            "GitLab CI의 aws s3 cp 배포를 한 번에 올리던 방식에서 두 단계로 나눴습니다. 파일명에 해시가 붙는 assets/*는 내용이 바뀌면 이름도 바뀌므로 max-age=31536000, immutable로 1년간 캐시합니다. index.html 등 나머지 파일은 no-cache로 올려 매번 재검증하게 했습니다.",
          result:
            "브라우저가 index.html을 매번 재검증해 새 배포를 받고, 해시 파일은 계속 장기 캐시를 사용합니다. 변경 후 옛 화면 관련 문의는 없었습니다.",
        },
      ],
      retrospective:
        "처음에는 클래스 기반 전략 패턴으로 구현했지만, 이후 TypeScript 설정 객체 맵으로 단순화했습니다. 패턴을 먼저 적용하기보다 유형별로 달라지는 것이 동작인지 데이터인지부터 따져야 한다는 점을 배웠습니다.",
    },
  },
  {
    id: "ip-management-system",
    title: "콘텐츠 IP·계약 관리 시스템 개선",
    description: "콘텐츠 IP를 관리하는 사내 업무 시스템",
    detailDescription:
      "5개 화면에 중복된 콘텐츠 입력 폼을 공통 컴포넌트로 통합했습니다. 계약등록 화면의 정산 조합 326가지를 Playwright E2E로 전수 순회해 현재 동작을 고정한 뒤, 도달할 수 없던 일괄등록 코드를 제거했습니다. Vite 8 업그레이드로 운영 빌드를 약 80초에서 약 20초로 약 75% 단축했습니다.",
    company: "㈜키다리스튜디오",
    period: "2025.10. - 2026.10.",
    techStack: [
      "TypeScript",
      "Vue 3",
      "Vite 8",
      "Vue Router",
      "Pinia",
      "RealGrid2",
      "Playwright",
    ],
    images: [],
    highlights: [
      { value: "326", label: "E2E로 동작을 고정한 정산 조합" },
      { value: "75%", label: "운영 빌드 단축 (약 80s → 20s)" },
    ],
    roleShort: "프런트엔드 1 · 백엔드 1",
    homeOrder: 3,
    caseStudy: {
      summary:
        "5개 화면의 입력 폼을 통합하고 정산 조합 326가지의 동작을 E2E로 고정해 레거시 코드를 제거한 콘텐츠 IP·계약 관리 시스템",
      background:
        "콘텐츠 IP를 관리하는 사내 업무 시스템입니다. 계약등록 화면은 기능 추가·수정이 어렵고 수정할 때마다 다른 화면에 회귀가 발생하던 약 10,000줄 단일 파일이었습니다.",
      role: "프런트엔드 개발, 개발 환경·품질 체계 정비, 공통 컴포넌트·유틸 개발을 맡았습니다.",
      problems: [
        {
          title: "회귀를 막으면서 레거시 걷어내기",
          problem:
            "계약등록·변경의 정산 입력은 정산방식·계약분류·콘텐츠형태·지급방식의 조합에 따라 달라져, 코드를 고칠 때 어떤 조합이 깨지는지 사람이 전부 확인하기 어려웠습니다.",
          considered: [],
          decision:
            "Playwright로 실제 화면을 조작하고 API 응답은 녹화한 픽스처로 고정해, 계약등록·변경의 현재 검증·저장 동작을 테스트로 남겼습니다. 정산방식·계약분류·콘텐츠형태·지급방식 4개 축의 조합 중 분석상 도달 가능한 326가지를 원장으로 정리해 전수 순회했고, 도달할 수 없는 조합은 막는 코드 위치를 기록해 제외했습니다. 이 기준선을 통과한 상태에서 계약등록에서 도달할 수 없던 일괄등록 코드를 제거했습니다.",
          result:
            "일괄등록 코드를 제거한 뒤 계약등록 208건·계약변경 232건의 E2E가 통과해 기존 동작이 유지됨을 확인했습니다. 백엔드를 목으로 처리한 화면 검증이고, 테스트 코드는 배포 브랜치에 병합하지 않아 CI에서 상시 실행되지는 않습니다.",
        },
        {
          title: "5개 화면에 복제된 콘텐츠 입력 폼",
          problem:
            "5개 화면에 중복 구현된 콘텐츠 정보 입력 영역은 필수값·검증 규칙이 서로 달라 오류가 발생했습니다.",
          considered: [],
          decision:
            "계약등록, 콘텐츠 등록·변경, 영상 등록·변경 5개 화면에 복제돼 있던 콘텐츠 입력 폼은 공통 컴포넌트 하나로 통합해 필수값과 검증 규칙의 기준을 한곳으로 모았습니다. 그룹콘텐츠 중복 검사는 공통 composable로 분리했습니다.",
          result: "콘텐츠 입력 폼의 기준이 5곳에서 1곳으로 줄었습니다.",
        },
        {
          title: "번들러 전환과 청크 분리로 운영 빌드 약 75% 단축",
          problem:
            "esbuild(개발)와 Rollup(빌드)을 함께 쓰는 구조에서 운영 빌드에 약 80초가 걸렸고, 이 시간이 매 배포와 CI마다 누적되었습니다. 라이브러리와 앱 코드도 2,493KiB 크기의 단일 청크에 묶여 있었습니다.",
          considered: [],
          decision:
            "Vite를 5에서 8까지 올려 번들러를 Rolldown으로 통합했습니다. 번들 분석 도구로 청크 구성을 확인해, 트리셰이킹이 되지 않는 CJS 라이브러리 RealGrid를 포함한 realgrid·vuetify·vendor를 별도 청크로 분리했습니다. lodash는 ESM인 lodash-es와 네이티브 메서드로 교체하고, 미사용 패키지와 시스템 분리 후 남은 미사용 코드를 제거했습니다.",
          result:
            "운영 빌드 시간을 약 80초에서 약 20초로 약 75% 단축했고, JS·CSS 전체 크기는 6,471KiB에서 5,356KiB로 약 17% 줄었습니다.",
          visual: {
            type: "metrics",
            items: [
              {
                label: "운영 빌드 시간",
                before: "약 80초",
                after: "약 20초",
              },
            ],
          },
        },
      ],
      retrospective:
        "E2E를 운영하던 중 Playwright가 같은 포트에 떠 있던 다른 작업 공간의 서버를 검증하고 있었다는 사실을 발견했습니다. 대상 코드로 다시 돌린 뒤로는 테스트 통과 여부뿐 아니라 무엇을 대상으로 통과했는지도 함께 확인합니다.",
    },
  },
  {
    id: "dyson-live-monorepo",
    title:
      "다이슨 사전알림·혜택 프로모션 라이브 방송 페이지의 PHP → Next.js 모노레포 전환",
    description:
      "사전알림·혜택 프로모션을 제공하는 라이브 방송 페이지와 관리자 백오피스",
    detailDescription:
      "방송마다 PHP 페이지를 복사해 쓰던 구조를 앱 6개와 공유 패키지 4개의 Next.js 모노레포로 전환했습니다. 개발자가 DB를 조회해 엑셀로 전달하던 사전알림 번호·기대평을 운영자가 백오피스 화면에서 직접 확인하도록 개선하고, API 라우트에 rate limiting과 공통 입력 검증을 적용했습니다. EC2·Nginx 수동 배포를 Docker·ECR 기반 AWS ECS 롤링 배포로 전환해 무중단 배포를 구성했습니다.",
    company: "프리랜서",
    period: "2025.09.",
    techStack: [
      "TypeScript",
      "React 19",
      "Next.js 16",
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
    description: "중소기업 채용관리솔루션(ATS) 운영 모니터링 웹 시스템",
    detailDescription:
      "Next.js 기반으로 관리자 페이지를 구축하고, NextAuth.js를 통한 사용자 인증 및 권한 관리 기능을 구현했습니다. 모니터링 대시보드, 리포트, 설문조사 관리 기능을 포함하여 프런트엔드 아키텍처 전반을 설계했습니다.",
    company: "프리랜서",
    period: "2025.05. - 2025.08.",
    techStack: ["TypeScript", "Next.js", "NextAuth.js", "Ant Design"],
    images: ["ats/image-1.png"],
    caseStudy: {
      summary:
        "Next.js 초기 환경과 개발 아키텍처를 설계한 중소기업 채용관리솔루션(ATS) 운영 모니터링 웹 시스템",
      background:
        "중소기업 채용관리솔루션(ATS) 서비스 운영 모니터링을 위한 관리자용 웹 시스템입니다.",
      role: "프런트엔드 개발 및 아키텍처 설계, 관리자 페이지 개발, 인증 시스템 연동",
      problems: [
        {
          title: "Next.js 프로젝트 초기 환경과 개발 아키텍처",
          problem: "",
          considered: [],
          decision:
            "폴더·레이어 구조, 상태·데이터 페칭 방식, 공통 컴포넌트를 설계했습니다.",
          result: "",
        },
        {
          title: "사용자 인증과 권한 관리",
          problem: "",
          considered: [],
          decision: "NextAuth.js 기반 사용자 인증을 연동했습니다.",
          result: "",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "accessibility-ebook-viewer",
    title: "웹 기반 접근성 전자책 뷰어",
    description: "시각장애인을 위한 웹 접근성 eBook 뷰어",
    detailDescription:
      "DAISY 및 BRF 파일을 파싱해 HTML로 렌더링하는 전자책 뷰어를 개발했습니다. Web Speech API를 활용한 문단 단위 TTS 기능과 점자 디스플레이 연동 기능을 구현했습니다.",
    company: "㈜닷",
    period: "2024.11. - 2024.12.",
    techStack: ["JavaScript", "Vue.js"],
    images: ["ebook-reader-web/image-1.png", "ebook-reader-web/image-2.png"],
  },
  {
    id: "design-system",
    title: "디자인 시스템 구축",
    description: "아토믹 디자인 기반 컴포넌트 라이브러리",
    detailDescription:
      "Figma와 Storybook을 활용하여 컴포넌트 문서화 및 시각적 회귀 테스트(Chromatic)를 구현했습니다. 아토믹 디자인 패턴을 적용해 재사용성과 일관성을 확보했습니다.",
    company: "㈜닷",
    period: "2024.08. - 2024.10.",
    techStack: ["TypeScript", "Vue.js", "Storybook", "Figma"],
    images: [
      "design-system/image-1.png",
      "design-system/image-2.png",
      "design-system/image-3.png",
      "design-system/image-4.png",
    ],
    roleShort: "컴포넌트 구조 · 디자인 토큰",
    homeOrder: 4,
    caseStudy: {
      summary:
        "아토믹 디자인 기반 컴포넌트 라이브러리와 디자인 토큰, Storybook·Chromatic 시각 회귀 테스트를 구축한 디자인 시스템",
      background:
        "아토믹 디자인 패턴 기반의 재사용 가능한 컴포넌트 라이브러리 및 디자인 토큰 시스템을 구축했습니다.",
      role: "컴포넌트 계층 구조 설계 및 구현, 디자인 토큰 시스템 구축",
      problems: [
        {
          title: "역할이 명확한 컴포넌트 구조",
          problem: "",
          considered: [],
          decision:
            "아토믹 디자인 패턴 기반으로 컴포넌트 구조를 설계하고, 단일 책임 원칙에 따라 역할이 명확한 컴포넌트로 구성했습니다.",
          result: "재사용성과 일관성을 확보했습니다.",
        },
        {
          title: "디자이너와 맞춘 디자인 토큰",
          problem: "",
          considered: [],
          decision:
            "디자인 토큰(색상, 간격, 타이포그래피 등)을 정의하고 공통 스타일을 적용했습니다. 디자이너와 토큰·컴포넌트 기준을 조율했습니다.",
          result: "",
        },
        {
          title: "문서화와 시각적 회귀 테스트",
          problem: "",
          considered: [],
          decision:
            "Storybook으로 컴포넌트를 문서화하고 다른 개발자에게 사용법을 안내했습니다. Chromatic을 활용한 시각적 회귀 테스트 자동화를 구현했습니다.",
          result: "",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "customer-support-site",
    title: "고객지원 사이트 구축",
    description: "VOC 및 백오피스 시스템 개발",
    detailDescription:
      "JIRA API 연동으로 VOC 제출 시 자동 티켓 생성 기능을 구현하고, i18n 다국어 환경을 지원했습니다. 공통 레이아웃과 UI 컴포넌트를 적용해 일관된 사용자 경험을 제공했습니다.",
    company: "㈜닷",
    period: "2024.07.",
    techStack: ["TypeScript", "Vue.js", "i18n", "Java", "Spring Boot"],
    images: [
      "support/image-1.png",
      "support/image-2.png",
      "support/image-3.png",
    ],
  },
  {
    id: "frontend-framework-refactoring",
    title: "프런트엔드 공통 프레임워크 아키텍처 리팩터링",
    description: "레거시 Vue.js 프로젝트 유지보수성 향상",
    detailDescription:
      "Vuex에서 Pinia로 전환, Composition API 도입, 빌드 최적화를 통해 번들 사이즈 30% 감소 및 타입 안정성을 강화했습니다.",
    company: "㈜닷",
    period: "2024.05.",
    techStack: ["TypeScript", "Vue.js", "Vuex", "Pinia", "gulp.js"],
    images: [],
  },
  {
    id: "wysiwyg-editor",
    title: "웹 기반 WYSIWYG 에디터",
    description: "접근성 검사 기능을 포함한 웹 에디터",
    detailDescription:
      "CKEditor5 기반으로 접근성 검사 기능(alt 텍스트, 색상 대비 등)을 추가하고, 대용량 문서 가상 스크롤을 구현해 로딩 속도를 20초에서 1초로 단축했습니다.",
    company: "㈜닷",
    period: "2023.09. - 2024.04.",
    techStack: ["JavaScript", "Vue.js", "CKEditor 5"],
    images: ["dot-editor/image-1.png", "dot-editor/image-2.png"],
    coverPosition: "left top",
    highlights: [{ value: "20s → 1s", label: "대용량 문서 로딩" }],
    roleShort: "접근성 검사 · 성능 최적화",
    homeOrder: 5,
    caseStudy: {
      summary:
        "접근성 검사와 가상 스크롤을 더해 대용량 문서 로딩을 20초에서 1초로 줄인 점자 디스플레이용 WYSIWYG 에디터",
      background:
        "시각장애인을 위한 점자 디스플레이(Dot Pad) 출력에 최적화된 웹 기반 WYSIWYG 에디터입니다.",
      role: "웹 접근성 검사 기능 구현, 가상 스크롤 등 성능 최적화",
      problems: [
        {
          title: "대용량 문서 로딩 속도",
          problem: "",
          considered: [],
          decision: "가상 스크롤을 구현했습니다.",
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
          title: "웹 접근성 검사",
          problem: "",
          considered: [],
          decision:
            "CKEditor 5 기반으로 웹 접근성 검사(alt 텍스트, 색상 대비 등) 기능을 구현했습니다.",
          result: "",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "mobile-ebook-viewer",
    title: "모바일 기반 접근성 전자책 뷰어",
    description: "DAISY 포맷 기반 eBook 리더 앱",
    detailDescription:
      "Flutter로 DAISY 전자책 뷰어를 개발했습니다. Daisy Parser 모듈과 확장 가능한 파서 아키텍처를 설계했습니다.",
    company: "㈜닷",
    period: "2023.03. - 2023.08.",
    techStack: ["Flutter", "Dart", "Swift"],
    images: [],
  },
  {
    id: "cloud-file-management",
    title: "클라우드 기반 파일 관리 시스템",
    description: "AWS S3와 Spring Boot 기반 파일 관리 서비스",
    detailDescription:
      "비동기 업로드/다운로드와 권한 기반 파일 접근 제어를 구현했습니다. 커맨드 패턴으로 파일 조작 인터페이스를 설계했습니다.",
    company: "㈜닷",
    period: "2023.01. - 2023.02.",
    techStack: [
      "JavaScript",
      "Vue.js",
      "Spring Boot",
      "Mybatis",
      "MariaDB",
      "AWS S3",
    ],
    images: ["dot-cloud/image-1.png", "dot-cloud/image-2.png"],
  },
  {
    id: "tactile-graphics-editor",
    title: "시각장애인을 위한 웹 기반 촉각 그래픽 편집 도구",
    description: "시각장애인용 촉각 그래픽 제작 툴",
    detailDescription:
      "Fabric.js 기반 그래픽 편집기와 하드웨어 연동 SDK를 구축했습니다. 이미지 → 촉각 그래픽 변환 기능을 개발했으며, CES 2024 접근성 부문 혁신상을 수상했습니다.",
    company: "㈜닷",
    period: "2022.12. - 2024.12.",
    techStack: [
      "JavaScript",
      "Vue.js",
      "Fabric.js",
      "OpenCV",
      "Spring Boot",
      "MariaDB",
    ],
    images: [
      "dot-canvas/image-1.png",
      "dot-canvas/image-2.png",
      "dot-canvas/image-3.png",
      "dot-canvas/image-4.webp",
    ],
    roleShort: "에디터 · 하드웨어 SDK",
    homeOrder: 6,
    caseStudy: {
      summary:
        "CES 2024 접근성 부문 혁신상을 수상한 촉각 그래픽 편집 도구의 캔버스 에디터와 하드웨어 연동 SDK",
      background:
        "시각장애인을 포함한 모든 사용자가 촉각 그래픽을 제작, 편집, 저장, 공유할 수 있도록 설계된 웹 애플리케이션입니다.",
      role: "프런트엔드 개발 및 하드웨어 장치 연동 SDK 구축",
      problems: [
        {
          title: "캔버스 기반 그래픽 에디터",
          problem: "",
          considered: [],
          decision:
            "Fabric.js 기반으로 펜, 지우개, 도형 그리기 등을 제공하는 캔버스 그래픽 에디터를 구현했습니다. 캔버스 성능 최적화와 접근성 개선을 진행했습니다.",
          result: "",
        },
        {
          title: "하드웨어 장치 연동 SDK",
          problem: "",
          considered: [],
          decision: "하드웨어 장치와 연동하는 SDK를 구축했습니다.",
          result: "",
        },
        {
          title: "이미지를 촉각 그래픽으로 변환",
          problem: "",
          considered: [],
          decision: "이미지를 촉각 그래픽으로 변환하는 기능을 개발했습니다.",
          result: "",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "buan-water-management",
    title: "부안군 상수도시설 생애주기관리 시스템",
    description: "시설물 자산관리 및 운영 효율화 시스템",
    detailDescription:
      "GIS 기반 관리 기능을 구현하고, Highcharts를 통한 데이터 시각화 및 Excel 보고서 자동화를 구축했습니다.",
    company: "이노데일㈜",
    period: "2022.03. - 2022.07.",
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
    description: "GIS 기반 상수도 관리 시스템",
    detailDescription:
      "OpenLayers, GeoServer를 활용한 GIS 기반 시설물 관리와 Draw2D로 인터랙티브 편집 가능한 계통도를 개발했습니다.",
    company: "이노데일㈜",
    period: "2021.03. - 2022.02.",
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
    description: "제조업 생산 공정 관리 시스템",
    detailDescription:
      "ParamQuery Grid와 Highcharts를 활용해 대용량 실시간 데이터 시각화를 구현했습니다. 설비 가동률, 불량률, 다운타임 분석 로직을 설계했습니다.",
    company: "이노데일㈜",
    period: "2020.03. - 2021.02.",
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
    description: "승강기 민원 처리 모바일 웹뷰 플랫폼",
    detailDescription:
      "모바일 최적화 화면과 NICE API 기반 본인 인증 기능을 구현했습니다.",
    company: "이노데일㈜",
    period: "2019.12. - 2020.02.",
    techStack: ["JSP", "JavaScript", "jQuery", "NICE API"],
    images: [],
  },
  {
    id: "uljin-sewage-management",
    title: "울진군 하수관로 운영관리 시스템",
    description: "하수관로 모니터링 및 관리 시스템",
    detailDescription:
      "AngularJS 기반 SPA와 Highcharts/jqGrid를 활용해 실시간 데이터 시각화를 구현했습니다.",
    company: "이노데일㈜",
    period: "2019.02. - 2019.11.",
    techStack: ["AngularJS", "JavaScript", "Highcharts", "jqGrid"],
    images: [],
  },
];
