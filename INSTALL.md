# 설치 가이드

| 사용 환경 | 방법 | 업데이트 |
|---|---|---|
| Claude Code | [① 플러그인 마켓플레이스](#-claude-code-플러그인-마켓플레이스-권장) (권장) | `/plugin marketplace update songpro` |
| Claude Code | [② 설치 스크립트](#-설치-스크립트) | `git pull` 후 다시 실행 (`--link`면 자동) |
| Claude.ai 웹·데스크톱 앱 | [③ zip 업로드](#-claudeai-웹데스크톱-앱) | 새 zip 다시 업로드 |
| 어디서나 | [④ 수동 복사](#-수동-복사) | 다시 복사 |

## ① Claude Code: 플러그인 마켓플레이스 (권장)

Claude Code 안에서 입력합니다.

```
/plugin marketplace add codersongpro/landingpage
/plugin install songpro-landing@songpro
```

- 설치 확인: `/plugin` → Installed 목록에 `songpro-landing`
- 업데이트: `/plugin marketplace update songpro`
- 제거: `/plugin uninstall songpro-landing@songpro`

## ② 설치 스크립트

먼저 저장소를 내려받습니다.

```bash
git clone https://github.com/codersongpro/landingpage.git
```

```bash
cd landingpage
```

**macOS · Linux · Windows Git Bash**

```bash
./install.sh
```

| 옵션 | 설명 |
|---|---|
| (없음) | `~/.claude/skills/songpro-landing`에 복사 |
| `--link` | 복사 대신 심링크. `git pull`만 하면 바로 최신 버전 |
| `--project` | 지금 있는 폴더의 `.claude/skills/`에 설치 (그 프로젝트에서만 사용) |
| `--uninstall` | 설치한 스킬 삭제 |

**Windows PowerShell**

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

옵션: `-Project` (현재 프로젝트에만 설치), `-Uninstall` (삭제)

이미 설치돼 있으면 기존 폴더를 `songpro-landing.bak-날짜시간`으로 백업한 뒤 교체합니다.

## ③ Claude.ai 웹·데스크톱 앱

1. 저장소에서 `skills/songpro-landing` 폴더를 zip으로 묶습니다. zip을 열었을 때 맨 위에 `songpro-landing/SKILL.md`가 보여야 합니다.
2. Claude.ai → 설정 → 기능(Capabilities) → 스킬 → 스킬 업로드에서 zip을 올립니다.

macOS·Linux에서 zip 만들기:

```bash
cd skills && zip -r ../songpro-landing.zip songpro-landing
```

Windows PowerShell:

```powershell
Compress-Archive -Path skills\songpro-landing -DestinationPath songpro-landing.zip
```

Claude.ai 앱에서는 자동 점검 스크립트 대신 Claude가 브라우저로 직접 확인합니다.

## ④ 수동 복사

`skills/songpro-landing` 폴더를 통째로 아래 위치에 복사합니다.

- 모든 프로젝트에서 사용: `~/.claude/skills/` (Windows: `C:\Users\사용자이름\.claude\skills\`)
- 한 프로젝트에서만 사용: `프로젝트폴더/.claude/skills/`

## 자동 점검 준비 (선택)

`scripts/check_page.js`를 쓰려면 Node.js 18 이상과 Playwright가 필요합니다. 없어도 스킬은 동작하고, 점검만 손으로 합니다.

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```
