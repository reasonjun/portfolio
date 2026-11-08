import { EXPERIENCES_DATA } from "@/data/experiences";

const ExperienceSection = () => {
  return (
    <section id="experience" className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">경력</h2>
      <div className="space-y-6">
        {EXPERIENCES_DATA.map((exp) => (
          <div
            key={exp.id}
            className={`border-l-2 ${
              exp.isActive ? "border-primary" : "border-muted"
            } pl-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 ${
                  exp.isActive ? "bg-primary" : "bg-muted"
                } rounded-full -ml-6`}
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
