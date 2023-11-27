import { readLines } from "https://deno.land/std/io/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import { expandGlobSync } from "https://deno.land/std/fs/expand_glob.ts";
import { Eta } from "https://deno.land/x/eta@v3.1.1/src/index.ts";
import { ttf2svg } from "npm:@marmooo/ttf2svg@0.1.2";
import { Onkun } from "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/mod.js";
import {
  JIS4UnihanStrokes,
  JKAT,
  JoyoStrokes,
  Kanji,
} from "npm:@marmooo/kanji@0.0.2";

const dirNames = [
  "小1",
  "小2",
  "小3",
  "小4",
  "小5",
  "小6",
  "中2",
  "中3",
  "高校",
  "常用",
  "準1級",
  "1級",
];
const grades = [
  "小学1年生",
  "小学2年生",
  "小学3年生",
  "小学4年生",
  "小学5年生",
  "小学6年生",
  "中学1〜2年生",
  "中学3年生",
  "高校生",
  "常用漢字",
  "漢検準1級",
  "漢検1級",
];

function toKanjiId(str) {
  const hex = str.codePointAt(0).toString(16);
  return ("00000" + hex).slice(-5);
}

// function toKanji(kanjiId) {
//   return String.fromCodePoint(parseInt("0x" + kanjiId));
// }

function getStudyVocabs(words, grade) {
  const examples = [];
  words.forEach((word) => {
    const grades = Array.from(word).map((str) => jkat.getGrade(str));
    const difficulty = grades.filter((g) => grade <= g).length;
    if (difficulty == 1) examples.push(word);
  });
  return examples;
}

function notFoundSvg() {
  return `
<svg role="img" aria-label="未発見" xmlns="http://www.w3.org/2000/svg" fill="red" width="64" height="64" viewBox="0 0 16 16">
  <title>未発見</title>
  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
</svg>
`;
}

function getAncientSvgs(kanji) {
  return {
    "古代文字": kinbun[kanji] || notFoundSvg(),
    "隷書": reisho[kanji] || notFoundSvg(),
    "草書": sousho[kanji] || notFoundSvg(),
    "行書": gyousho[kanji] || notFoundSvg(),
  };
}

function toLinks(idioms) {
  let html = "\n";
  for (let i = 0; i < idioms.length; i++) {
    const url = "https://www.google.com/search?q=" + idioms[i] + "とは";
    html += `<a href="${url}" target="_blank" rel="noopener noreferer">${
      idioms[i]
    }</a>\n`;
  }
  return html;
}

function initRadicalDB() {
  const dict = {};
  const csv = Deno.readTextFileSync("data/radicals1.csv");
  csv.trimEnd().split("\n").forEach((line) => {
    const [kanji, component, componentYomi, name, yomi] = line.split(",");
    dict[kanji] = { component, componentYomi, name, yomi };
  });
  return dict;
}

function getStrokes(kanji, grade) {
  if (grade <= 9) {
    return joyoStrokes.getGrade(kanji);
  } else {
    return jis4UnihanStrokes.getGrade(kanji);
  }
}

function getYomis(kanji, grade) {
  const onkun = onkunDict.get(kanji);
  if (grade <= 5) {
    return onkun["小学"];
  } else if (grade <= 7) {
    const yomis = [];
    yomis.push(...onkun["小学"]);
    yomis.push(...onkun["中学"]);
    return yomis;
  } else if (grade <= 9) {
    const yomis = [];
    yomis.push(...onkun["小学"]);
    yomis.push(...onkun["中学"]);
    yomis.push(...onkun["高校"]);
    return yomis;
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
  for (const line of text.trimEnd().split("\n")) {
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
  for (const line of text.trimEnd().split("\n")) {
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

function loadSvgs(filePath) {
  const db = {};
  const options = { width: 64, height: 64 };
  const jkat = new Kanji(JKAT);
  const data = ttf2svg(filePath, undefined, options);
  for (const datum of data) {
    const code = datum.glyph.unicode;
    if (!code) continue;
    const kanji = String.fromCodePoint(datum.glyph.unicode);
    if (jkat.getGrade(kanji) < 0) continue;
    db[kanji] = datum.svg;
  }
  return db;
}

const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const joyoStrokes = new Kanji(JoyoStrokes);
const jis4UnihanStrokes = new Kanji(JIS4UnihanStrokes);
const radicalDB = initRadicalDB();
const onkunDict = new Onkun();
const gradedVocabs = initGradedVocabs();
const gradedIdioms = initGradedIdioms();
await onkunDict.fetchJoyo(
  "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/data/joyo-2017.csv",
);
await onkunDict.fetch(
  "Unihan",
  "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/data/Unihan-2023-07-15.csv",
);
const kinbun = loadSvgs("fonts/syunju102/Shunju-tsu-kyoiku.ttf");
const reisho = loadSvgs("fonts/aoyagireisyosimo_ttf_2_01.ttf");
const sousho = loadSvgs("fonts/KouzanBrushFontSousyo.ttf");
const gyousho = loadSvgs("fonts/衡山毛筆フォント行書.ttf");

for (const file of expandGlobSync("kanjivg/*.svg")) {
  const name = basename(file.path).split(".")[0];
  if (name.includes("-")) continue;
  const code = Number("0x" + name);
  const kanji = String.fromCharCode(code);
  const grade = jkat.getGrade(kanji);
  if (grade < 0) continue;

  const [on, kun] = getOnkun(kanji, grade);
  const vocabs = gradedVocabs[kanji];
  const idioms = gradedIdioms[kanji];
  const info = {};
  info["dir"] = dirNames[grade];
  info["学年"] = grades[grade];
  info["音読み"] = on;
  info["訓読み"] = kun;
  info["総画数"] = getStrokes(kanji, grade);
  info["部首"] = radicalDB[kanji];
  info["用例"] = vocabs ? [...vocabs] : [];
  info["熟語"] = idioms ? [...idioms] : [];
  const studyVocabs = getStudyVocabs(info["用例"].concat(info["熟語"]), grade);
  info["学習例"] = studyVocabs;

  const dir = "src/" + dirNames[grade];
  Deno.mkdirSync(dir, { recursive: true });
  const ancientSvgs = getAncientSvgs(kanji);
  const kanjiId = toKanjiId(kanji);
  const html = eta.render("page.eta", {
    kanji: kanji,
    kanjiId: kanjiId,
    info: info,
    ancientSvgs: ancientSvgs,
    vocabs: toLinks(info["用例"].slice(0, 10)),
    idioms: toLinks(info["熟語"].slice(0, 10)),
    studyVocabs: toLinks(info["学習例"].slice(0, 10)),
  });
  const kanjiDir = dir + "/" + kanji;
  Deno.mkdirSync(kanjiDir, { recursive: true });
  Deno.writeTextFileSync(kanjiDir + "/index.html", html);
}
