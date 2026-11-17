import "@/components/iso/iso.css";
import "./hero-lego.css";
import { SCENE } from "./scene";

// 움직이지 않는 레고 장면. PDF 표지가 쓴다. 엔진(engine.ts)을 붙이지 않아 서버가 그린 처음 모습 그대로다.
// data-still은 엔진이 자동 시연을 멈출 때 다는 표시다. 처음부터 달아 CSS로 깜빡이는 커서를 멈추고 시연용 마우스 커서를 숨긴다.
// 깜빡임이 남으면 PDF를 만드는 순간에 따라 커서가 찍히거나 빠진다.
// .hero-lego.iso는 부모를 꽉 채우는 절대 배치라서, 쓰는 쪽이 position: relative와 크기를 가진 상자로 감싼다(장면 비율 540:520).
export const HeroLegoStill = () => (
  <div className="hero-lego iso" data-still="" aria-hidden="true">
    {SCENE}
  </div>
);
