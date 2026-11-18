import { Fragment, type ReactNode } from "react";

// 크롬은 한글 뒤 가운뎃점 앞과, 닫는 괄호와 뒤 한글(조사) 사이에서 줄을 바꾼다. 라틴 문자·숫자 뒤 가운뎃점에서는 바꾸지 않는다.
const NO_BREAK_PAIR = /([가-힣]·|\)[가-힣])/;

/**
 * 줄 첫머리에 가운뎃점이나 닫는 괄호 뒤 조사가 오지 않게 두 글자를 줄바꿈 없는 span으로 묶는다.
 * 단어 결합자(U+2060) 같은 보이지 않는 문자는 PDF 글자층·책갈피와 복사한 글에 남으므로 글자는 바꾸지 않는다.
 */
export const keepLineStart = (text: string): ReactNode =>
  text.split(NO_BREAK_PAIR).map((part, i) => {
    if (i % 2 === 0) return part;
    return (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: 고정 문자열을 나눈 결과라 순서가 바뀌지 않는다.
        key={i}
        className="whitespace-nowrap"
      >
        {part}
      </span>
    );
  });

/**
 * 백틱으로 감싼 부분을 <code>로 렌더링한다. 코드 밖 글에는 줄머리 금칙(keepLineStart)을 적용한다.
 * 이 함수를 쓰는 페이지는 바깥 요소에 codeFont.variable(app/fonts.ts)을 달아야 코드가 D2Coding으로 그려진다.
 */
export const renderInlineCode = (text: string): ReactNode =>
  text.split("`").map((part, i) => {
    const isCode = i % 2 === 1;
    const Tag = isCode ? "code" : Fragment;
    // biome-ignore lint/suspicious/noArrayIndexKey: 고정 문자열을 나눈 결과라 순서가 바뀌지 않는다.
    return <Tag key={i}>{isCode ? part : keepLineStart(part)}</Tag>;
  });

/** 백틱 표시를 뺀 평문. 스크린리더용 제목처럼 마크업을 쓸 수 없는 곳에 쓴다. */
export const stripInlineCode = (text: string): string =>
  text.replaceAll("`", "");
