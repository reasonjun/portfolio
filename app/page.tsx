import ExperienceSection from "@/components/portfolio/experience-section";
import Footer from "@/components/portfolio/footer";
import HeroSection from "@/components/portfolio/hero-section";
import Navbar from "@/components/portfolio/navbar";
import ProjectsSection from "@/components/portfolio/projects-section";
import SkillsSection from "@/components/portfolio/skills-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
      </main>

      <Footer />
    </div>
  );
}
