import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

interface SiteLayoutProps {
  children: ReactNode;
}

// 홈, 전체 프로젝트, 사례 페이지가 같은 골격을 쓴다. 그룹 폴더 이름은 주소에 나오지 않는다.
export default function SiteLayout({ children }: SiteLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
