import { Eta } from "https://deno.land/x/eta@v3.1.1/src/index.ts";
import {
  JIS4UnihanStrokes,
  JKAT,
  JoyoStrokes,
  Kanji,
  Unicode1UnihanStrokes,
} from "npm:@marmooo/kanji@0.0.5";

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

function toKanjiId(str) {
  const hex = str.codePointAt(0).toString(16);
  return ("00000" + hex).slice(-5);
}

function getKanjiList(count) {
  let html = "";
  if (count < strokesThreshold) {
    html += `<div class="fs-3">`;
    for (const kanji of strokesDB[count]) {
      const kanjiId = toKanjiId(kanji);
      try {
        Deno.statSync(`kanjivg/${kanjiId}.svg`);
        const grade = jkat.getGrade(kanji);
        const url = `/kanji-dict/${dirNames[grade]}/${kanji}/`;
        html += `<a href="${url}" class="px-1">${kanji}</a>\n`;
      } catch {
        html += `<span class="px-1">${kanji}</span>`;
      }
    }
    html += "</div>";
  } else {
    for (const [n, kanjis] of Object.entries(strokesDB[strokesThreshold])) {
      html += `<h4>${n}画</4>`;
      html += `<div class="fs-3">`;
      Array.from(kanjis).forEach((kanji) => {
        const kanjiId = toKanjiId(kanji);
        try {
          Deno.statSync(`kanjivg/${kanjiId}.svg`);
          const grade = jkat.getGrade(kanji);
          const url = `/kanji-dict/${dirNames[grade]}/${kanji}/`;
          html += `<a href="${url}" class="px-1">${kanji}</a>\n`;
        } catch {
          html += `<span class="px-1">${kanji}</span>`;
        }
      });
      html += "</div>";
    }
  }
  return html;
}

function getStrokesList() {
  let html = "";
  for (let i = 1; i < strokesThreshold; i++) {
    html += `<a href="/kanji-dict/画数/${i}画/" class="px-1">${i}画</a>`;
  }
  html +=
    `<a href="/kanji-dict/画数/${strokesThreshold}画〜/" class="px-1">${strokesThreshold}画〜</a>`;
  return html;
}

function initStrokesDB() {
  const dict = {};
  const joyoStrokes = new Kanji(JoyoStrokes);
  JIS4UnihanStrokes.forEach((list, i) => {
    list.forEach((kanji) => {
      let strokes = joyoStrokes.getGrade(kanji);
      if (strokes < 0) strokes = i;
      if (strokes in dict) {
        dict[strokes] += kanji;
      } else {
        dict[strokes] = kanji;
      }
    });
  });
  const jis4UnihanStrokes = new Kanji(JIS4UnihanStrokes);
  Unicode1UnihanStrokes.forEach((list, strokes) => {
    list.forEach((kanji) => {
      if (jis4UnihanStrokes.getGrade(kanji) < 0) {
        if (strokes in dict) {
          dict[strokes] += kanji;
        } else {
          dict[strokes] = kanji;
        }
      }
    });
  });
  const manyStrokes = {};
  for (const n of Object.keys(dict).map(Number).sort()) {
    if (n >= strokesThreshold) {
      manyStrokes[n] = dict[n];
      delete dict[n];
    }
  }
  dict[strokesThreshold] = manyStrokes;
  return dict;
}

const strokesThreshold = 25;
const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const strokesDB = initStrokesDB();

for (let i = 1; i < strokesThreshold; i++) {
  const count = strokesDB[i].length;
  const strokes = `${i}画`;
  const strokesList = getStrokesList();
  const kanjiList = getKanjiList(i);
  const dir = `src/画数/${strokes}`;
  Deno.mkdirSync(dir, { recursive: true });
  const html = eta.render("strokes.eta", {
    count,
    strokes,
    strokesList,
    kanjiList,
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
}
const count = Object.values(strokesDB[strokesThreshold])
  .map((str) => str.length)
  .reduce((prev, curr) => prev + curr, 0);
const strokes = `${strokesThreshold}画以上`;
const strokesList = getStrokesList();
const kanjiList = getKanjiList(strokesThreshold);
const dir = `src/画数/${strokesThreshold}画〜`;
Deno.mkdirSync(dir, { recursive: true });
const html = eta.render("strokes.eta", {
  count,
  strokes,
  strokesList,
  kanjiList,
});
Deno.writeTextFileSync(dir + "/index.html", html);
