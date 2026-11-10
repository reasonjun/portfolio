import CaseStudiesSection from "@/components/portfolio/case-studies-section";
import ExperienceSection from "@/components/portfolio/experience-section";
import HeroSection from "@/components/portfolio/hero-section";
import { MotionObserver } from "@/components/portfolio/motion-observer";
import SkillsSection from "@/components/portfolio/skills-section";

export default function Home() {
  return (
    <>
      <MotionObserver />
      <div className="mx-auto max-w-5xl px-6">
        <HeroSection />
      </div>
      <CaseStudiesSection />
      <div className="mx-auto max-w-5xl px-6">
        <ExperienceSection />
      </div>
      <div className="mx-auto max-w-5xl px-6">
        <SkillsSection />
      </div>
    </>
  );
}
