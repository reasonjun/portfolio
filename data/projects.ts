import type { Project } from "@/app/types/project";

export const PROJECTS_DATA: Project[] = [
  {
    id: "enterprise-legal-management",
    title: "법무관리 시스템 재구축",
    description:
      "2008년 구축된 레거시 법무관리 시스템을 대체하는 신규 사내 시스템",
    detailDescription:
      "토큰이 브라우저에 노출되지 않도록 서버(BFF)가 중계하는 로그인 구조를 설계했습니다. JWT 토큰을 암호화 쿠키로 봉인하고, 동시 요청이 몰려도 refresh를 한 번으로 합쳐 토큰 회전 정책의 무효화 위험을 줄였습니다. GitLab CI/CD·Docker로 개발·스테이징·운영 3개 환경을 구성하고, Nginx blue/green으로 헬스체크를 통과한 뒤에만 트래픽을 전환합니다. 명세 기반 개발과 Git 훅 자동 검증을 적용했습니다.",
    company: "㈜키다리스튜디오",
    period: "2026.07. - 진행 중",
    techStack: [
      "TypeScript",
      "Next.js 16",
      "React 19",
      "Ant Design 6",
      "TanStack Query",
      "Zod",
      "Feature-Sliced Design",
      "Docker",
      "Nginx",
      "GitLab CI/CD",
      "AWS EC2·ALB·ECR",
    ],
    images: [],
    roleShort: "프런트엔드 단독 · 4인 팀",
    homeOrder: 1,
    caseStudy: {
      summary:
        "BFF 중계 로그인 구조를 구현하고 Nginx blue/green 배포를 구축하고 있는 사내 법무관리 시스템 재구축",
      background:
        "2008년 구축된 레거시 법무관리 시스템의 유지보수 문제와 사용자 업무 불편을 해소하려는 신규 사내 시스템입니다.",
      role: "프런트엔드 단독 개발(프런트엔드 1, 백엔드 2, 팀장 1의 4인 팀). 프런트엔드 설계와 기술 결정을 전담하고 컨테이너 배포 파이프라인을 설계·구현했습니다.",
      problems: [
        {
          title: "토큰을 브라우저에 노출하지 않는 인증",
          problem:
            "스크립트로 토큰을 읽을 수 있는 구조를 막고 싶었습니다. 기존 사내 시스템들은 토큰을 메모리에 저장해서, 다중 탭에서는 탭마다 토큰이 따로 있었습니다. 그 때문에 refresh가 동시에 나가면 한쪽이 무효화되었고, 탭을 열 때마다 다시 로그인해야 했습니다. 별도 요구사항이 아니라 직접 정한 설계 방향이었습니다.",
          considered: [],
          decision:
            "서버(BFF)가 JWT 액세스·리프레시 토큰을 암호화 쿠키로 봉인해 중계하는 로그인 구조를 설계·구현했습니다. 토큰 만료 임박 시 자동으로 갱신하고, BFF 핸들러에 동시에 들어온 중복 refresh 요청은 한 번으로 합쳤습니다.",
          result:
            "토큰 회전 정책에서 발생할 수 있는 토큰 무효화 위험을 완화했습니다.",
          visual: {
            type: "diagram",
            id: "bff-auth-flow",
            caption: "BFF가 토큰을 암호화 쿠키로 봉인해 중계하는 인증 흐름",
          },
        },
        {
          title: "헬스체크를 통과한 버전만 반영하는 무중단 배포",
          problem:
            "기존 사내 시스템은 정적 SPA를 S3·CloudFront로 배포했습니다. 이 프로젝트는 BFF를 포함한 Next.js 서버를 운영해야 해서, 서버를 중단 없이 배포할 방법이 필요했습니다.",
          considered: ["ECS: 비용 문제로 제외"],
          decision:
            "GitLab CI/CD·Docker로 개발·스테이징·운영 3개 환경의 빌드·배포 파이프라인을 구성했습니다. ECS와 비교한 뒤 비용 문제로 AWS EC2·ALB·ECR 위에 Nginx 기반 blue/green 배포를 구성하는 쪽을 택했습니다.",
          result:
            "새 버전이 헬스체크를 통과한 뒤에만 트래픽을 전환하며, 실패하면 전환하지 않고 기존 버전을 유지합니다. blue/green은 현재 개발 환경에 적용했고, 스테이징·운영 환경은 구축 중입니다.",
          visual: {
            type: "diagram",
            id: "blue-green-deploy",
            caption:
              "헬스체크를 통과한 쪽으로만 트래픽을 전환하는 blue/green 배포",
          },
        },
        {
          title: "커밋 단계 자동 검증과 명세 기반 개발",
          problem:
            "프런트엔드 개발자가 1명이라 코드 리뷰어가 없었습니다. 또 이후 인원이 충원되더라도 일관성을 유지할 수 있도록 구조를 엄격하게 잡고 싶었습니다.",
          considered: [],
          decision:
            "커밋 단계에서 Biome 린트·타입 검사·FSD(Feature-Sliced Design) 아키텍처 규칙·간격/반경 스케일 위반을 Git 훅으로 자동 검증하도록 했습니다. 기능 명세를 먼저 작성한 뒤 구현하는 명세 기반 개발(SDD)은 GitHub Spec Kit으로 진행하며 기능 단위로 개발했습니다.",
          result:
            "리뷰어가 없는 1인 프런트엔드 환경에서도 커밋 단계마다 린트·타입·아키텍처 규칙·스케일 위반이 자동으로 검증됩니다.",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "external-settlement-system",
    title: "외부정산 시스템",
    description: "저작권자가 정산 내역을 확인하는 외부 제공 웹 페이지",
    detailDescription:
      "양식이 다른 3개 정산 유형의 조회 탭·엑셀 업로드 양식·안내 메일 항목을 유형별 설정으로 분리하고, 신규 유형의 설정 누락을 컴파일 단계에서 검출하도록 설계했습니다. 배포 후에도 옛 화면이 보인다는 문의에 대응해 S3·CloudFront 캐시 정책을 분리했습니다(해시 파일은 장기 캐시, index.html은 매번 재검증).",
    company: "㈜키다리스튜디오",
    period: "2026.03. - 2026.04.",
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
    roleShort: "프런트엔드 개발",
    homeOrder: 2,
    caseStudy: {
      summary:
        "양식이 다른 3개 정산 유형을 설정 추가 중심으로 늘릴 수 있게 설계한 저작권자용 정산 조회 웹 페이지",
      background: "저작권자가 정산 내역을 확인하는 외부 제공 웹 페이지입니다.",
      role: "프런트엔드 개발",
      problems: [
        {
          title: "설정 추가만으로 늘릴 수 있는 정산 유형 구조",
          problem: "",
          considered: [],
          decision:
            "양식이 서로 다른 3개 유형의 조회 탭·엑셀 업로드 양식·안내 메일 항목을 도메인별 설정으로 분리했습니다. TypeScript satisfies로 신규 도메인을 추가할 때 전략 누락을 컴파일 단계에서 검출하도록 설계했습니다.",
          result:
            "이후 유형은 설정 추가 중심으로 늘릴 수 있는 구조가 되었습니다.",
        },
        {
          title: "배포 후에도 옛 화면이 보이는 문제",
          problem:
            "배포 후에도 옛 화면이 보인다는 사용자·운영자 문의가 있었습니다.",
          considered: [],
          decision:
            "S3·CloudFront의 정적 파일 캐시 정책을 분리했습니다. 해시가 붙은 파일은 장기 캐시하고, index.html은 매번 재검증합니다.",
          result: "",
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "ip-management-system",
    title: "IP 관리 시스템",
    description: "콘텐츠 IP를 관리하는 사내 업무 시스템",
    detailDescription:
      "약 1만 줄 단일 파일이던 핵심 업무 화면을 단계·영역별 컴포넌트로 재설계하고, 5개 화면에 중복된 입력 영역을 공통 컴포넌트로 통합했습니다. 계약등록 화면의 정산 조합 326가지를 Playwright로 전수 순회하는 E2E를 구성하고, 기존 동작을 테스트로 고정한 뒤 레거시 기능을 제거했습니다. Vite 8 업그레이드로 로컬 빌드를 11.6초에서 2.77초로 줄였습니다.",
    company: "㈜키다리스튜디오",
    period: "2025.10. - 진행 중",
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
      { value: "326", label: "E2E로 전수 검증한 정산 조합" },
      { value: "11.6s → 2.77s", label: "로컬 빌드" },
    ],
    roleShort: "프런트엔드 · 품질 체계 정비",
    homeOrder: 3,
    caseStudy: {
      summary:
        "약 10,000줄 단일 파일의 핵심 업무 화면을 재설계하고 정산 조합 326가지를 E2E로 전수 검증한 IP 관리 시스템",
      background:
        "콘텐츠 IP를 관리하는 사내 업무 시스템입니다. 계약등록 화면은 기능 추가·수정이 어렵고 수정할 때마다 다른 화면에 회귀가 발생하던 약 10,000줄 단일 파일이었습니다.",
      role: "프런트엔드 개발, 개발 환경·품질 체계 정비, 공통 컴포넌트·유틸 개발",
      problems: [
        {
          title: "회귀를 막으면서 레거시 걷어내기",
          problem: "",
          considered: [],
          decision:
            "Playwright E2E로 계약등록 화면의 정산 조합 326가지를 전수 순회하는 검증을 구성하고, 기존 동작을 테스트로 고정한 뒤 레거시 기능을 제거했습니다.",
          result:
            "정산 조합 326가지를 전수 순회 검증해 화면 수정 시 발생하던 회귀를 방지합니다.",
        },
        {
          title: "단일 거대 파일과 화면 간 중복 구현",
          problem:
            "약 10,000줄 단일 파일의 계약등록 화면은 수정할 때마다 다른 화면에 회귀가 발생했습니다. 5개 화면에 중복 구현된 콘텐츠 정보 입력 영역은 필수값·검증 규칙이 서로 달라 오류가 발생했습니다.",
          considered: [],
          decision:
            "계약등록 화면을 단계·영역별 컴포넌트로 재설계하고, 중복된 입력 영역을 공통 컴포넌트로 통합했습니다. 그룹콘텐츠 중복 검사는 공통 composable로 분리했습니다.",
          result: "",
        },
        {
          title: "개발 환경과 빌드 시간 개선",
          problem: "",
          considered: [],
          decision:
            "ESLint 9·Prettier·husky·commitlint로 코드 스타일과 커밋 메시지를 커밋 단계에서 자동 검사하는 체계를 직접 정해 적용했습니다. Vite 8로 업그레이드하고 JavaScript에서 TypeScript(vue-tsc)로 점진 전환했습니다.",
          result:
            "Vite 8 업그레이드 전후 비교로 로컬 빌드 시간을 11.6초에서 2.77초로 줄였습니다.",
          visual: {
            type: "metrics",
            items: [
              { label: "로컬 빌드 시간", before: "11.6초", after: "2.77초" },
            ],
          },
        },
      ],
      retrospective: "",
    },
  },
  {
    id: "ats-monitoring-system",
    title: "채용관리솔루션 관리자 모니터링 시스템",
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
    title: "웹 기반 촉각 그래픽 편집 도구",
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
    title: "웹 기반 생산관리 시스템(MES)",
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
