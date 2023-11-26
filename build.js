import { readLines } from "https://deno.land/std/io/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import { expandGlobSync } from "https://deno.land/std/fs/expand_glob.ts";
import { Eta } from "https://deno.land/x/eta@v3.1.1/src/index.ts";
import { ttf2svg } from "npm:@marmooo/ttf2svg@0.1.2";
import { Onkun } from "https://raw.githubusercontent.com/marmooo/onkun/v0.2.3/mod.js";
import { Kanji, JKAT, JoyoStrokes, JIS4UnihanStrokes } from "npm:@marmooo/kanji@0.0.2";

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

function getGradedVocabs(kanji, grade) {
  const filepath = "graded-vocab-ja/dist/" + grade + ".csv";
  const examples = Deno.readTextFileSync(filepath).toString().split("\n")
    .map((line) => line.split(",")[0])
    .filter((word) => word.includes(kanji));
  return examples;
}

function getGradedIdioms(kanji, grade) {
  const filepath = "graded-idioms-ja/dist/" + grade + ".csv";
  const examples = Deno.readTextFileSync(filepath).toString().split("\n")
    .map((line) => line.split(",")[0])
    .filter((word) => word.includes(kanji));
  return examples;
}

function getStudyVocabs(words, grade) {
  const examples = [];
  words.forEach((word) => {
    const grades = word.split("").map((str) => jkat.getGrade(str));
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
  const options = { width: 64, height: 64 };
  const kinbun =
    ttf2svg("fonts/syunju102/Shunju-tsu-kyoiku.ttf", kanji, options)[0].svg ||
    notFoundSvg();
  const reisho =
    ttf2svg("fonts/aoyagireisyosimo_ttf_2_01.ttf", kanji, options)[0].svg ||
    notFoundSvg();
  const sousho =
    ttf2svg("fonts/KouzanBrushFontSousyo.ttf", kanji, options)[0].svg ||
    notFoundSvg();
  const gyousho =
    ttf2svg("fonts/衡山毛筆フォント行書.ttf", kanji, options)[0].svg ||
    notFoundSvg();
  return {
    "古代文字": kinbun,
    "隷書": reisho,
    "草書": sousho,
    "行書": gyousho,
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
    return onkun["中学"];
  } else if (grade <= 9){
    return onkun["高校"];
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

const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const joyoStrokes = new Kanji(JoyoStrokes);
const jis4UnihanStrokes = new Kanji(JIS4UnihanStrokes);
const radicalDB = initRadicalDB();
const onkunDict = new Onkun();
await onkunDict.fetchJoyo("https://raw.githubusercontent.com/marmooo/onkun/v0.2.3/data/joyo-2017.csv");
await onkunDict.fetchUnihan("https://raw.githubusercontent.com/marmooo/onkun/v0.2.3/data/Unihan-2023-07-15.csv");

for (const file of expandGlobSync("kanjivg/*.svg")) {
  const name = basename(file.path).split(".")[0];
  if (name.includes("-")) continue;
  const code = Number("0x" + name);
  const kanji = String.fromCharCode(code);
  const grade = jkat.getGrade(kanji);
  if (grade < 0) continue;

  const [on, kun] = getOnkun(kanji, grade);
  const vocabs = getGradedVocabs(kanji, grade + 1);
  const idioms = getGradedIdioms(kanji, grade + 1);
  const studyVocabs = getStudyVocabs(vocabs.concat(idioms), grade);
  const info = {};
  info["dir"] = dirNames[grade];
  info["学年"] = grades[grade];
  info["音読み"] = on;
  info["訓読み"] = kun;
  info["総画数"] = getStrokes(kanji, grade);
  info["部首"] = radicalDB[kanji];
  info["用例"] = vocabs;
  info["熟語"] = idioms;
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
