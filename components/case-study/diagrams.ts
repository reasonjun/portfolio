import type { DiagramId } from "@/app/types/project";

// 크기는 적지 않는다. 빌드 시 SVG 파일에서 읽는다(getPublicImageSize). 다시 내보내도 어긋나지 않게 하기 위함이다.
export interface DiagramAsset {
  src: string;
  alt: string;
}

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 사이트에 다크 모드가 없어
// `--theme light`로 내보내 색을 라이트로 고정했고, 그래서 흰 배경에 둔다.
export const DIAGRAMS: Record<DiagramId, DiagramAsset> = {
  "bff-auth-flow": {
    src: "/diagrams/bff-auth-flow.drawio.svg",
    alt: "브라우저는 암호화 세션 쿠키만 갖고 BFF가 토큰으로 백엔드를 호출하며, 만료 임박 시 동시 요청의 refresh를 같은 모듈 안에서 합치는 인증 시퀀스 다이어그램",
  },
  "blue-green-deploy": {
    src: "/diagrams/blue-green-deploy.drawio.svg",
    alt: "브라우저 요청을 EC2 안의 Nginx map이 배포 ID로 나눠, 새로 연 탭은 활성 슬롯, 배포 전에 열어 둔 탭은 30분 유지되는 이전 슬롯으로 보내고, 만료된 배포 ID에는 410을 반환해 브라우저가 폼 수정 여부에 따라 새로고침하거나 모달로 안내한 뒤 입력을 복원하는 구조도. 아래에는 이미지 pull, 헬스체크, nginx 설정 검사를 통과해야 전환하고 실패하면 기존 버전을 유지하며, 전환 후 30분이 지나거나 재배포하면 만료 처리 후 SIGTERM으로 종료하는 배포 순서",
  },
  "modal-lazy-load": {
    src: "/diagrams/modal-lazy-load.drawio.svg",
    alt: "거대 배럴과 Suspense 경계 없는 모달 때문에 지연 로드가 무효화되고 페이지 전체가 스켈레톤으로 바뀌던 흐름과, 전용 index와 모달 자체 Suspense 경계로 해결한 흐름의 비교 도식",
  },
};
