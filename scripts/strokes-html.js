import { Eta } from "eta";
import {
  JISCode,
  JKAT,
  JoyoStrokes,
  Kanji,
  Unicode,
  UnicodeStrokes,
} from "@marmooo/kanji";

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
  "小1",
  "小2",
  "小3",
  "小4",
  "小5",
  "小6",
  "中1〜2",
  "中3",
  "高校",
  "常用",
  "JIS第1水準 (漢検準1級)",
  "JIS第2水準 (漢検1級)",
  "JIS第3水準",
  "JIS第4水準",
  "Unicode全漢字",
];

function getKanjiLink(kanji) {
  const grade = jkat.getGrade(kanji);
  if (0 <= grade && grade <= 9) {
    const url = `/kanji-dict/${dirNames[grade]}/${kanji}/`;
    return `<a href="${url}" class="px-1">${kanji}</a>\n`;
  } else if (jisCode.getGrade(kanji) >= 0) {
    const url = `/kanji-dict/glyph/?q=${kanji}`;
    return `<a href="${url}" class="px-1">${kanji}</a>\n`;
  } else {
    const hex = kanji.codePointAt(0).toString(16).toUpperCase();
    const url = `/kanji-dict/glyph/?q=U+${hex}`;
    return `<a href="${url}" class="px-1">${kanji}</a>\n`;
  }
}

