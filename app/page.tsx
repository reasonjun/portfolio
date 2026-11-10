import CaseStudiesSection from "@/components/portfolio/case-studies-section";
import ExperienceSection from "@/components/portfolio/experience-section";
import { HeroScrollHandoff } from "@/components/portfolio/hero-scroll-handoff";
import HeroSection from "@/components/portfolio/hero-section";
import { MotionObserver } from "@/components/portfolio/motion-observer";
import SkillsSection from "@/components/portfolio/skills-section";

export default function Home() {
  return (
    <>
      <MotionObserver />
      <HeroScrollHandoff />
      <HeroSection />
      <CaseStudiesSection />
      <ExperienceSection />
      <SkillsSection />
    </>
  );
}
