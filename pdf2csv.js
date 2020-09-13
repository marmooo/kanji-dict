const tabula = require('tabula-js');
const t = tabula('jyouyou_kanjihyou.pdf', {silent: true});
t.extractCsv((err, data) => console.log(err));
