import { Download } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { withBasePath } from "@/lib/base-path";
import { Pipeline } from "./pipeline";

const HeroSection = () => {
  return (
    <section
      id="about"
      className="flex min-h-[calc(100svh-var(--navbar-height))] flex-col justify-center gap-10 py-12 lg:gap-14 lg:py-16"
    >
      <h1
        data-reveal
        style={{ "--i": 0 } as React.CSSProperties}
        className="text-[clamp(5.5rem,26vw,22rem)] font-medium leading-[0.9] tracking-[-0.05em]"
      >
        {PROFILE.name}
      </h1>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-6">
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

        <div className="space-y-10">
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <Pipeline stages={PROFILE.pipeline} />
          </div>
          <div data-reveal style={{ "--i": 4 } as React.CSSProperties}>
            <a
              href={withBasePath("/portfolio.pdf")}
              download
              className="inline-flex h-14 items-center gap-3 bg-primary px-6 text-lg font-semibold text-primary-foreground outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Download aria-hidden="true" className="size-5" />
              포트폴리오 PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
