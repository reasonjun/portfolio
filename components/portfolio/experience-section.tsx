interface Experience {
  company: string;
  period: string;
  role?: string;
  isActive?: boolean;
}

const experiences: Experience[] = [
  {
    company: "㈜닷",
    period: "2022. 12. - 2024. 12.",
    isActive: false,
  },
  {
    company: "이노데일㈜",
    period: "2019. 02. - 2022. 07.",
    role: "역할, 핵심 기여",
    isActive: false,
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">경력</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`border-l-2 ${exp.isActive ? "border-primary" : "border-muted"} pl-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 ${exp.isActive ? "bg-primary" : "bg-muted"} rounded-full -ml-6`}
              />
              <h3 className="font-semibold">{exp.company}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{exp.period}</p>
            {exp.role && (
              <p className="text-sm text-muted-foreground mt-1">{exp.role}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
