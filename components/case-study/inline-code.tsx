import { Fragment, type ReactNode } from "react";

/** 백틱으로 감싼 부분을 <code>로 렌더링한다. 줄바꿈은 브라우저 기본 동작에 맡긴다. */
export const renderInlineCode = (text: string): ReactNode =>
  text.split("`").map((part, i) => {
    const Tag = i % 2 === 1 ? "code" : Fragment;
    // biome-ignore lint/suspicious/noArrayIndexKey: 고정 문자열을 나눈 결과라 순서가 바뀌지 않는다.
    return <Tag key={i}>{part}</Tag>;
  });
