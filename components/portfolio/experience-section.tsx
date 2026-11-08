import { EXPERIENCES_DATA } from "@/data/experiences";
import { getTotalPeriod } from "@/lib/period";

// "2022. 12. - 2024. 12." → ["2022. 12.", "2024. 12."]
const splitPeriod = (period: string): [string, string] => {
  const [start, end = ""] = period.split(/\s+-\s+/);
  return [start, end];
};

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

      <ol className="space-y-12">
        {EXPERIENCES_DATA.map((exp, index) => {
          const total = exp.isActive ? null : getTotalPeriod(exp.period);
          const [start, end] = splitPeriod(exp.period);

          return (
            <li
              key={exp.id}
              data-reveal
              style={{ "--i": index % 3 } as React.CSSProperties}
              className="grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-10"
            >
              <p
                className={`text-[0.9375rem] tabular-nums leading-relaxed md:pt-1 ${
                  exp.isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="md:block">
                  {start}
                  <span aria-hidden="true"> –</span>
                </span>{" "}
                <span className="md:block">{end}</span>
                {total && (
                  <span className="ml-2 md:ml-0 md:block">({total})</span>
                )}
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-medium leading-snug">
                    {exp.company}
                    {exp.isActive && (
                      <span className="sr-only">(현재 재직 중)</span>
                    )}
                  </h3>
                  {exp.position && (
                    <p className="text-base font-medium">{exp.position}</p>
                  )}
                  <p className="text-[0.9375rem] text-muted-foreground">
                    {exp.jobs.join(" · ")}
                  </p>
                </div>

                <p className="text-base font-medium leading-snug">
                  {exp.tagline}
                </p>
                <ul className="space-y-2 text-base leading-relaxed">
                  {exp.duties.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>

                {exp.techs && exp.techs.length > 0 && (
                  <ul aria-label="사용 기술" className="flex flex-wrap gap-2">
                    {exp.techs.map((tech) => (
                      <li
                        key={tech}
                        translate="no"
                        className="bg-card px-3 py-1 text-[0.9375rem]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ExperienceSection;
