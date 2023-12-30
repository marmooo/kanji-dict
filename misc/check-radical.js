import { JKAT, Kanji, Unicode1Radical } from "@marmooo/kanji";

// perfect quality
function bmp3(codeDB) {
  const dict = {};
  Unicode1Radical.forEach((list, grade) => {
    for (const kanji of list) {
      if (kanji in codeDB.dict === false) continue;
      dict[kanji] = radicalGroups[grade] + "部";
    }
  });
  return dict;
}

function initComponentDB() {
  const dict = {};
  const csv = Deno.readTextFileSync("radicals.csv");
  csv.trimEnd().split("\n").forEach((line) => {
    const [component, componentYomi, element, yomi, position] = line.split(",");
    dict[element] = component;
    const info = { component, componentYomi, element, yomi };
    if (component in dict === false) {
      dict[component] = {};
    }
    dict[component][position] = info;
  });
  return dict;
}

// https://github.com/KanjiVG/kanjivg
// good quality
function kanjivg(codeDB) {
  const dict = {};
  const text = Deno.readTextFileSync("kanjivg-radicals.csv");
  const lines = text.trim().split("\n");
  for (const line of lines) {
    const arr = line.split(",");
    const kanji = arr[0];
    const component = arr[1];
    if (kanji in codeDB.dict === false) continue;
    dict[kanji] = component;
  }
  return dict;
}

// http://ja.linkdata.org/work/rdf1s3597i/Joyo_Kanji.html
// good quality
function joyoKanji(codeDB) {
  const dict = {};
  const text = Deno.readTextFileSync("Joyo_Kanji.txt");
  const lines = text.trim().split("\n").slice(10);
  for (const line of lines) {
    const arr = line.split("\t");
    const kanji = arr[1];
    const radical = arr[2];
    const component = componentDB[radical];
    if (kanji in codeDB.dict === false) continue;
    dict[kanji] = component;
  }
  return dict;
}

// https://mojikiban.ipa.go.jp/search/help/api
// good quality
function mojikiban(codeDB) {
  const dict = {};
  const json = Deno.readTextFileSync("mojikiban.json");
  const data = JSON.parse(json);
  for (const [_kanji, info] of Object.entries(data)) {
    const results = info[1]["results"];
    if (!results) continue;
    const newResults = results.filter((result) => {
      const compat = result["UCS"]["対応する互換漢字"];
      if (compat) {
        const code = Number("0x" + compat.slice(2));
        const compatKanji = String.fromCodePoint(code);
        const compatResult = structuredClone(result);
        if (compatKanji in data) {
          data[compatKanji][1]["results"].push(compatResult);
        } else {
          data[compatKanji] = [compatKanji, { results: [compatResult] }];
        }
        return false;
      } else {
        if (result["入管正字コード"] != "") {
          return true;
        } else {
          return false;
        }
      }
    });
    info[1]["results"] = newResults;
  }
  for (const [kanji, info] of Object.entries(data)) {
    if (kanji in codeDB.dict === false) continue;
    const results = info[1]["results"];
    if (!results) continue;
    for (const result of results) {
      const radicalId = result["部首内画数"][0]["部首"];
      const radicalGroup = radicalGroups[radicalId - 1] + "部";
      dict[kanji] = radicalGroup;
    }
  }
  return dict;
}

function checkDiff(name, dict1, dict2, showDetails = false) {
  let count = 0;
  for (const [k1, v1] of Object.entries(dict1)) {
    if (k1 in dict2) {
      const v2 = dict2[k1];
      if (v1 != v2) {
        if (showDetails) {
          console.log(`${k1}: ${v1}, ${v2}`);
        }
        count += 1;
      }
    } else {
      if (showDetails) {
        console.log(`${k1}: ${v1}, -1`);
      }
      count += 1;
    }
  }
  console.log(`diff ${name}: ${count}`);
}

const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const componentDB = initComponentDB();
const codeDB = new Kanji(JKAT.slice(0, 10));
const num = Object.keys(codeDB.dict).length;
console.log(`check ${num} kanjis:`);
const bmp3Strokes = bmp3(codeDB);
const kanjivgStrokes = kanjivg(codeDB);
const joyoKanjiStrokes = joyoKanji(codeDB);
const mojikibanStrokes = mojikiban(codeDB);
checkDiff("kanjivg", bmp3Strokes, kanjivgStrokes);
checkDiff("joyoKanji", bmp3Strokes, joyoKanjiStrokes);
checkDiff("mojikiban", bmp3Strokes, mojikibanStrokes);
