import type { Experience } from "@/app/types/experience";
import { keepLineStart } from "@/components/case-study/inline-code";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { getTotalPeriod, splitPeriod } from "@/lib/period";
import { revealDelay } from "@/lib/utils";
import { ChipList } from "./chip-list";
import { HOME_SECTION_CLASS, SectionHeading } from "./section-heading";

const PeriodLabel = ({ experience }: { experience: Experience }) => {
  const total = getTotalPeriod(experience.period);
  const [start, end] = splitPeriod(experience.period);

  return (
    <p
      className={`text-[0.9375rem] tabular-nums leading-relaxed md:pt-1 ${
        experience.isActive ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <span className="md:block">
        {start}
        {/* 한 달짜리 경력은 끝이 없으므로 줄표와 끝을 그리지 않는다. */}
        {end && <span aria-hidden="true"> –</span>}
      </span>{" "}
      {end && <span className="md:block">{end}</span>}
      {total && <span className="ml-2 md:ml-0 md:block">({total})</span>}
    </p>
  );
};

const ExperienceItem = ({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) => (
  <li
    data-reveal
    style={revealDelay(index % 3)}
    className="grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-10"
  >
    <PeriodLabel experience={experience} />

    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-xl font-medium leading-snug">
          {experience.company}
          {experience.isActive && (
            <span className="sr-only">(현재 재직 중)</span>
          )}
        </h3>
        {experience.position && (
          <p className="text-base font-medium">{experience.position}</p>
        )}
        <p className="text-[0.9375rem] text-muted-foreground">
          {experience.jobs.join("·")}
        </p>
      </div>

      <p className="text-base font-medium leading-snug">
        {keepLineStart(experience.tagline)}
      </p>
      <ul className="space-y-2 text-base leading-relaxed">
        {experience.duties.map((duty) => (
          <li key={duty}>{keepLineStart(duty)}</li>
        ))}
      </ul>
      {experience.techs && (
        <ChipList items={experience.techs} label="사용 기술" className="pt-1" />
      )}
    </div>
  </li>
);

export const ExperienceSection = () => {
  return (
    <section id="experience" className={`${HOME_SECTION_CLASS} space-y-10`}>
      <SectionHeading>경력</SectionHeading>

      <ol className="space-y-12">
        {EXPERIENCES_DATA.map((experience, index) => (
          <ExperienceItem
            key={experience.id}
            experience={experience}
            index={index}
          />
        ))}
      </ol>
    </section>
  );
};
