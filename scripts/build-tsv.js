import { Onkun } from "onkun";
import {
  JISCode,
  JKAT,
  JoyoStrokes,
  Kanji,
  Unicode,
  UnicodeChart,
  UnicodeRadical,
  UnicodeStrokes,
} from "@marmooo/kanji";

function getStudyVocabs(words, grade) {
  const examples = [];
  words.forEach((word) => {
    const grades = Array.from(word).map((str) => jkat.getGrade(str));
    const difficulty = grades.filter((g) => grade <= g).length;
    if (difficulty == 1) examples.push(word);
  });
  return examples;
}

function initRadicalDB() {
  const radicals = Array.from(
    "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
  );
  const dict = {};
  const csv = Deno.readTextFileSync("data/radicals1.csv");
  csv.split("\n").forEach((line) => {
    const [kanji, component, componentYomi, name, yomi] = line.split(",");
    dict[kanji] = { component, componentYomi, name, yomi };
  });
  const componentYomi = "";
  const name = "";
  const yomi = "";
  UnicodeRadical.forEach((list, radicalId) => {
    list.forEach((kanji) => {
      if (kanji in dict === false) {
        const component = radicals[radicalId] + "部";
        dict[kanji] = { component, componentYomi, name, yomi };
      }
    });
  });
  return dict;
}

function initIDSDB() {
  const dict = {};
  const csv = Deno.readTextFileSync("data/ids.csv");
  csv.split("\n").forEach((line) => {
    const [kanji, idsList] = line.split(",");
    dict[kanji] = idsList;
  });
  return dict;
}

function initUnihanDB() {
  const dict = {};
  const tsv = Deno.readTextFileSync("data/unihan.tsv");
  tsv.split("\n").forEach((line) => {
    const arr = line.split("\t");
    const kanji = arr[0];
    const unihanList = arr.slice(1);
    dict[kanji] = unihanList;
  });
  return dict;
}

function getStrokes(kanji, grade) {
  if (0 <= grade && grade <= 9) {
    const strokes = joyoStrokes.dict[kanji];
    if (!strokes) return "";
    return strokes.join(" ");
  } else {
    const strokes = unicodeStrokes.dict[kanji];
    if (!strokes) return "";
    return strokes.join(" ");
  }
}

function getYomis(kanji, grade) {
  const onkun = onkunDict.get(kanji);
  if (0 <= grade && grade <= 9) {
    return onkun["Joyo"];
    // if (grade <= 5) {
    //   return onkun["小学"];
    // } else if (grade <= 7) {
    //   const yomis = [];
    //   yomis.push(...onkun["小学"]);
    //   yomis.push(...onkun["中学"]);
    //   return yomis;
    // } else if (grade <= 9) {
    //   const yomis = [];
    //   yomis.push(...onkun["小学"]);
    //   yomis.push(...onkun["中学"]);
    //   yomis.push(...onkun["高校"]);
    //   return yomis;
  } else if (onkun) {
    return onkun["Unihan"];
  } else {
    console.log(`warning: ${kanji} onkun is undefined`);
    return [];
  }
}

function getOnkun(kanji, grade) {
  const on = [];
  const kun = [];
  const yomis = getYomis(kanji, grade);
  if (!yomis) return [[""], [""]];
  yomis.forEach((yomi) => {
    if (/[ァ-ヶ]/.test(yomi)) {
      on.push(yomi);
    } else {
      kun.push(yomi);
    }
  });
  return [on, kun];
}

function initGradedVocabs() {
  const db = {};
  const kanjiRegexp = /[\u3400-\u9FFF\uF900-\uFAFF\u{20000}-\u{2FFFF}]/u;
  const filepath = "graded-vocab-ja/dist/all.csv";
  const text = Deno.readTextFileSync(filepath);
  for (const line of text.split("\n")) {
    const word = line.split(",")[0];
    if (word.includes("々")) continue;
    const kanjis = Array.from(word).filter((char) => kanjiRegexp.test(char));
    const wordGrades = kanjis.map((kanji) => jkat.getGrade(kanji));
    if (wordGrades.includes(-1)) continue;
    const wordGrade = Math.max(...wordGrades);
    for (const char of kanjis) {
      const charGrade = jkat.getGrade(char);
      if (charGrade < 0) continue;
      if (charGrade != wordGrade) continue;
      if (char in db) {
        db[char].add(word);
      } else {
        db[char] = new Set([word]);
      }
    }
  }
  return db;
}

