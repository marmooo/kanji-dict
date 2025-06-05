mkdir -p docs
deno task grade-html
deno task onkun-html
deno task radical-html
deno task strokes-html
deno task unicode-html
cp -r src/* docs
deno run -A ~/workspace/drop-inline-css/cli.js -d src/小1/一/index.html > inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -r src -o docs -c inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -d src/部首/一部/index.html > inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -r src/部首 -o docs/部首 -c inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -d src/画数/1画/index.html > inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -r src/画数 -o docs/画数 -c inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -d src/unicode/URO1/index.html > inline.css
deno run -A ~/workspace/drop-inline-css/cli.js -r src/unicode -o docs/unicode -c inline.css
deno run -A ~/workspace/drop-inline-css/cli.js src/index.html -o docs/index.html
deno run -A ~/workspace/drop-inline-css/cli.js src/glyph/index.html -o docs/glyph/index.html
rm inline.css
deno run -A bundle.js ./src/index.js > docs/index.js
minify -r docs -o .
