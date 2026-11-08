import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

interface ProjectCardProps {
  id: string;
  title: string;
  role: string;
  summary: string;
  meta: string;
  image: string | null;
  imagePosition?: string;
  techStack: string[];
  index: number;
}

const FALLBACK_TECH_COUNT = 3;

/**
 * 대표 프로젝트 카드 하나. 링크는 제목에만 걸고, 카드 전체가 눌리도록 ::after로 영역을 넓힌다.
 * 이미지가 아직 없는 프로젝트는 같은 16:9 틀에 기술 스택만 보여 준다.
 */
export const ProjectCard = ({
  id,
  title,
  role,
  summary,
  meta,
  image,
  imagePosition,
  techStack,
  index,
}: ProjectCardProps) => (
  <li
    data-reveal
    style={{ "--i": index % 3 } as React.CSSProperties}
    className="group relative flex flex-col bg-card transition-colors duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary hover:bg-accent motion-reduce:transition-none"
  >
    <div className="relative aspect-video overflow-hidden bg-accent">
      {image ? (
        <Image
          src={withBasePath(`/${image}`)}
          alt={`${title} 화면`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition ?? "top" }}
        />
      ) : (
        <p
          className="absolute inset-x-0 bottom-0 p-4 text-sm text-muted-foreground"
          translate="no"
        >
          {techStack.slice(0, FALLBACK_TECH_COUNT).join(" · ")}
        </p>
      )}
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-lg font-medium leading-snug">
        <Link
          href={`/projects/${id}/`}
          className="outline-none after:absolute after:inset-0"
        >
          {title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-primary">{role}</p>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed">{summary}</p>
      <p className="mt-auto pt-4 text-sm tabular-nums text-muted-foreground">
        {meta}
      </p>
    </div>
  </li>
);