function initGradedIdioms() {
  const db = {};
  const kanjiRegexp = /[\u3400-\u9FFF\uF900-\uFAFF\u{20000}-\u{2FFFF}]/u;
  const filepath = "graded-idioms-ja/dist/all.csv";
  const text = Deno.readTextFileSync(filepath);
  for (const line of text.split("\n")) {
    const word = line.split(",")[0];
    if (word.includes("々")) continue;
    const kanjis = Array.from(word).filter((char) => kanjiRegexp.test(char));
    const wordGrades = kanjis.map((kanji) => jkat.getGrade(kanji));
    if (wordGrades.includes(-1)) continue;
    const wordGrade = Math.max(...wordGrades);
    for (const char of kanjis) {
      const charGrade = jkat.getGrade(char);
      if (charGrade < 0) continue;
      if (charGrade != wordGrade) continue;
      if (char in db) {
        db[char].add(word);
      } else {
        db[char] = new Set([word]);
      }
    }
  }
  return db;
}

const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const unicodeDB = new Kanji(Unicode);
const joyoStrokes = new Kanji(JoyoStrokes);
const unicodeRadical = new Kanji(UnicodeRadical);
const unicodeStrokes = new Kanji(UnicodeStrokes);
const radicalDB = initRadicalDB();
const idsDB = initIDSDB();
const unihanDB = initUnihanDB();
const gradedVocabs = initGradedVocabs();
const gradedIdioms = initGradedIdioms();
const onkunDict = new Onkun();
await onkunDict.loadJoyo("onkun/data/joyo-2017.csv");
await onkunDict.load("Joyo", "onkun/data/joyo-2010.csv");
await onkunDict.load("Unihan", "onkun/data/Unihan-2024-07-31.csv");

const chartNames = [
  "URO1",
  "URO2",
  "URO3",
  "URO4",
  "CI",
  "CIS",
  "ExtA",
  "ExtB1",
  "ExtB2",
  "ExtB3",
  "ExtB4",
  "ExtB5",
  "ExtB6",
  "ExtB7",
  "ExtC",
  "ExtD",
  "ExtE",
  "ExtF",
  "ExtG",
  "ExtH",
  "ExtI",
];

function getRadicals(kanji) {
  const radicals = unicodeRadical.dict[kanji];
  if (kanji === "𱶿") console.log("zzz", radicals);
  if (!radicals) return "";
  return radicals.join(" ");
}

function getRadicalName(kanji) {
  if (kanji in radicalDB) {
    const r = radicalDB[kanji];
    if (r.name && r.yomi) {
      return `${r.name} (${r.yomi})`;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function getIDS(kanji) {
  if (kanji in idsDB) {
    return idsDB[kanji];
  } else {
    return "";
  }
}

function getUnihan(kanji) {
  if (kanji in unihanDB) {
    return unihanDB[kanji];
  } else {
    const arr = new Array(16);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = "";
    }
    return arr;
  }
}

const result = [];
UnicodeChart.forEach((list, i) => {
  const chart = [];
  list.forEach((kanji) => {
    const unicode = unicodeDB.getGrade(kanji);
    const jis = jisCode.getGrade(kanji);
    const grade = jkat.getGrade(kanji);
    const [on, kun] = getOnkun(kanji, grade);
    const vocabs = gradedVocabs[kanji];
    const idioms = gradedIdioms[kanji];
    const info = {};
    info["用例"] = vocabs ? [...vocabs] : [];
    info["熟語"] = idioms ? [...idioms] : [];
    const studyVocabs = getStudyVocabs(
      [...new Set(info["用例"].concat(info["熟語"]))],
      grade,
    );
    info["学習例"] = studyVocabs;
    const arr = [
      "U+" + kanji.codePointAt(0).toString(16).toUpperCase(),
      kanji,
      unicode + 1,
      jis + 1,
      grade + 1,
      on.join(" "),
      kun.join(" "),
      getStrokes(kanji, grade),
      getRadicals(kanji),
      getRadicalName(kanji),
      getIDS(kanji),
      ...getUnihan(kanji),
      info["用例"].join(" "),
      info["熟語"].join(" "),
      info["学習例"].join(" "),
    ];
    chart.push(arr);
  });
  Deno.writeTextFileSync(
    `src/glyph/${chartNames[i]}.tsv`,
    chart.map((arr) => arr.join("\t")).join("\n"),
  );
  result.push(...chart);
});
Deno.writeTextFileSync(
  "kanji.tsv",
  result.map((arr) => arr.join("\t")).join("\n"),
);
