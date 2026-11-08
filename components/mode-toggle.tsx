"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="다크 모드"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border bg-muted p-[3px] outline-none transition-colors! duration-300 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none!"
    >
      <span className="pointer-events-none relative flex size-5 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-transform! duration-300 ease-out motion-reduce:transition-none! dark:translate-x-5">
        <Sun
          aria-hidden="true"
          className="size-3.5 scale-100 transition-transform! duration-300 motion-reduce:transition-none! dark:scale-0"
        />
        <Moon
          aria-hidden="true"
          className="absolute size-3.5 scale-0 transition-transform! duration-300 motion-reduce:transition-none! dark:scale-100"
        />
      </span>
    </button>
  );
}
