"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  children: ReactNode;
}

const MobileNav = ({ children }: MobileNavProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 네비는 루트 레이아웃에 있어 페이지가 바뀌어도 언마운트되지 않는다.
  // 뒤로 가기처럼 메뉴 항목을 거치지 않고 페이지가 바뀌면 열린 메뉴를 닫는다.
  const [shownPathname, setShownPathname] = useState(pathname);
  if (pathname !== shownPathname) {
    setShownPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            aria-label="메뉴 열기"
            className="-ml-1 p-3 rounded-md hover:bg-accent outline-none focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64"
          onCloseAutoFocus={(event) => {
            // 기본 복귀 포커스는 앵커 이동 직후 페이지를 되돌리므로 스크롤 없이 직접 복귀시킨다.
            event.preventDefault();
            triggerRef.current?.focus({ preventScroll: true });
          }}
        >
          <SheetHeader>
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
