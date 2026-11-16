import { createElement, Fragment, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  keepLineStart,
  renderInlineCode,
} from "@/components/case-study/inline-code";

const html = (node: ReactNode) =>
  renderToStaticMarkup(createElement(Fragment, null, node));

describe("keepLineStart", () => {
  it("한글 뒤 가운뎃점과 닫는 괄호 뒤 한글만 줄바꿈 없는 span으로 묶는다", () => {
    expect(html(keepLineStart("업무 위키·명세(SDD)로 EC2·ALB"))).toBe(
      '업무 위<span class="whitespace-nowrap">키·</span>명세(SDD<span class="whitespace-nowrap">)로</span> EC2·ALB',
    );
  });

  it("보이지 않는 문자를 넣지 않아 PDF·복사한 글이 데이터와 같다", () => {
    const text = "활성 슬롯·이전 슬롯 `X-Id` 탭)이";
    const rendered = html(renderInlineCode(text)).replace(/<[^>]+>/g, "");
    expect(rendered).toBe(text.replaceAll("`", ""));
  });
});
