import type { DiagramId } from "@/app/types/project";

// 크기는 적지 않는다. 빌드 시 SVG 파일에서 읽는다(getPublicImageSize). 다시 내보내도 어긋나지 않게 하기 위함이다.
export interface DiagramAsset {
  src: string;
  alt: string;
}

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 사이트에 다크 모드가 없어
// `--theme light`로 내보내 색을 라이트로 고정했고, 그래서 흰 배경에 둔다.
// CLI는 라벨마다 foreignObject 미지원 뷰어용 PNG 폴백(<switch> 안의 base64 <image>)을 넣어 파일이 수백 KB가 된다.
// 브라우저는 foreignObject를 그리므로 내보낸 뒤 그 <image>를 지운다.
export const DIAGRAMS: Record<DiagramId, DiagramAsset> = {
  "bff-auth-flow": {
    src: "/diagrams/bff-auth-flow.drawio.svg",
    alt: "브라우저는 암호화 세션 쿠키만 갖고 BFF가 토큰으로 백엔드를 호출하며, 만료 임박 시 동시 요청의 refresh를 같은 모듈 안에서 합치는 인증 시퀀스 다이어그램",
  },
  "blue-green-deploy": {
    src: "/diagrams/blue-green-deploy.drawio.svg",
    alt: "브라우저 요청을 EC2 안의 Nginx map이 배포 ID로 나눠, 새로 연 탭은 활성 슬롯, 배포 전에 열어 둔 탭은 30분 유지되는 이전 슬롯으로 보내고, 만료된 배포 ID에는 410을 반환해 브라우저가 폼 수정 여부에 따라 새로고침하거나 모달로 안내한 뒤 입력을 복원하는 구조도. 아래에는 이미지 pull, 헬스체크, nginx 설정 검사를 통과해야 전환하고 실패하면 기존 버전을 유지하며, 전환 후 30분이 지나거나 재배포하면 만료 처리 후 SIGTERM으로 종료하는 배포 순서",
  },
  "msw-mock-switch": {
    src: "/diagrams/msw-mock-switch.drawio.svg",
    alt: "개발 환경에서 Next.js 서버의 fetch를 MSW setupServer가 가로채 핸들러가 있으면 mock 리졸버가, 없으면 실 백엔드 API가 응답하는 흐름과, 같은 핸들러의 mock 응답과 실API 응답을 화면의 zod 스키마로 검증하는 계약 테스트, 운영·스테이징 빌드에서 NEXT_PUBLIC_USE_MOCK=false로 mock 코드를 제거하는 구조도",
  },
  "settlement-domain-config": {
    src: "/diagrams/settlement-domain-config.drawio.svg",
    alt: "기존 봄툰KR과 추가된 소설유통·부가판권 세 정산 유형이 현재 유형 키로 목록·업로드·메일 설정을 조회하는 구조도. 목록 화면은 설정대로 탭을 구성하고 탭 표시 방식(viewType)에 따라 표 또는 내역서로 보여 주며, 업로드 화면은 시트별 데이터 매핑을, 메일 발송 화면은 입력 항목을 설정대로 구성한다. 화면 코드에는 유형 이름 분기가 없고, 세 설정 모두 satisfies로 모든 유형 키를 검사해 설정이 빠지면 타입 체크에서 오류가 난다",
  },
  "s3-cache-policy": {
    src: "/diagrams/s3-cache-policy.drawio.svg",
    alt: "변경 전에는 S3의 모든 파일에 Cache-Control이 없어 CloudFront를 무효화해도 브라우저가 이전 버전의 index.html을 재검증 없이 사용했고, 변경 후에는 assets/* 해시 파일을 1년 immutable로 먼저 올리고 index.html 등 나머지를 no-cache로 올린다. 브라우저는 index.html을 요청할 때 저장한 ETag를 If-None-Match로 보내 그대로면 본문 없는 304를, 바뀌었으면 200과 새 ETag를 받는 흐름 비교도",
  },
  "e2e-regression-baseline": {
    src: "/diagrams/e2e-regression-baseline.drawio.svg",
    alt: "왼쪽은 기준선 고정 단계로, 326가지 조합의 현재 동작을 결함도 고치지 않고 E2E 기준선으로 고정한다. 오른쪽은 AI 코딩 에이전트로 구현하고 단계마다 같은 E2E를 다시 통과해야 다음 단계로 넘어가는 순서로, 화면에서 도달할 수 없던 일괄등록 코드 제거, ① 두 화면의 규칙을 순수 함수 모듈 1곳으로 통합(화면별 분기 유지), ② 그리드 설정을 공유 composable로 통일, ③ 조건별 표시 규칙을 선언형으로 전환, ④ 단계·영역별 컴포넌트로 분리한다. 아래에는 정산 규칙 정의가 2곳에서 1곳으로, 계약등록 화면이 10,374줄에서 [실측]줄로 줄었고 네 단계 후에도 같은 E2E를 통과했으며, 백엔드 mock 기반 화면 검증이라 CI에서 상시 실행되지 않는다고 적었다",
  },
  "ai-agent-guardrails": {
    src: "/diagrams/ai-agent-guardrails.drawio.svg",
    alt: "AI 에이전트의 판단을 구현 전에 확인하는 두 단계 흐름도. ① 맥락: 업무 매뉴얼·용어를 정리한 업무 위키와 세션마다 결정·원인 조사를 남긴 작업 위키에서 에이전트가 업무 규칙과 이전 결정을 먼저 확인한다. ② 명세(SDD): Spec Kit 명세를 구현 전에 작성해 에이전트의 해석을 먼저 드러내고 정책 판단 항목은 에이전트가 골라 질문하며, 기능을 없애거나 막는 항목은 업무 위키에서 근거를 찾은 뒤에만 구현해 근거 없는 기능 제거를 구현 전에 폐기했다. 아래에는 로드맵 한 줄로 들어온 기능 변경은 전제가 틀려 구현 후 폐기했고 이후 구현 전에 요청자에게 요구 원문을 받는다는 한계를 적었다",
  },
  "vite-rolldown-chunks": {
    src: "/diagrams/vite-rolldown-chunks.drawio.svg",
    alt: "변경 전 Vite 5는 개발에 esbuild, 빌드에 Rollup을 써서 운영 빌드가 약 145초 걸렸고, 청크를 나누기 직전에는 RealGrid·Vuetify·라이브러리·앱 코드가 2,493KiB 단일 청크에 묶여 있었다. 변경 후 Vite 8은 Rolldown으로 번들러를 통합하고 realgrid·vuetify·vendor·앱 코드 청크로 분리했으며, CJS 라이브러리를 ESM 버전으로 바꾸고 미사용 코드를 지워 운영 빌드 약 35초, JS·CSS 전체 6,471KiB에서 5,356KiB가 된 비교도",
  },
  "content-form-unify": {
    src: "/diagrams/content-form-unify.drawio.svg",
    alt: "변경 전에는 계약등록, 콘텐츠 등록·변경, 영상 등록·변경 5개 화면이 각자 콘텐츠 입력 폼 사본을 갖고 필수값과 검증 규칙이 제각각이었고, 변경 후에는 5개 화면이 공통 콘텐츠 입력 컴포넌트 하나를 쓰고 그룹콘텐츠 중복 검사는 공통 composable로 분리해 기준이 5곳에서 1곳으로 줄어든 비교도",
  },
};
