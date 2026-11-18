# 다이어그램

- 원본은 `diagrams/<덩어리 id>.drawio`이고, 사이트와 PDF는 이를 구운 `public/diagrams/<id>.svg`를 쓴다. 구운 SVG는 글자가 도형이라 어느 기기에서나 같게 그려진다.
- 모든 칸의 style에 `fontFamily=Noto Sans KR;`을 적는다. 없으면 굽기가 칸 id와 함께 멈춘다. Noto Sans KR에 없는 글자(예: `⋮`)는 있는 글자(`︙`)로 바꾼다.
- 줄바꿈은 `<br>`로 직접 정하고, 칸 폭은 글자보다 여유 있게 둔다.
- 원본을 고치면 `pnpm diagrams`로 굽고, 구운 그림을 눈으로 확인한 뒤 원본과 함께 커밋한다. 굽지 않으면 `pnpm test`가 실패한다.
- 굽기는 이 맥에서만 된다(draw.io 명령줄 도구, poppler의 `pdftocairo`, 설치된 Noto Sans KR 필요). CI는 굽지 않는다.
