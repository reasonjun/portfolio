import { Badge } from "@/components/ui/badge";

const skills = [
  {
    category: "프로그래밍 언어",
    items: ["TypeScript", "JavaScript", "Java", "Dart", "Swift"],
  },
  { category: "프론트엔드", items: ["Vue.js", "React", "Next.js", "Flutter"] },
  { category: "백엔드", items: ["Spring (Boot)", "SQL"] },
  { category: "데브옵스", items: ["Docker", "AWS", "Jenkins", "Keycloak"] },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">기술</h2>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">분야</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                기술 스택
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {skills.map((skillGroup) => (
              <tr key={skillGroup.category} className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {skillGroup.category}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SkillsSection;
