const fs = require('fs');

var info = JSON.parse(fs.readFileSync('kanji-info.json', 'utf8'));
// var info = JSON.parse(fs.readFileSync('ipadic-examples.json', 'utf8'));
console.log(JSON.stringify(info['漢']));

