// 사례가 있는 프로젝트를 어느 화면에 어떤 순서로 싣는지 정한다. 사례 내용은 data/projects.ts에 둔다.
// 두 목록은 서로 독립이다. 지금 순서가 겹치더라도 하나로 합치지 않는다. 합치면 홈 대표 프로젝트를 바꿀 때 PDF도 따라 바뀐다.

// 홈 '대표 프로젝트' 카드. 임팩트순.
export const HOME_PROJECT_IDS = [
  "enterprise-legal-management",
  "ip-management-system",
  "external-settlement-system",
  "wysiwyg-editor",
  "tactile-graphics-editor",
  "design-system",
];

// 이력서와 함께 내는 PDF. 적힌 그대로 이 순서로 인쇄한다.
// 빈칸 없이 다 쓴 사례만 넣는다. 다 쓴 사례를 PDF에 싣지 않으려면 lib/data.test.ts의 웹 전용 목록에 적는다.
export const PDF_PROJECT_IDS = [
  "enterprise-legal-management",
  "ip-management-system",
  "external-settlement-system",
  "design-system",
  "wysiwyg-editor",
  "tactile-graphics-editor",
];
