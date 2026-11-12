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
};
