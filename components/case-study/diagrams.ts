import type { DiagramId } from "@/app/types/project";

// 크기는 적지 않는다. 빌드 시 SVG 파일에서 읽는다(getPublicImageSize). 다시 내보내도 어긋나지 않게 하기 위함이다.
export interface DiagramAsset {
  src: string;
  alt: string;
}

// 원본은 draw.io로 다시 열어 편집할 수 있는 SVG다(public/diagrams). 사이트에 다크 모드가 없어
// `--theme light`로 내보내 색을 라이트로 고정했고, 그래서 흰 배경에 둔다.
// CLI는 라벨마다 foreignObject 미지원 뷰어용 PNG 폴백(<switch> 안의 base64 <image>)을 넣어 파일이 수백 KB가 된다.
// 브라우저는 foreignObject를 그리므로 내보낸 뒤 그 <image>를 지운다.
export const DIAGRAMS: Record<DiagramId, DiagramAsset> = {
  "bff-auth-flow": {
    src: "/diagrams/bff-auth-flow.drawio.svg",
    alt: "브라우저는 암호화 세션 쿠키만 갖고 BFF가 토큰으로 백엔드를 호출하며, 만료 임박 시 동시 요청의 refresh를 같은 모듈 안에서 합치는 인증 시퀀스 다이어그램",
  },
  "blue-green-deploy": {
    src: "/diagrams/blue-green-deploy.drawio.svg",
    alt: "브라우저 요청을 EC2 안의 Nginx map이 배포 ID로 나눠, 새로 연 탭은 활성 슬롯, 배포 전에 열어 둔 탭은 30분 유지되는 이전 슬롯으로 보내고, 만료된 배포 ID에는 410을 반환해 브라우저가 폼 수정 여부에 따라 새로고침하거나 모달로 안내한 뒤 입력을 복원하는 구조도. 아래에는 이미지 pull, 헬스체크, nginx 설정 검사를 통과해야 전환하고 실패하면 기존 버전을 유지하며, 전환 후 30분이 지나거나 재배포하면 만료 처리 후 SIGTERM으로 종료하는 배포 순서",
  },
  "msw-mock-switch": {
    src: "/diagrams/msw-mock-switch.drawio.svg",
    alt: "개발 환경에서 Next.js 서버의 fetch를 MSW setupServer가 가로채 핸들러가 있으면 mock 리졸버가, 없으면 실 백엔드 API가 응답하는 흐름과, 운영·스테이징 빌드에서 NEXT_PUBLIC_USE_MOCK=false로 mock 코드를 제거하는 구조도",
  },
  "settlement-domain-config": {
    src: "/diagrams/settlement-domain-config.drawio.svg",
    alt: "기존 봄툰KR과 추가된 소설유통·부가판권 세 정산 유형이 현재 유형 키로 목록·업로드·메일 설정을 조회하는 구조도. 목록 화면은 설정대로 탭을 구성하고 탭 표시 방식(viewType)에 따라 표 또는 내역서로 보여 주며, 업로드 화면은 시트별 데이터 매핑을, 메일 발송 화면은 입력 항목을 설정대로 구성한다. 화면 코드에는 유형 이름 분기가 없고, 세 설정 모두 satisfies로 모든 유형 키를 검사해 설정이 빠지면 타입 체크에서 오류가 난다",
  },
  "s3-cache-policy": {
    src: "/diagrams/s3-cache-policy.drawio.svg",
    alt: "변경 전에는 S3의 모든 파일에 Cache-Control이 없어 CloudFront를 무효화해도 브라우저가 이전 버전의 index.html을 재검증 없이 사용했고, 변경 후에는 assets/* 해시 파일을 1년 immutable로 먼저 올리고 index.html 등 나머지를 no-cache로 올린다. 브라우저는 index.html을 요청할 때 저장한 ETag를 If-None-Match로 보내 그대로면 본문 없는 304를, 바뀌었으면 200과 새 ETag를 받는 흐름 비교도",
  },
  "e2e-regression-baseline": {
    src: "/diagrams/e2e-regression-baseline.drawio.svg",
    alt: "왼쪽은 기준선 고정 단계로, 326가지 조합의 현재 동작을 결함도 고치지 않고 E2E 기준선으로 고정한다. 오른쪽은 AI 코딩 에이전트로 구현하고 단계마다 같은 E2E를 다시 통과해야 다음 단계로 넘어가는 순서로, 화면에서 도달할 수 없던 일괄등록 코드 제거, ① 두 화면의 규칙을 순수 함수 모듈 1곳으로 통합(화면별 분기 유지), ② 그리드 설정을 공유 composable로 통일, ③ 조건별 표시 규칙을 선언형으로 전환, ④ 단계·영역별 컴포넌트로 분리한다. 아래에는 정산 규칙 정의가 2곳에서 1곳으로 줄었고 네 단계 후에도 같은 E2E를 통과했으며, 백엔드 mock 기반 화면 검증이라 CI에서 상시 실행되지 않는다고 적었다",
  },
  "ai-agent-guardrails": {
    src: "/diagrams/ai-agent-guardrails.drawio.svg",
    alt: "AI 에이전트의 판단을 구현 전에 확인하는 두 단계 흐름도. ① 맥락: 업무 매뉴얼·용어를 정리한 업무 위키와 세션마다 결정·원인 조사를 남긴 작업 위키에서 에이전트가 업무 규칙과 이전 결정을 먼저 확인한다. ② 명세(SDD): 명세를 구현 전에 작성해 에이전트의 해석을 먼저 드러내고 정책 판단 항목은 에이전트가 골라 질문하며, 기능을 없애거나 막는 항목은 업무 위키에서 근거를 찾은 뒤에만 구현해 근거 없는 기능 제거를 구현 전에 폐기했다. 맨 아래 상자에서 작업 위키로 돌아가는 화살표는 세션마다 결정·원인 조사를 기록해 다음 세션의 맥락으로 쓰는 순환을 보여 준다",
  },
  "vite-rolldown-chunks": {
    src: "/diagrams/vite-rolldown-chunks.drawio.svg",
    alt: "변경 전 Vite 5는 개발에 esbuild, 빌드에 Rollup을 써서 CI 운영 빌드가 약 145초 걸렸고, Vuetify 등 라이브러리는 앱 진입 코드와 함께 640KiB 진입 청크에, RealGrid는 앱 컴포넌트와 함께 1,879KiB 공통 청크에 묶여 있었다. 변경 후 Vite 8은 Rolldown으로 번들러를 통합하고 realgrid·vuetify·vendor·앱 코드 청크로 분리했으며, CJS 라이브러리를 ESM 버전으로 바꾸고 미사용 코드를 지워 CI 운영 빌드 약 35초, JS·CSS 전체 6,398KiB에서 5,066KiB(약 21% 감소)가 된 비교도",
  },
  "content-form-unify": {
    src: "/diagrams/content-form-unify.drawio.svg",
    alt: "변경 전에는 계약등록, 콘텐츠 등록·변경, 영상 등록·변경 5개 화면이 각자 콘텐츠 입력 폼 사본을 갖고 필수값과 검증 규칙이 제각각이었고, 변경 후에는 5개 화면이 공통 콘텐츠 입력 컴포넌트 하나를 쓰고 그룹콘텐츠 중복 검사는 공통 composable로 분리해 기준이 5곳에서 1곳으로 줄어든 비교도",
  },
  "design-token-pipeline": {
    src: "/diagrams/design-token-pipeline.drawio.svg",
    alt: "Figma 변수의 용도 토큰 133개(배경·테두리·글자·아이콘)가 기본 팔레트 82개를 참조하고, 이 참조를 살려 내보낸 토큰 JSON을 값을 고치는 유일한 원본으로 둔 생성 구조도. Style Dictionary가 참조를 실제 값으로 풀어 컴포넌트 스타일 16개 중 13개가 참조하는 SCSS 변수와 패키지 진입점에서 export하는 JS 상수·TS 타입을 만들고, CI가 Storybook 빌드 전에 매번 생성하며 생성물은 커밋하지 않는다. 아래에는 Brand/600 하나만 바꿔 다시 생성하자 이 색을 참조하는 배경·테두리·글자·아이콘 변수 4개가 함께 바뀌었고, Toast·AlertDialog와 Form·Button 일부는 아직 값을 직접 쓴다고 적었다",
  },
  "nextauth-token-refresh": {
    src: "/diagrams/nextauth-token-refresh.drawio.svg",
    alt: "브라우저가 세션을 조회할 때마다 Next.js 서버의 NextAuth.js jwt 콜백이 암호화 세션 쿠키에 담긴 액세스 토큰의 만료 시각(exp)을 확인하는 시퀀스 다이어그램. 만료 전이면 기존 토큰을 그대로 돌려주고, 만료 후면 리프레시 토큰으로 OIDC 인증 서버의 토큰 엔드포인트에 새 토큰을 요청한다. 새 리프레시 토큰이 오면 바꾸고(회전) 오지 않으면 기존 것을 유지한 뒤, 새 토큰을 담은 세션 쿠키를 Set-Cookie로 내려보낸다",
  },
  "ckeditor-virtual-scroll": {
    src: "/diagrams/ckeditor-virtual-scroll.drawio.svg",
    alt: "왼쪽 변경 전에는 CKEditor 편집 화면이 화면 밖 문단까지 모든 문단을 실제 내용으로 DOM에 올려 스크롤하면 멈췄다. 오른쪽 변경 후에는 원본 문단 배열과 편집 화면 문단이 같은 순번으로 1:1 대응하고, 화면 위아래로 화면 높이 10배인 관찰 범위 안의 문단만 실제 내용이며, 범위 밖 문단은 그 높이만큼의 빈 문단, 범위에 들어온 적 없는 문단은 24px 빈 문단이다. ① 처음 열 때 앞 10개 문단만 실제 내용으로 넣고 나머지는 24px 빈 문단을 100개씩 묶어 넣고, ② IntersectionObserver 범위에 들어오면 원본 내용으로, 벗어나면 그 높이만큼의 빈 문단으로 교체하며 콜백 한 번의 교체는 model.change 한 번으로 반영하고, ③ 편집으로 문단이 늘거나 줄면 원본 배열의 같은 위치에도 반영한다. 아래에는 실제 내용으로 그리는 문단이 문서 전체에서 화면 근처로 줄고 스크롤 멈춤이 체감 약 20초에서 1초 안팎으로 줄었다고 적었다",
  },
  "a11y-export-check": {
    src: "/diagrams/a11y-export-check.drawio.svg",
    alt: "세 부분으로 된 흐름도. 위는 내보내기 전 검사로, 내보내기를 누르면 검사 중 버튼을 잠근 채 접근성 검사를 하고, 오류가 없으면 내보내며, 오류가 있으면 오류 목록에서 오류마다 빠른 수정이나 무시를 고르거나 모두 무시하고 내보내기를 골라 모두 처리한 뒤 내보낸다. 검사 규칙은 이미지 대체 텍스트(빈 값 포함), 제목 문단 유무, 글자·배경 명도 대비 4.5:1(WCAG AA), 링크 텍스트·URL, 이미지의 촉각 그래픽 데이터다. 가운데 왼쪽 변경 전은 에디터 문서를 검사해 화면 근처의 실제 내용 문단만 검사되고 화면 밖 빈 문단은 검사할 내용이 없어 가상 스크롤 뒤 화면 밖 오류를 찾지 못한다. 가운데 오른쪽 변경 후는 에디터 현재 내용을 원본 문단 배열에 반영하고 배열 전체를 이어 붙인 HTML을 DOMParser로 파싱해 같은 규칙으로 검사하며, 화면 밖 DOM은 스크롤할 때마다 다시 만들어지므로 오류 위치를 DOM 참조 대신 자식 순번 경로(예: [42, 0, 1])로 저장한다. 아래는 오류로 이동하는 순서로, 오류가 있는 문단으로 스크롤하고 빈 문단이 실제 내용이 될 때까지 최대 2초 기다린 뒤 순번 경로로 요소를 찾아 강조하고, 대체 텍스트 입력·링크 수정으로 빠른 수정한 내용을 원본 배열에 반영하며 순번이 밀리면 남은 오류 경로를 다시 계산한다",
  },
  "fabric-group-batch-add": {
    src: "/diagrams/fabric-group-batch-add.drawio.svg",
    alt: "위에는 올가미로 고른 핀 n개의 복제본을 Fabric.js 그룹에 넣는데, group.add()를 부를 때마다 기본 레이아웃(FitContentLayout)이 그룹 안 모든 객체의 위치·크기를 다시 계산한다고 적었다. 왼쪽 변경 전은 반복문에서 핀마다 add(pin)을 불러 add 1번째에 1개, 2번째에 2개, 5번째에 5개를 다시 계산하는 계단 모양이고, 합계 1+2+…+n = n(n+1)/2로 O(n²)이며 핀 2,400개면 약 288만 번이고 끝날 때까지 메인 스레드를 붙잡아 화면이 멈췄다. 오른쪽 변경 후는 복제본 배열을 먼저 만든 뒤 add(...pins)로 한 번에 넣어 5개를 한 번만 다시 계산하고, 합계 n으로 O(n)이며 핀 2,400개면 2,400번이라 멈추지 않는다. 막대는 핀 5개 예시이고, 아래에는 288만 번이 코드 구조로 계산한 최대값(잰 값 아님)이며 잘라내기·이동과 올가미 영역 표시도 같은 방식으로 바꿨다고 적었다",
  },
  "chromatic-visual-test": {
    src: "/diagrams/chromatic-visual-test.drawio.svg",
    alt: "develop·main 브랜치에 push하거나 PR을 열면 GitHub Actions가 토큰을 생성하고 상태별 스토리 47개로 Storybook을 빌드해 Chromatic에 올리고, Chromatic이 스토리마다 화면을 캡처해 이전 빌드에서 승인된 기준 화면과 비교해 달라진 화면이 없으면 통과, 있으면 승인 시 새 기준이 되고 거부 시 기준을 유지하는 흐름도. 아래에는 37번째 빌드에서 컴포넌트 16개·스토리 47개를 비교해 달라진 화면이 0건이었고, 접근성 검사는 위반을 표시만 한다고 적었다",
  },
};
