mkdir -p docs
deno task grade-html
deno task onkun-html
deno task radical-html
deno task strokes-html
deno task unicode-html
cp -r src/* docs
drop-inline-css -d src/小1/一/index.html > inline.css
drop-inline-css -r src -o docs -c inline.css
drop-inline-css -d src/部首/一部/index.html > inline.css
drop-inline-css -r src/部首 -o docs/部首 -c inline.css
drop-inline-css -d src/画数/1画/index.html > inline.css
drop-inline-css -r src/画数 -o docs/画数 -c inline.css
drop-inline-css -d src/音訓/あ/index.html > inline.css
drop-inline-css -r src/音訓 -o docs/音訓 -c inline.css
drop-inline-css -d src/unicode/URO1/index.html > inline.css
drop-inline-css -r src/unicode -o docs/unicode -c inline.css
drop-inline-css src/index.html -o docs/index.html
drop-inline-css src/glyph/index.html -o docs/glyph/index.html
rm inline.css
deno run -A bundle.js ./src/index.js > docs/index.js
minify -r docs -o .
