import { EXPERIENCES_DATA } from "@/data/experiences";
import { getTotalPeriod } from "@/lib/period";

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="scroll-mt-3 space-y-10 py-16 lg:py-[7.5rem]"
    >
      <h2
        data-reveal
        className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-balance"
      >
        경력
      </h2>

      <ol className="space-y-16">
        {EXPERIENCES_DATA.map((exp, index) => {
          const total = exp.isActive ? null : getTotalPeriod(exp.period);

          return (
            <li
              key={exp.id}
              data-reveal
              style={{ "--i": index % 3 } as React.CSSProperties}
              className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-12"
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-2xl font-medium leading-snug">
                    {exp.company}
                    {exp.isActive && (
                      <span className="sr-only">(현재 재직 중)</span>
                    )}
                  </h3>
                  <p
                    className={`text-base tabular-nums ${
                      exp.isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {exp.period}
                    {total && <span className="ml-2">({total})</span>}
                  </p>
                </div>
                {exp.position && (
                  <p className="text-lg font-medium">{exp.position}</p>
                )}
                <ul aria-label="직무" className="flex flex-wrap gap-2">
                  {exp.jobs.map((job) => (
                    <li key={job} className="bg-card px-3 py-1 text-sm">
                      {job}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-medium leading-snug">
                  {exp.tagline}
                </p>
                <ul className="space-y-2 text-base leading-relaxed">
                  {exp.duties.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ExperienceSection;
