tmpSvg=$(mktemp --suffix=.svg)
inkscape src/favicon/favicon.svg \
  --export-text-to-path \
  --export-plain-svg \
  --export-filename="${tmpSvg}"
resvg -w 48 -h 48 "${tmpSvg}" src/favicon/favicon.png
rm -f "${tmpSvg}"
