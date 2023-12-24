import { Onkun } from "onkun";
import {
  UnihanStrokes,
  JISCode,
  JKAT,
  JoyoStrokes,
  Kanji,
  Unicode,
  UnicodeChart,
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
    return unihanStrokes.getGrade(kanji);
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

const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const unicodeDB = new Kanji(Unicode);
const joyoStrokes = new Kanji(JoyoStrokes);
const unihanStrokes = new Kanji(UnihanStrokes);
const radicalDB = initRadicalDB();
const gradedVocabs = initGradedVocabs();
const gradedIdioms = initGradedIdioms();
const onkunDict = new Onkun();
await onkunDict.fetchJoyo(
  "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/data/joyo-2017.csv",
);
await onkunDict.fetch(
  "Joyo",
  "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/data/joyo-2010.csv",
);
await onkunDict.fetch(
  "Unihan",
  "https://raw.githubusercontent.com/marmooo/onkun/v0.2.6/data/Unihan-2023-07-15.csv",
);

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

const result = [];
UnicodeChart.forEach((list, i) => {
  const chart = [];
  list.forEach((kanji) => {
    const unicode = unicodeDB.getGrade(kanji);
    const jis = jisCode.getGrade(kanji);
    const grade = jkat.getGrade(kanji);
    const [on, kun] = getOnkun(kanji, grade);
    let strokes = getStrokes(kanji, grade);
    if (strokes < 0) strokes = 0;
    const vocabs = gradedVocabs[kanji];
    const idioms = gradedIdioms[kanji];
    const r = radicalDB[kanji];
    let radicalComponent = "";
    let radical = "";
    if (r) {
      // radicalComponent = `${r.component} (${r.componentYomi})`;
      radicalComponent = r.component;
      radical = `${r.name} (${r.yomi})`;
    }
    const info = {};
    info["用例"] = vocabs ? [...vocabs] : [];
    info["熟語"] = idioms ? [...idioms] : [];
    const studyVocabs = getStudyVocabs(
      info["用例"].concat(info["熟語"]),
      grade,
    );
    info["学習例"] = studyVocabs;
    const arr = [
      kanji,
      unicode + 1,
      jis + 1,
      grade + 1,
      on.join(" "),
      kun.join(" "),
      strokes,
      radicalComponent,
      radical,
      info["用例"].join(" "),
      info["熟語"].join(" "),
      info["学習例"].join(" "),
    ];
    chart.push(arr);
  });
  Deno.writeTextFileSync(
    `src/glyph/${chartNames[i]}.csv`,
    chart.map((arr) => arr.join(",")).join("\n"),
  );
  result.push(...chart);
});
Deno.writeTextFileSync(
  "kanji.csv",
  result.map((arr) => arr.join(",")).join("\n"),
);
