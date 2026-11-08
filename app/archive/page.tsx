import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/portfolio/navbar";
import { getArchiveRows } from "@/lib/projects";

export const metadata: Metadata = {
  title: "전체 프로젝트 | 이성준 포트폴리오",
};

export default function ArchivePage() {
  const rows = getArchiveRows();

  return (
    <div className="min-h-svh bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 메인으로
        </Link>

        <h1 className="text-3xl font-bold">전체 프로젝트</h1>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  연도
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  프로젝트
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  회사
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  기술
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="even:bg-muted/20 hover:bg-muted/40">
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {row.year}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {row.href ? (
                      <Link
                        href={row.href}
                        className="underline underline-offset-4"
                      >
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {row.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {row.techStack.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
