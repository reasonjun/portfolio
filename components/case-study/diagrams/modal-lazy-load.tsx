import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 글자색이 고정이라 흰 배경에 둔다.
export const ModalLazyLoadDiagram = () => (
  <Image
    src={withBasePath("/diagrams/modal-lazy-load.drawio.svg")}
    alt="거대 배럴과 Suspense 경계 없는 모달 때문에 지연 로드가 무효화되고 페이지 전체가 스켈레톤으로 바뀌던 흐름과, 전용 index와 모달 자체 Suspense 경계로 해결한 흐름의 비교 도식"
    width={720}
    height={570}
    className="h-auto w-full min-w-[480px] rounded bg-white p-2"
  />
);
