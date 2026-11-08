const skills = [
  {
    category: "언어·프레임워크",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue",
      "Java",
      "Spring Boot",
      "SQL",
      "Flutter",
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

const SkillsSection = () => {
  return (
    <section id="skills" className="scroll-mt-3 space-y-10 py-12 lg:py-16">
      <h2
        data-reveal
        className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-balance"
      >
        기술
      </h2>

      <dl className="space-y-8">
        {skills.map((group, index) => (
          <div
            key={group.category}
            data-reveal
            style={{ "--i": index % 3 } as React.CSSProperties}
            className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <dt className="text-lg text-muted-foreground">{group.category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-6 gap-y-1 text-2xl font-medium">
                {group.items.map((item) => (
                  <li key={item} translate="no">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SkillsSection;
