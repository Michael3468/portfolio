#!/usr/bin/env bash
# Конвертирует исходные JPG из src/shared/assets/img в WebP.
#   X.jpg       -> X.webp          превью для /projects (не шире 600px)
#   X-big.jpg   -> X-big.webp      обложка проекта (1200px)
#   X-big.jpg   -> X-big-sm.webp   обложка проекта для srcset (800px)
# Требуется ffmpeg с libwebp. Исходные JPG не удаляются.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIRS=("$ROOT/src/shared/assets/img/projects" "$ROOT/src/shared/assets/img/testProjects")

encode() {
  local src="$1" dst="$2" width="$3"
  ffmpeg -hide_banner -loglevel error -y -i "$src" \
    -vf "scale='min(iw,${width})':-2" -c:v libwebp -quality 80 -compression_level 6 "$dst"
}

for dir in "${IMG_DIRS[@]}"; do
  for big in "$dir"/*-big.jpg; do
    base="${big%-big.jpg}"
    encode "$big" "${base}-big.webp" 1200
    encode "$big" "${base}-big-sm.webp" 800
  done
  for thumb in "$dir"/*.jpg; do
    [[ "$thumb" == *-big.jpg ]] && continue
    encode "$thumb" "${thumb%.jpg}.webp" 600
  done
done
echo "done"
