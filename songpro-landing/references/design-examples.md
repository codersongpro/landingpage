# 디자인 예시 세 가지

고정 테마가 아니다. 실제로 써 본 디자인 방향의 예시이고, 색 변수 이름·섹션 흐름·장치를 빌려 쓸 수 있다. 그대로 복사하지 말고 프로젝트에 맞게 바꾼다.

## 예시 1. 클린 블루

성격: 밝고 군더더기 없음. 실무 도구가 한눈에 들어오게.

```css
:root{
  --bg:#F8FAFC; --surface:#FFFFFF; --soft:#EFF6FF;
  --text:#1E293B; --text-2:#475569; --text-3:#64748B; --line:#E2E8F0;
  --accent:#2563EB; --accent-d:#1D4ED8; --accent-l:#BAE6FD;
  --dark:#1E293B; --yellow:#FACC15; --red:#EF4444; --green:#34D399;
  --max:1120px; --radius:20px;
  --shadow-btn:0 10px 24px -10px rgba(37,99,235,.7);
  --shadow-shot:0 30px 60px -20px rgba(15,23,42,.45);
}
```
- 폰트: Pretendard Variable (dynamic subset). h1 700, 자간 -0.03em. 포인트 폰트 없이도 완성되는 테마
- 섹션 여백 96px, 히어로 72px 0 88px. 배경은 흰색, --bg, --soft를 번갈아 쓰고 마지막 CTA만 --dark
- 모서리: 카드 16~20px, 작은 요소 8px, 버튼 999px
- 흐름: 상단 바 → 히어로(파란 머리글, 두 줄 h1, 버튼 2개, 앱 목업) → 쓰는 장면 3개 → 기능 카드 4개 → 단축키·사용법 → 시작하기 → FAQ → 마지막 CTA → 푸터

## 예시 2. 웜 스톤

성격: 따뜻한 회색 톤, 굵은 제목, 믿고 설치하는 업무 앱 느낌.

```css
:root{
  --bg:#FAF9F7; --surface:#FFFFFF; --line:#EDE8E1;
  --text:#1C1917; --text-2:#44403C; --text-3:#78716C; --text-4:#A8A29E;
  --accent:#D97706; --accent-btn:#F59E0B; --accent-bg:#FEF3C7;
  --dark:#171210;
  --violet:#7C3AED; --violet-bg:#EDE9FE; --blue:#2563EB; --blue-bg:#DBEAFE;
  --emerald:#059669; --emerald-bg:#D1FAE5; --teal:#0D9488; --teal-bg:#CCFBF1;
  --max:1120px; --radius:18px;
  --shadow:0 1px 2px rgba(28,25,23,.04),0 8px 24px rgba(28,25,23,.06);
  --shadow-btn:0 6px 16px rgba(245,158,11,.28);
}
```
- 폰트: Pretendard Variable 기본. h1·h2 900, h3 800, 본문 400. 본문은 --text-3로 차분하게. 제목에 SUIT 등 단단한 고딕을 더해도 어울림
- 섹션 여백 72px. 상단 바는 반투명 배경(rgba(250,249,247,.88)) + blur
- 기능 카드마다 violet·blue·emerald·teal 중 하나를 연한 배경 태그로 붙여 구분
- 버전 배지(NEW v1.x), 누적 다운로드 수, 지원 환경 칩(Windows 10/11, 설치 없이 실행)
- 선택: 맨 위 어두운(--dark) 인트로 구간에서 스크롤에 맞춰 실제 화면 데모가 바뀜. 소리가 있으면 '소리 끄기' 토글
- 다크 모드 토글. 각 색에 -bg-dark(투명도 .18) 값을 둔다
- 흐름: 인트로 → 히어로(다운로드·웹에서 쓰기 버튼) → 새 기능 → 주요 기능 → 화면으로 보기 → 다운로드 → 영상 가이드 → 만든 사람 → 푸터

## 예시 3. 터미널 네온

성격: 어두운 배경에 네온, 코드 짜는 사람의 작업실.

```css
:root{
  --bg:#07080D; --bg-2:#0C0E16; --panel:rgba(255,255,255,.035); --line:rgba(255,255,255,.09);
  --text:#E8EAF2; --muted:#9AA0B4; --dim:#5D6378;
  --accent:#3CF2C4; --accent-2:#7A6BFF; --accent-3:#FF5EA8;
  --sans:"Pretendard Variable",Pretendard,system-ui,-apple-system,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,monospace;
  --display:"Space Grotesk",var(--sans);
  --gutter:clamp(16px,4vw,40px); --radius:16px;
  --glow:0 4px 14px -4px rgba(60,242,196,.6);
}
```
- 폰트: 한글 Pretendard Variable 기본, 라벨·주석·프롬프트는 JetBrains Mono, 영문 큰 제목은 Space Grotesk (Google Fonts에서 불러옴)
- 섹션 여백 80px. 패널은 반투명 흰색 + 1px 선. 짝수 섹션(--bg-2)으로 리듬
- 장치: 흐르는 영문 띠(marquee), `user@life:~$ whoami` 같은 프롬프트, 타이핑 효과, `// 섹션 이름` 주석형 머리글, `01 02 03` 번호, 네온 글로우 버튼
- 모서리: 태그 6px, 카드 12~16px, 칩 999px
- 흐름: 상단 바 → 히어로(프롬프트+이름+역할 타이핑) → 철학 → 스택 → 지금 만드는 것 → 결과물 → 방명록·FAQ → 문의 → 푸터

