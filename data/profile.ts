export const PROFILE = {
  name: "이성준",
  role: "프런트엔드 개발자",
  positioning: [
    "복잡한 업무 화면을 설계하고,",
    "테스트와 무중단 배포까지 책임집니다.",
  ],
  // 초안: 20s → 1s(WYSIWYG)는 해당 프로젝트의 결과로 두고, Hero 수치는 인터뷰에서 확정한다.
  metrics: [
    { value: "11.6s → 2.77s", label: "로컬 빌드" },
    { value: "326", label: "E2E 정산 조합" },
    { value: "60s → 1s", label: "초기 로딩 (닷 사내 웹 서비스)" },
  ],
  pipeline: ["설계", "구현", "테스트", "배포"],
  githubUrl: "https://github.com/reasonjun",
  email: "xmaseve96@naver.com",
  // 원격 저장소(reasonjun/portfolio)와 basePath(/portfolio)로 추정한 GitHub Pages 주소
  siteUrl: "https://reasonjun.github.io/portfolio/",
};
