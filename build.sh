dir=docs
minify --match="\.(js|html)" -r src -o docs
cp -r src/favicon docs
