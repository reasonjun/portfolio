import { PROFILE } from "@/data/profile";
import { withBasePath } from "@/lib/base-path";

const LINK_CLASS =
  "text-lg font-medium underline decoration-2 underline-offset-8 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

// 분할을 깨고 화면 전체 너비를 쓰는 면. 초록은 "트래픽을 받는 쪽"이고, 여기가 그 끝이다.
const ContactSection = () => {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-3 bg-[var(--field)] px-6 py-16 text-[var(--field-ink)] lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="contact-heading"
          data-reveal
          className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.1] tracking-[-0.02em]"
        >
          연락처
        </h2>
        <a
          href={`mailto:${PROFILE.email}`}
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-6 block text-[clamp(1.25rem,2.6vw,2.25rem)] font-medium leading-none tracking-[-0.03em] underline decoration-[0.04em] underline-offset-[0.14em] outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
        >
          {PROFILE.email}
        </a>
        <div
          data-reveal
          style={{ "--i": 2 } as React.CSSProperties}
          className="mt-8 flex flex-wrap gap-x-8 gap-y-4"
        >
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            <span translate="no">GitHub</span>
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
          <a
            href={withBasePath("/portfolio.pdf")}
            download
            className={LINK_CLASS}
          >
            PDF 내려받기
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
