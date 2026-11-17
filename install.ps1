# songpro-landing 스킬 설치 (Windows PowerShell)
#   .\install.ps1              ~\.claude\skills\songpro-landing 에 복사
#   .\install.ps1 -Project     현재 폴더의 .claude\skills\ 에 설치
#   .\install.ps1 -Uninstall   설치한 스킬 삭제
# 실행이 막히면: powershell -ExecutionPolicy Bypass -File .\install.ps1
param([switch]$Project, [switch]$Uninstall)
$ErrorActionPreference = 'Stop'

$Name = 'songpro-landing'
$Src = Join-Path $PSScriptRoot "skills\$Name"
$Base = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME '.claude' }
$DestRoot = if ($Project) { Join-Path (Get-Location) '.claude\skills' } else { Join-Path $Base 'skills' }
$Dest = Join-Path $DestRoot $Name

if ($Uninstall) {
  if (Test-Path $Dest) { Remove-Item $Dest -Recurse -Force; Write-Host "삭제했습니다: $Dest" }
  else { Write-Host "설치돼 있지 않습니다: $Dest" }
  exit 0
}

if (-not (Test-Path (Join-Path $Src 'SKILL.md'))) { throw "스킬 파일을 찾을 수 없습니다: $Src" }
New-Item -ItemType Directory -Force -Path $DestRoot | Out-Null

# 이미 설치돼 있으면 백업 후 교체
if (Test-Path $Dest) {
  $Bak = "$Dest.bak-$(Get-Date -Format yyyyMMdd-HHmmss)"
  Move-Item $Dest $Bak
  Write-Host "기존 설치를 백업했습니다: $Bak"
}

Copy-Item $Src $Dest -Recurse
Write-Host "설치 완료: $Dest"
Write-Host "Claude Code를 새로 열고 '랜딩페이지 제작'이라고 말하면 시작합니다."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "참고: 자동 점검(scripts/check_page.js)에는 Node.js 18+가 필요합니다. https://nodejs.org"
}
