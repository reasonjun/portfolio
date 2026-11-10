const MONTH_PATTERN = /^(\d{4})\.\s*(\d{1,2})\.?$/;

// "2022. 12. ~ 2024. 12." → ["2022. 12.", "2024. 12."]. 끝이 없으면 빈 문자열이다.
export const splitPeriod = (period: string): [string, string] => {
  const [start, end = ""] = period.trim().split(/\s*~\s*/);
  return [start, end];
};

const toMonths = (date: string): number | null => {
  const match = date.match(MONTH_PATTERN);
  return match ? Number(match[1]) * 12 + Number(match[2]) : null;
};

/**
 * "2022. 12. ~ 2024. 12." 형태의 기간을 "2년 1개월"로 바꾼다.
 * 이력서와 같은 방식으로 시작한 달과 끝난 달을 모두 센다.
 * 끝이 날짜가 아니거나("재직 중") 형식이 맞지 않으면 null을 돌려준다.
 */
export const getTotalPeriod = (period: string): string | null => {
  const [start, end] = splitPeriod(period).map(toMonths);
  if (start === null || end === null) return null;

  const months = end - start + 1;
  if (months < 1) return null;

  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}개월`;
  if (rest === 0) return `${years}년`;
  return `${years}년 ${rest}개월`;
};
