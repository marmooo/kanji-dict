mkdir -p docs
cp -r src/* docs
drop-inline-css -i src/小1/一/index.html > inline.css
drop-inline-css -r src -o docs -c inline.css
drop-inline-css -i src/部首/一部/index.html > inline.css
drop-inline-css -r src/部首 -o docs/部首 -c inline.css
drop-inline-css src/index.html -o docs/index.html
rm inline.css
deno run -A bundle.js ./src/index.js > docs/index.js
minify -r docs -o .
