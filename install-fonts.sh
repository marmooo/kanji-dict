cd fonts
wget http://www.tarojiro.co.jp/wp-content/uploads/2015/07/syunju101.zip
unzip -O cp932 syunju101.zip
npm install otf2ttf
node_modules/.bin/otf2ttf syunju102/春秋tsu-教育漢字.otf
cd ..
