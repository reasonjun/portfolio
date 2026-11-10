import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 사이트에 다크 모드가 없어
// `--theme light`로 내보내 색을 라이트로 고정했고, 그래서 흰 배경에 둔다.
export const BlueGreenDeployDiagram = () => (
  <Image
    src={withBasePath("/diagrams/blue-green-deploy.drawio.svg")}
    alt="헬스체크와 nginx 설정 검사·reload를 통과해야 새 슬롯으로 트래픽을 전환하고, 실패하면 기존 버전을 유지하는 배포 순서도. 배포 전에 열어 둔 탭의 요청은 배포 ID로 이전 슬롯에 보내고, 30분이 지나거나 그 안에 다시 배포해 만료되면 410을 받아 새로고침하거나 모달로 안내한 뒤 입력을 복원한다"
    width={808}
    height={1117}
    className="mx-auto h-auto w-full min-w-[480px] max-w-[780px] rounded bg-white p-2"
  />
);
