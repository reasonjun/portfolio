import { revealDelay } from "@/lib/utils";
import { ChipList } from "./chip-list";
import { SectionHeading } from "./section-heading";

const skills = [
  {
    category: "언어·프레임워크",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue",
      "Flutter",
      "Java",
      "Spring Boot",
      "SQL",
    ],
  },
  { category: "상태·데이터", items: ["TanStack Query", "Pinia", "Zod"] },
  {
    category: "UI·디자인 시스템",
    items: ["Ant Design", "Storybook", "Figma"],
  },
  {
    category: "품질·자동화",
    items: ["Playwright", "Biome", "ESLint", "husky"],
  },
  {
    category: "빌드·배포",
    items: ["Vite", "Docker", "Nginx", "GitLab CI/CD", "AWS S3·CloudFront"],
  },
];

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="scroll-mt-7 space-y-10 py-12 lg:scroll-mt-3 lg:py-16"
    >
      <SectionHeading>기술</SectionHeading>

      <dl className="space-y-8">
        {skills.map((group, index) => (
          <div
            key={group.category}
            data-reveal
            style={revealDelay(index % 3)}
            className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <dt className="text-base text-muted-foreground">
              {group.category}
            </dt>
            <dd>
              <ChipList items={group.items} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
