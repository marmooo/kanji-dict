mkdir -p docs
cp -r src/* docs
drop-inline-css -i src/小1/一/index.html > inline.css
drop-inline-css -r src -o docs -c inline.css
drop-inline-css src/index.html -o docs/index.html
rm inline.css
minify -r docs -o .
