# songpro-landing · 랜딩페이지 제작 스킬

직접 만든 앱·도구, 연수·행사·공모전 소개 페이지를 프로젝트에 맞춰 만들어 주는 Claude 스킬입니다.
정해진 테마 없이 대상·분위기·실제 앱 화면을 보고 디자인과 폰트를 매번 새로 고릅니다.

- 호출어: `랜딩페이지 제작`, `/랜딩페이지 제작`
- 흐름: 인터뷰 → 디자인 고르기 → 문구 먼저 → 만들기(HTML 한 파일) → 375/768/1280px 확인 → 전달

## 폴더 구조

```
songpro-landing/
├── SKILL.md                    # 스킬 본문
└── references/
    ├── design-examples.md      # 써 본 디자인 방향 예시 3가지
    ├── frontend-design.md      # 레이아웃·타이포 원칙
    ├── humanize-korean.md      # AI 티 나는 한국어 문구 걷어내기
    ├── security-check.md       # 폼·외부 API·개인정보 점검
    ├── theme-factory.md        # 색 조합 아이디어
    ├── theme-showcase.pdf
    ├── themes/                 # 10가지 색 테마
    └── licenses/               # 포함 자료의 출처·라이선스
```

## 설치 방법

### Claude.ai / Claude 데스크톱 앱
1. 이 저장소에서 `songpro-landing` 폴더를 zip으로 묶습니다(또는 Releases의 zip 사용).
2. 설정 → 기능(Capabilities) → 스킬 → 스킬 업로드에서 zip을 올립니다.

### Claude Code
개인용(모든 프로젝트에서 사용):

```bash
git clone https://github.com/codersongpro/landingpage.git
```

```bash
mkdir -p ~/.claude/skills && cp -r landingpage/songpro-landing ~/.claude/skills/
```

특정 프로젝트에서만 쓰려면 그 프로젝트의 `.claude/skills/` 아래에 복사합니다.

## 라이선스

- `SKILL.md`, `references/security-check.md`, `references/design-examples.md`: © 2026 송동석(Songpro). 허락 없이 복제·재배포할 수 없습니다.
- `references/humanize-korean.md`: epoko77-ai/im-not-ai v2.3.2 기반, MIT License
- `references/frontend-design.md`, `references/theme-factory.md`, `references/themes/`: Anthropic 예제 스킬, Apache License 2.0

자세한 내용은 [`songpro-landing/references/licenses/`](songpro-landing/references/licenses/)를 참고하세요.

## 만든 사람

송동석 (Songpro / Dustin)
AI Product Builder · Educator · Data Analyst
즐거움은 더하고, 불편함은 덜고.
