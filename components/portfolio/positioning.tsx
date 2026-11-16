import { PROFILE } from "@/data/profile";

// 소개 문구를 데이터의 줄 단위대로 끊어 보여 준다. 감싸는 문단은 쓰는 곳에서 고른다.
export const Positioning = () =>
  PROFILE.positioning.map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));
