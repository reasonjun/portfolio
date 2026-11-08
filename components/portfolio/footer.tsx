import { Mail } from "lucide-react";
import { PROFILE } from "@/data/profile";

// lucide-react 1.x에는 브랜드 아이콘(Github)이 없어서 GitHub 마크를 직접 그린다.
const GithubMark = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LINK_CLASS =
  "flex items-center gap-2 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

// 페이지의 끝. 메뉴의 "연락하기"(모바일)가 이곳으로 이동한다.
const Footer = () => {
  return (
    <footer id="contact" className="scroll-mt-3">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap gap-x-8 border-t py-5">
          <a href={`mailto:${PROFILE.email}`} className={LINK_CLASS}>
            <Mail aria-hidden="true" className="h-5 w-5 shrink-0" />
            {PROFILE.email}
          </a>
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            <GithubMark className="h-5 w-5 shrink-0" />
            <span translate="no">GitHub</span>
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
