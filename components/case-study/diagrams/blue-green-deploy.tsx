import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 색상이 고정이라 흰 배경에 둔다.
export const BlueGreenDeployDiagram = () => (
  <Image
    src={withBasePath("/diagrams/blue-green-deploy.drawio.svg")}
    alt="새 컨테이너 실행 후 헬스체크와 nginx 설정 검사를 통과하면 트래픽을 전환하고, 실패하면 새 컨테이너를 중지해 기존 버전을 유지하는 배포 순서도"
    width={638}
    height={640}
    className="mx-auto h-auto w-full min-w-[480px] max-w-[640px] rounded bg-white p-2"
  />
);
