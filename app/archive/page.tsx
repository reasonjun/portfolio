import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { getArchiveRows } from "@/lib/projects";
import { TEXT_LINK_CLASS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "전체 프로젝트 | 이성준 포트폴리오",
};

const COLUMNS = ["기간", "프로젝트", "회사", "기술"];

export default function ArchivePage() {
  const rows = getArchiveRows();

  return (
    <div className="py-12 space-y-8">
      <BackLink href="/#case-studies">대표 프로젝트</BackLink>

      <h1 id="archive-heading" className="text-3xl font-bold text-balance">
        전체 프로젝트
      </h1>

      {/* 좁은 화면에서 가로 스크롤이 생긴다. 링크가 없는 행도 키보드로 스크롤할 수 있게 영역에 포커스를 준다. */}
      <section
        aria-labelledby="archive-heading"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: 스크롤 영역은 키보드로 스크롤하려면 포커스를 받아야 한다.
        tabIndex={0}
        className="scroll-mt-4 overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <table className="w-full min-w-[640px]">
          <caption className="sr-only">
            전체 프로젝트를 최신순으로 정리한 표입니다. 링크로 된 제목은 대표
            프로젝트 상세 페이지로 이동합니다.
          </caption>
          <thead className="bg-muted/50">
            <tr>
              {COLUMNS.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="even:bg-muted/20 hover:bg-muted/40">
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                  {row.period}
                </td>
                <th
                  scope="row"
                  className="px-4 py-3 text-left text-sm font-medium"
                >
                  {row.href ? (
                    <Link href={row.href} className={TEXT_LINK_CLASS}>
                      {row.title}
                    </Link>
                  ) : (
                    row.title
                  )}
                  {/* 부제는 링크 밖에 둔다. 링크 안에 넣으면 스크린리더가 링크마다 긴 문장을 읽는다. */}
                  <p className="mt-1 text-xs font-normal text-muted-foreground">
                    {row.description}
                  </p>
                </th>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {row.company}
                </td>
                <td
                  translate="no"
                  className="px-4 py-3 text-sm text-muted-foreground"
                >
                  {row.techStack.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
