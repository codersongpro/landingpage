# songpro-landing · 랜딩페이지 제작 스킬

직접 만든 앱·도구, 연수·행사·공모전 소개 페이지를 프로젝트에 맞춰 만들어 주는 Claude 스킬입니다.
정해진 테마 없이 대상·분위기·실제 앱 화면을 보고 디자인과 폰트를 매번 새로 고릅니다.

- 호출어: `랜딩페이지 제작`, `/랜딩페이지 제작`
- 흐름: 인터뷰 → 디자인 고르기 → 문구 먼저 → 만들기(HTML 한 파일) → 자동 점검 → 전달

## 빠른 설치 (Claude Code, 권장)

Claude Code 안에서 두 줄을 입력합니다. 저장소를 내려받을 필요가 없습니다.

```
/plugin marketplace add codersongpro/landingpage
/plugin install songpro-landing@songpro
```

Claude Code 최신 버전이면 한 줄로도 됩니다.

```
/plugin install songpro-landing --marketplace codersongpro/landingpage
```

새 세션에서 "랜딩페이지 제작"이라고 말하면 시작합니다. 업데이트는 `/plugin marketplace update songpro`입니다.

Claude.ai 웹·데스크톱 앱, 설치 스크립트(macOS·Linux·Windows), 수동 설치는 [INSTALL.md](INSTALL.md)를 보세요.

## 자동 점검

페이지를 다 만들면 스킬이 아래 스크립트를 돌려 문제를 찾고 고칩니다. 직접 돌릴 수도 있습니다.

```bash
node skills/songpro-landing/scripts/check_page.js index.html --out check-result --links
```

| 점검 | 내용 |
|---|---|
| 반응형 | 375·768·1280px 전체 페이지 스크린샷, 가로 스크롤, 화면 밖으로 넘친 요소 |
| 폰트 | 실제로 불러온 폰트, 불러오지 못하고 시스템 폰트로 바뀐 폰트 |
| 대비 | 보이는 글자마다 WCAG AA(4.5:1, 큰 글자 3:1) 미달 여부 |
| 링크 | 빈 링크, `#`만 있는 링크, 없는 위치로 가는 앵커, (`--links`) 깨진 외부 링크 |
| 메타태그 | title, description, viewport, theme-color, og:title·description·image |

필요한 것: Node.js 18+, Playwright (`npm i -D playwright && npx playwright install chromium`)

## 폴더 구조

```
landingpage/
├── .claude-plugin/
│   ├── marketplace.json          # /plugin marketplace add 용
│   └── plugin.json               # 플러그인 정보
├── skills/songpro-landing/
│   ├── SKILL.md                  # 스킬 본문
│   ├── scripts/check_page.js     # 자동 점검
│   └── references/
│       ├── design-examples.md    # 써 본 디자인 방향 예시 3가지
│       ├── frontend-design.md    # 레이아웃·타이포 원칙
│       ├── humanize-korean.md    # AI 티 나는 한국어 문구 걷어내기
│       ├── security-check.md     # 폼·외부 API·개인정보 점검
│       ├── theme-factory.md      # 색 조합 아이디어
│       ├── theme-showcase.pdf
│       ├── themes/               # 10가지 색 테마
│       └── licenses/             # 포함 자료의 출처·라이선스
├── install.sh                    # macOS · Linux · Git Bash 설치
├── install.ps1                   # Windows PowerShell 설치
├── INSTALL.md
└── README.md
```

## 라이선스

- `SKILL.md`, `scripts/`, `references/security-check.md`, `references/design-examples.md`, 설치 스크립트: © 2026 송동석(Songpro). 허락 없이 복제·재배포할 수 없습니다.
- `references/humanize-korean.md`: epoko77-ai/im-not-ai v2.3.2 기반, MIT License
- `references/frontend-design.md`, `references/theme-factory.md`, `references/themes/`: Anthropic 예제 스킬, Apache License 2.0

자세한 내용은 [`skills/songpro-landing/references/licenses/`](skills/songpro-landing/references/licenses/)를 참고하세요.

## 만든 사람

송동석 (Songpro / Dustin)
AI Product Builder · Educator · Data Analyst
즐거움은 더하고, 불편함은 덜고.
