mkdir -p docs
cp -r src/* docs
minify -r docs -o .
