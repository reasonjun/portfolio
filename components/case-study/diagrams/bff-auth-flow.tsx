import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 색상이 고정이라 흰 배경에 둔다.
export const BffAuthFlowDiagram = () => (
  <Image
    src={withBasePath("/diagrams/bff-auth-flow.drawio.svg")}
    alt="브라우저는 암호화 세션 쿠키만 갖고 BFF가 토큰으로 백엔드를 호출하며, 만료 임박 시 동시 요청의 refresh를 같은 모듈 안에서 합치는 인증 시퀀스 다이어그램"
    width={811}
    height={754}
    className="mx-auto h-auto w-full min-w-[560px] max-w-[720px] rounded bg-white p-2"
  />
);
