import { describe, expect, it } from "vitest";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { getTotalPeriod } from "./period";

describe("getTotalPeriod", () => {
  it("이력서와 같은 방식으로 시작한 달과 끝난 달을 모두 센다", () => {
    expect(getTotalPeriod("2022. 12. - 2024. 12.")).toBe("2년 1개월");
    expect(getTotalPeriod("2019. 02. - 2022. 08.")).toBe("3년 7개월");
  });

  it("1년 미만이면 개월만, 딱 맞는 해는 년만 보여 준다", () => {
    expect(getTotalPeriod("2025. 05. - 2025. 08.")).toBe("4개월");
    expect(getTotalPeriod("2023. 01. - 2023. 12.")).toBe("1년");
  });

  it("재직 중이거나 형식이 맞지 않으면 null이다", () => {
    expect(getTotalPeriod("2025. 10. - 재직 중")).toBeNull();
    expect(getTotalPeriod("2025년 10월")).toBeNull();
    expect(getTotalPeriod("2024. 12. - 2022. 12.")).toBeNull();
  });

  it("경력 데이터에서는 종료된 회사만 총 기간이 나온다", () => {
    const totals = Object.fromEntries(
      EXPERIENCES_DATA.map((exp) => [
        exp.id,
        exp.isActive ? null : getTotalPeriod(exp.period),
      ]),
    );
    expect(totals).toEqual({
      kidaristudio: null,
      freelancer: "9개월",
      dot: "2년 1개월",
      innodale: "3년 7개월",
    });
  });
});
