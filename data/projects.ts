import type { Project } from "@/app/types/project";

export const PROJECTS_PER_PAGE = 6;

export const PROJECTS_DATA: Project[] = [
  {
    id: "ats-monitoring-system",
    title: "채용 관리 솔루션 관리자 모니터링 시스템",
    description: "중소기업 채용관리솔루션(ATS) 운영 모니터링 웹 시스템",
    detailDescription:
      "Next.js 기반으로 관리자 페이지를 구축하고, NextAuth.js를 통한 사용자 인증 및 권한 관리 기능을 구현했습니다. 모니터링 대시보드, 리포트, 설문조사 관리 기능을 포함하여 프론트엔드 아키텍처 전반을 설계했습니다.",
    company: "프리랜서",
    period: "2025.05. - 2025.08.",
    techStack: ["TypeScript", "Next.js", "NextAuth.js", "Ant Design"],
    images: [],
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
    images: [],
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
    images: [],
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
    images: [],
  },
  {
    id: "frontend-framework-refactoring",
    title: "프론트엔드 공통 프레임워크 아키텍처 리팩터링",
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
    images: [],
  },
  {
    id: "mobile-ebook-viewer",
    title: "모바일 기반 접근성 전자책 뷰어",
    description: "DAISY 포맷 기반 eBook 리더 앱",
    detailDescription:
      "Flutter로 설계 후 접근성 제약으로 iOS(Swift)로 재개발했습니다. Daisy Parser 모듈과 확장 가능한 파서 아키텍처를 설계했습니다.",
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
    images: [],
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
    images: [],
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
