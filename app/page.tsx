import CaseStudiesSection from "@/components/portfolio/case-studies-section";
import ExperienceSection from "@/components/portfolio/experience-section";
import Footer from "@/components/portfolio/footer";
import HeroSection from "@/components/portfolio/hero-section";
import { MotionObserver } from "@/components/portfolio/motion-observer";
import Navbar from "@/components/portfolio/navbar";
import SkillsSection from "@/components/portfolio/skills-section";

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        본문으로 건너뛰기
      </a>
      <MotionObserver />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <div className="mx-auto max-w-5xl px-6">
          <HeroSection />
        </div>
        <div className="mx-auto max-w-5xl px-6">
          <SkillsSection />
        </div>
        <CaseStudiesSection />
        <div className="mx-auto max-w-5xl px-6">
          <ExperienceSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
