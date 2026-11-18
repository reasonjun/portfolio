import type { Metadata } from "next";
import Image from "next/image";
import { codeFont } from "@/app/fonts";
import type { CaseStudyProject } from "@/app/types/project";
import { ChunkPoints } from "@/components/case-study/chunk-points";
import {
  keepLineStart,
  renderInlineCode,
} from "@/components/case-study/inline-code";
import { HeroLegoStill } from "@/components/portfolio/hero-lego/hero-lego-still";
import { PROFILE } from "@/data/profile";
import { withBasePath } from "@/lib/base-path";
import { getPublicImageSize } from "@/lib/image-size";
import {
  chunkDetailAnchor,
  chunkFigureSrc,
  getMainTech,
  getPdfChunks,
  type PdfChunk,
} from "@/lib/projects";
import { joinMeta } from "@/lib/utils";
import "./paper.css";

// PDF 생성 스크립트(scripts/generate-pdf.mjs)가 이 페이지를 PDF로 저장한다. 메뉴에는 노출하지 않는다.
// 웹 페이지를 인쇄한 것이 아니라 처음부터 A4 쪽 상자로 그린 문서라서, 브라우저에서 본 모습이 곧 PDF다.
// PDF 문서 제목이 되므로 레이아웃의 제목 템플릿을 붙이지 않는다.
export const metadata: Metadata = {
  title: { absolute: "포트폴리오 | 이성준" },
};

const DOCUMENT_NAME = "프론트엔드 포트폴리오";

// 주소에서 "https://"와 끝의 "/"를 떼어 표지에 적는다.
const SITE_LABEL = PROFILE.siteUrl
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

interface ChunkSheetProps {
  project: CaseStudyProject;
  chunk: PdfChunk;
  pageNumber: number;
  pageCount: number;
}

const ChunkSheet = ({
  project,
  chunk,
  pageNumber,
  pageCount,
}: ChunkSheetProps) => {
  const src = chunkFigureSrc(chunk.id);
  const size = getPublicImageSize(src);

  return (
    <section className="sheet" data-sheet={chunk.id}>
      <header className="sheet-meta">
        <p>
          {joinMeta(
            project.title,
            project.company,
            project.period,
            project.caseStudy.team,
          )}
        </p>
        <p>{getMainTech(project.techStack).join(" · ")}</p>
      </header>
      <h2 className="sheet-title">
        <a
          href={`${PROFILE.siteUrl}projects/${project.id}/#${chunkDetailAnchor(chunk.id)}`}
        >
          {keepLineStart(chunk.title)}
        </a>
      </h2>
      <figure
        className="sheet-figure"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <Image
          src={withBasePath(src)}
          alt={chunk.figure.alt}
          width={size.width}
          height={size.height}
          loading="eager"
        />
      </figure>
      <p className="sheet-caption">{renderInlineCode(chunk.figure.caption)}</p>
      <ChunkPoints chunk={chunk} />
      <footer className="sheet-foot">
        {pageNumber} / {pageCount}
      </footer>
    </section>
  );
};

export default function ExportPage() {
  const chunks = getPdfChunks();
  const pageCount = chunks.length + 1;

  return (
    <div className={`paper ${codeFont.variable}`}>
      {/* 표지. 소개·경력·연락처·목차는 이력서와 겹쳐서 넣지 않는다. */}
      <section className="sheet sheet-cover" data-sheet="cover">
        <h1 className="cover-name">{PROFILE.name}</h1>
        <p className="cover-role">{DOCUMENT_NAME}</p>
        <div className="cover-lego">
          <HeroLegoStill />
        </div>
        <a className="cover-site" href={PROFILE.siteUrl}>
          {SITE_LABEL}
        </a>
      </section>

      {/* 덩어리 하나에 한 쪽. scripts/generate-pdf.mjs가 data-sheet로 쪽 상자를 찾는다. 이름을 바꾸면 함께 바꾼다. */}
      {chunks.map(({ project, chunk }, index) => (
        <ChunkSheet
          key={chunk.id}
          project={project}
          chunk={chunk}
          // 쪽 번호는 표지를 1로 센다.
          pageNumber={index + 2}
          pageCount={pageCount}
        />
      ))}
    </div>
  );
}
