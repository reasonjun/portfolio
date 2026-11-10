import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

interface ProjectCardProps {
  id: string;
  title: string;
  summary: string;
  meta: string;
  image: string | null;
  imagePosition?: string;
  index: number;
}

/**
 * 대표 프로젝트 카드 하나. 링크는 제목에만 걸고, 카드 전체가 눌리도록 ::after로 영역을 넓힌다.
 * 이미지가 없는 프로젝트는 썸네일 영역 없이 텍스트 카드로 둔다.
 */
export const ProjectCard = ({
  id,
  title,
  summary,
  meta,
  image,
  imagePosition,
  index,
}: ProjectCardProps) => (
  <li
    data-reveal
    style={{ "--i": index % 3 } as React.CSSProperties}
    className="group relative flex flex-col bg-card transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary hover:bg-accent motion-reduce:transition-none"
  >
    {image && (
      <div className="relative aspect-video overflow-hidden bg-accent">
        <Image
          src={withBasePath(`/${image}`)}
          alt={`${title} 화면`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition ?? "top" }}
        />
      </div>
    )}

    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-lg font-medium leading-snug">
        <Link
          href={`/projects/${id}/`}
          className="outline-none after:absolute after:inset-0"
        >
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed">
        {summary}
      </p>
      <p className="mt-auto pt-4 text-[0.9375rem] tabular-nums text-muted-foreground">
        {meta}
      </p>
    </div>
  </li>
);
