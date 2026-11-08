import { Download } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { withBasePath } from "@/lib/base-path";
import { HeroLego } from "./hero-lego/hero-lego";

const HeroSection = () => {
  return (
    <section
      id="about"
      className="grid min-h-[calc(100svh-var(--navbar-height))] items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10 lg:py-16"
    >
      <div className="space-y-8">
        <h1
          data-reveal
          style={{ "--i": 0 } as React.CSSProperties}
          className="text-[clamp(4rem,11vw,8.5rem)] font-medium leading-[0.95] tracking-[-0.04em]"
        >
          {PROFILE.name}
        </h1>
        <div className="space-y-4">
          <p
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="text-2xl font-medium lg:text-3xl"
          >
            {PROFILE.role}
          </p>
          <p
            data-reveal
            style={{ "--i": 2 } as React.CSSProperties}
            className="max-w-[40ch] text-lg leading-relaxed lg:text-xl"
          >
            {PROFILE.positioning.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          <a
            href={withBasePath("/portfolio.pdf")}
            download
            className="inline-flex h-14 items-center gap-3 border-2 border-foreground px-6 text-lg font-semibold text-foreground transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Download aria-hidden="true" className="size-5" />
            포트폴리오 PDF
          </a>
        </div>
      </div>

      <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
        <div className="hero-backdrop relative h-[22rem] overflow-hidden sm:h-[28rem]">
          <HeroLego />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