function getGradedKanjiList(count) {
  const arr = new Array(grades.length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  Strokes[count].forEach((kanji) => {
    const grade = jkat.getGrade(kanji);
    if (0 <= grade && grade <= 9) {
      arr[grade].push(kanji);
    } else {
      const jisGrade = jisCode.getGrade(kanji);
      if (jisGrade >= 0) {
        arr[10 + jisGrade].push(kanji);
      } else {
        arr[14].push(kanji);
      }
    }
  });
  arr.forEach((list) => {
    list.sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
  });
  return arr;
}

function getKanjiPanel(graded, count) {
  const open = (count >= 30) ? "open" : "";
  const fontSize = (count >= 25) ? "fs-1" : "fs-3";
  let html = "";
  if (count < strokesThreshold) {
    const joyo = graded.slice(0, 10);
    if (joyo.flat().length > 0) {
      html += `<h4>常用漢字</h4>\n`;
      html += `<div class="${fontSize} pb-3">\n`;
      joyo.forEach((list, i) => {
        if (list.length > 0) {
          html += `<span class="badge rounded-pill bg-secondary">${
            grades[i]
          }</span>\n`;
          list.forEach((kanji) => {
            html += getKanjiLink(kanji);
          });
        }
      });
      html += "</div>\n";
    }
    graded.slice(10).forEach((list, i) => {
      if (i == 4) {
        if (list.length > 0) {
          html += `<details id="unicodeDetails" ${open}>
<summary class="h4">${grades[i + 10]}</summary>
<div class="alert alert-info">
  以下の内容は通常文字化けする漢字が多数含まれますが、Webフォントで代替表示しているため文字化けは発生しません。
</div>
<div id="unicodeList" class="${fontSize}">
`;
          list.forEach((kanji) => {
            html += getKanjiLink(kanji);
          });
          html += "</div>\n";
          html += "</details>\n";
        }
      } else {
        if (list.length > 0) {
          html += `<h4>${grades[i + 10]}</h4>\n`;
          html += `<div class="${fontSize} pb-3">`;
          list.forEach((kanji) => {
            html += getKanjiLink(kanji);
          });
          html += "</div>\n";
        }
      }
    });
  } else {
    html += `
<div class="alert alert-info">
  以下の内容は通常文字化けする漢字が多数含まれますが、Webフォントで代替表示しているため文字化けは発生しません。
</div>`;
    html += `<div id="unicodeList" class="${fontSize}">\n`;
    Strokes.slice(count).forEach((list, i) => {
      if (list.length > 0) {
        html += `<span class="badge rounded-pill bg-secondary">${
          count + i
        }画</span>\n`;
        list.forEach((kanji) => {
          html += getKanjiLink(kanji);
        });
      }
    });
    html += "</div>\n";
  }
  return html;
}

function getStrokesPanel() {
  let html = "";
  for (let i = 1; i < strokesThreshold; i++) {
    html += `<a href="/kanji-dict/画数/${i}画/" class="px-1">${i}画</a>`;
  }
  html +=
    `<a href="/kanji-dict/画数/${strokesThreshold}画〜/" class="px-1">${strokesThreshold}画〜</a>`;
  return html;
}

function initStrokes() {
  const arr = new Array(UnicodeStrokes.length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = [];
  }
  const joyoStrokes = new Kanji(JoyoStrokes);
  const unicodeStrokes = new Kanji(UnicodeStrokes);
  Unicode.forEach((list) => {
    list.forEach((kanji) => {
      const joyoGrade = joyoStrokes.getGrade(kanji);
      if (joyoGrade >= 0) {
        arr[joyoGrade].push(kanji);
      } else {
        const unicodeGrade = unicodeStrokes.getGrade(kanji);
        if (unicodeGrade >= 0) arr[unicodeGrade].push(kanji);
      }
    });
  });
  arr.forEach((list) => {
    list.sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
  });
  return arr;
}

function getFontFace(dir, from, to, i) {
  const hexFrom = from.toString(16).toUpperCase();
  const hexTo = to.toString(16).toUpperCase();
  return `
@font-face {
  font-family:jigmo;
  src:url("/kanji-dict/画数/${dir}/font.${i}.woff2") format("woff2");
  font-display:swap;
  unicode-range: U+${hexFrom}-${hexTo};
}
`;
}

function getFontFaces(dir, list, splitRange) {
  let style = "#unicodeList { font-family: jigmo; }";
  const codes = list.map((char) => char.codePointAt(0)).sort((a, b) => a - b);
  const to = codes.at(-1);
  for (let i = 1; i <= splitRange.length; i++) {
    const rangeFrom = codes[splitRange[i - 1]];
    const rangeTo = (list.length < splitRange[i])
      ? to
      : codes[splitRange[i]] - 1;
    style += getFontFace(dir, rangeFrom, rangeTo, i);
    if (to == rangeTo) break;
  }
  return style;
}

const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
const strokesThreshold = 35;
const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const Strokes = initStrokes();

for (let i = 1; i < strokesThreshold; i++) {
  const graded = getGradedKanjiList(i);
  const fontFaces = (i >= 25)
    ? getFontFaces(`${i}画`, graded[14], splitRange)
    : "";
  const joyoCount = JoyoStrokes[i] ? JoyoStrokes[i].length : 0;
  const jis4Count = Strokes[i]
    .filter((kanji) => jisCode.getGrade(kanji) >= 0).length;
  const allCount = Strokes[i].length;
  const strokes = `${i}画`;
  const strokesPanel = getStrokesPanel();
  const kanjiPanel = getKanjiPanel(graded, i);
  const dir = `src/画数/${strokes}`;
  Deno.mkdirSync(dir, { recursive: true });
  const html = eta.render("eta/strokes.eta", {
    fontFaces,
    joyoCount,
    jis4Count,
    allCount,
    strokes,
    strokesPanel,
    kanjiPanel,
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
}

const graded = Strokes.slice(strokesThreshold).flat();
const fontFaces = getFontFaces(`${strokesThreshold}画〜`, graded, splitRange);
const joyoCount = JoyoStrokes.slice(strokesThreshold).flat().length;
const jis4Count = Strokes.slice(strokesThreshold)
  .map((list) => list.filter((kanji) => jisCode.getGrade(kanji) >= 0))
  .flat().length;
const allCount = Strokes.slice(strokesThreshold).flat().length;
const strokes = `${strokesThreshold}画以上`;
const strokesPanel = getStrokesPanel();
const kanjiPanel = getKanjiPanel(graded, strokesThreshold);
const dir = `src/画数/${strokesThreshold}画〜`;
Deno.mkdirSync(dir, { recursive: true });
const html = eta.render("eta/strokes.eta", {
  fontFaces,
  joyoCount,
  jis4Count,
  allCount,
  strokes,
  strokesPanel,
  kanjiPanel,
});
Deno.writeTextFileSync(dir + "/index.html", html);
