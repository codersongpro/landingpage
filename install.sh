#!/usr/bin/env bash
# songpro-landing 스킬 설치 (macOS · Linux · Windows Git Bash)
#   ./install.sh              ~/.claude/skills/songpro-landing 에 복사
#   ./install.sh --link       복사 대신 심링크 (git pull 하면 바로 반영)
#   ./install.sh --project    현재 폴더의 .claude/skills/ 에 설치 (이 프로젝트에서만 사용)
#   ./install.sh --uninstall  설치한 스킬 삭제
set -euo pipefail

NAME="songpro-landing"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO/skills/$NAME"
DEST_ROOT="${CLAUDE_HOME:-$HOME/.claude}/skills"
MODE=copy
ACTION=install

for arg in "$@"; do
  case "$arg" in
    --link) MODE=link ;;
    --project) DEST_ROOT="$PWD/.claude/skills" ;;
    --uninstall) ACTION=uninstall ;;
    -h|--help) sed -n '2,6p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "알 수 없는 옵션: $arg (--help 참고)"; exit 1 ;;
  esac
done

DEST="$DEST_ROOT/$NAME"

if [ "$ACTION" = uninstall ]; then
  if [ -e "$DEST" ] || [ -L "$DEST" ]; then rm -rf "$DEST"; echo "삭제했습니다: $DEST"; else echo "설치돼 있지 않습니다: $DEST"; fi
  exit 0
fi

[ -f "$SRC/SKILL.md" ] || { echo "스킬 파일을 찾을 수 없습니다: $SRC"; exit 1; }
mkdir -p "$DEST_ROOT"

# 이미 설치돼 있으면 백업 후 교체
if [ -e "$DEST" ] || [ -L "$DEST" ]; then
  if [ -L "$DEST" ]; then rm "$DEST"; else
    BAK="$DEST.bak-$(date +%Y%m%d-%H%M%S)"; mv "$DEST" "$BAK"; echo "기존 설치를 백업했습니다: $BAK"
  fi
fi

if [ "$MODE" = link ]; then ln -s "$SRC" "$DEST"; else cp -R "$SRC" "$DEST"; fi
echo "설치 완료 ($MODE): $DEST"
echo "Claude Code를 새로 열고 '랜딩페이지 제작'이라고 말하면 시작합니다."

# 자동 점검 스크립트 준비 상태 안내 (설치를 막지는 않음)
if ! command -v node >/dev/null 2>&1; then
  echo "참고: 자동 점검(scripts/check_page.js)에는 Node.js 18+가 필요합니다. https://nodejs.org"
fi
