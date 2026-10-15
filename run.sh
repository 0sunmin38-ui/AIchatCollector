#!/usr/bin/env bash
# 정기 실행 진입점 — cron/launchd 에서 이것만 부르면 된다.
#   ./dcgall/run.sh              (= daily 잡 수집 후 리포트 재생성)
#   ./dcgall/run.sh sweep
#   ./dcgall/run.sh watch
set -euo pipefail
JOB="${1:-daily}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE="$(command -v node || echo /usr/local/bin/node)"
# 로그는 데이터 폴더(.datadir 이 가리키는 곳)에 남긴다
DATA="$("$NODE" --input-type=module -e "import { setDataDir } from '$DIR/lib/paths.mjs'; console.log(setDataDir('$DIR', null))" | tail -1)"
LOG="$DATA/run.log"
mkdir -p "$(dirname "$LOG")"

{
  echo "=== $(date '+%F %T') job=$JOB ==="
  "$NODE" "$DIR/crawl.mjs" --job "$JOB"
  "$NODE" "$DIR/mine.mjs" --n 15      # 새 은어 채굴 → glossary.json candidates
  "$NODE" "$DIR/mine.mjs" --brief     # GLOSSARY.md 갱신
  "$NODE" "$DIR/archive.mjs" --sync    # 북마크했는데 아직 안 떠온 글 보존
  "$NODE" "$DIR/archive.mjs" --verify  # 원문이 지워졌는지 확인 → 서재에 표시
  "$NODE" "$DIR/report.mjs"
  "$NODE" "$DIR/classify.mjs"
} 2>&1 | tee -a "$LOG"
