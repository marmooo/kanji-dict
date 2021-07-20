mkdir -p docs
cp -r src/* docs
minify -r src -o docs
