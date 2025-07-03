import { basename } from "@std/path";
import { expandGlobSync } from "@std/fs";
import { Eta } from "eta";
import { parse, toSVG } from "@marmooo/ttf2svg";
import { JKAT, Kanji } from "@marmooo/kanji";

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

function loadSvgs(filePath) {
  const db = {};
  const options = { width: 64, height: 64 };
  const ttf = Deno.readFileSync(filePath);
  const font = parse(ttf.buffer, options);
  for (const glyph of Object.values(font.glyphs.glyphs)) {
    if (!glyph.unicode) continue;
    const kanji = String.fromCodePoint(glyph.unicode);
    if (jkat.getGrade(kanji) < 0) continue;
    db[kanji] = toSVG(font, glyph, options);
  }
  return db;
}

function loadDB() {
  const db = {};
  const tsv = Deno.readTextFileSync("kanji.tsv");
  tsv.split("\n").forEach((line) => {
    const arr = line.split("\t");
    const strokesComponent = getStrokesComponent(arr[7]);
    const radicalComponent = getRadicalComponent(arr[8]);
    // const ids = arr[10];
    // const unihans = arr.slice(11, 27);
    const vocabs = (arr[27].length != 0) ? arr[27].split(" ") : [];
    const idioms = (arr[28].length != 0) ? arr[28].split(" ") : [];
    const studyVocabs = (arr[29].length != 0) ? arr[29].split(" ") : [];
    db[arr[1]] = {
      kanji: arr[1],
      unicode: Number(arr[2]),
      jis: Number(arr[3]),
      grade: Number(arr[4]),
      on: arr[5].split(" "),
      kun: arr[6].split(" "),
      strokesComponent,
      radicalComponent,
      radical: arr[9],
      vocabs,
      idioms,
      studyVocabs,
    };
  });
  return db;
}

function getStrokesComponent(strokesText) {
  const components = strokesText.split(" ").map((str) => {
    const strokes = Number(str);
    const text = (strokes != 0) ? `${strokes}画` : "";
    const dir = (strokes >= 25) ? `25画〜` : `${strokes}画`;
    return `<a href="/kanji-dict/画数/${dir}/">${text}</a>`;
  });
  return components.join(" または ");
}

function getRadicalComponent(radicalText) {
  const radicals = Array.from(
    "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
  );
  const components = radicalText.split(" ").map((str) => {
    const id = Number(str);
    const text = `${radicals[id]}部`;
    return `<a href="/kanji-dict/部首/${text}/">${text}</a>`;
  });
  return components.join(" または ");
}

const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const kinbun = loadSvgs("fonts/syunju201/春秋tsu-教育漢字.otf");
const reisho = loadSvgs("fonts/aoyagireisyosimo_ttf_2_01.ttf");
const sousho = loadSvgs("fonts/KouzanBrushFontSousyo.ttf");
const gyousho = loadSvgs("fonts/衡山毛筆フォント行書.ttf");
const db = loadDB();

for (const file of expandGlobSync("kanjivg/*.svg")) {
  const name = basename(file.path).split(".")[0];
  if (name.includes("-")) continue;
  const code = Number("0x" + name);
  const kanji = String.fromCharCode(code);
  const info = db[kanji];
  if (!info) continue;
  if (info.grade < 1) continue;

  const dir = "src/" + dirNames[info.grade - 1];
  Deno.mkdirSync(dir, { recursive: true });
  const ancientSvgs = getAncientSvgs(kanji);
  const kanjiId = toKanjiId(kanji);
  const html = eta.render("eta/grade.eta", {
    kanji: kanji,
    kanjiId: kanjiId,
    grade: grades[info.grade - 1],
    info: info,
    ancientSvgs: ancientSvgs,
    vocabs: toLinks(info.vocabs.slice(0, 10)),
    idioms: toLinks(info.idioms.slice(0, 10)),
    studyVocabs: toLinks(info.studyVocabs.slice(0, 10)),
  });
  const kanjiDir = dir + "/" + kanji;
  Deno.mkdirSync(kanjiDir, { recursive: true });
  Deno.writeTextFileSync(kanjiDir + "/index.html", html);
}
