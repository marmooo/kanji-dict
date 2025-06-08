import { TextLineStream } from "@std/streams";
import { Eta } from "eta";
import { Jinmei, JISCode, JKAT, Kanji, Unicode } from "@marmooo/kanji";

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

function kanaToHira(str) {
  return str.replace(/[ァ-ヶ]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getKanjiLink(onkun, kanji) {
  const grade = jkat.getGrade(kanji);
  if (0 <= grade && grade <= 9) {
    const url = `/kanji-dict/${dirNames[grade]}/${kanji}/`;
    return `<a href="${url}" class="px-1"><ruby>${kanji}<rt>${onkun}</rt></ruby></a>\n`;
  } else if (jisCode.getGrade(kanji) >= 0) {
    const url = `/kanji-dict/glyph/?q=${kanji}`;
    return `<a href="${url}" class="px-1"><ruby>${kanji}<rt>${onkun}</rt></ruby></a>\n`;
  } else {
    const hex = kanji.codePointAt(0).toString(16).toUpperCase();
    const url = `/kanji-dict/glyph/?q=U+${hex}`;
    return `<a href="${url}" class="px-1"><ruby>${kanji}<rt>${onkun}</rt></ruby></a>\n`;
  }
}

function getKanjiPanel(dict, dir) {
  let i = 0;
  let html = "";
  for (const [index, onkuns] of dict) {
    const fontList = getFontList(onkuns);
    let font;
    if (fontList.length === 0) {
      font = 0;
    } else {
      font = 1;
      Deno.writeTextFileSync(dir + `/fonts/${index}.lst`, fontList);
    }
    if (i === 0) {
      const style = `style="font-family:jigmo_${index},sans-serif;"`;
      html +=
        `<details font="${font}" open><summary>${index}</summary><div ${style}>\n`;
    } else {
      html += `<details font="${font}"><summary>${index}</summary><div>\n`;
    }
    for (let i = 0; i < onkuns.length; i++) {
      const [onkun, kanji] = onkuns[i].split(" ");
      html += getKanjiLink(onkun, kanji);
    }
    html += "</div></details>";
    i++;
  }
  return html;
}

async function initOnkuns() {
  const dict = new Map();
  const file = await Deno.open("kanji.csv");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const arr = line.split(",");
    const kanji = arr[1];
    const ons = arr[5].split(" ");
    const kuns = arr[6].split(" ");
    for (let i = 0; i < ons.length; i++) {
      const on = ons[i];
      if (on.length === 0) continue;
      const index = kanaToHira(on.slice(0, 2));
      const key = index[0].normalize("NFD")[0];
      const value = `${on} ${kanji}`;
      if (dict.has(key)) {
        const gramMap = dict.get(key);
        if (gramMap.has(index)) {
          gramMap.get(index).push(value);
        } else {
          gramMap.set(index, [value]);
        }
      } else {
        const gramMap = new Map();
        gramMap.set(index, [value]);
        dict.set(key, gramMap);
      }
    }
    for (let i = 0; i < kuns.length; i++) {
      const kun = kuns[i];
      if (kun.length === 0) continue;
      const index = kun.replace("-", "").slice(0, 2);
      const key = index[0].normalize("NFD")[0];
      const value = `${kun} ${kanji}`;
      if (dict.has(key)) {
        const gramMap = dict.get(key);
        if (gramMap.has(index)) {
          gramMap.get(index).push(value);
        } else {
          gramMap.set(index, [value]);
        }
      } else {
        const gramMap = new Map();
        gramMap.set(index, [value]);
        dict.set(key, gramMap);
      }
    }
  }
  for (const [_, gramMap] of dict) {
    for (const [index, array] of gramMap) {
      const sortedArray = array.sort((a, b) => a.localeCompare(b));
      gramMap.set(index, sortedArray);
    }
  }
  for (const [key, gramMap] of dict) {
    const sortedGramMap = new Map([...gramMap.entries()].sort((a, b) => {
      return a[0].localeCompare(b[0]);
    }));
    dict.set(key, sortedGramMap);
  }
  return dict;
}

function getFontFace(index) {
  return `
@font-face {
  font-family:jigmo_${index};
  src:url("fonts/${index}.woff2") format("woff2");
  font-display:swap;
}
`;
}

function toKanjis(dict) {
  const kanjis = [];
  for (const onkuns of dict.values()) {
    for (let j = 0; j < onkuns.length; j++) {
      const kanji = onkuns[j].split(" ")[1];
      kanjis.push(kanji);
    }
  }
  return kanjis;
}

function getJoyoCount(kanjis, jinmei) {
  let count = 0;
  for (let i = 0; i < kanjis.length; i++) {
    if (jinmei.getGrade(kanjis[i]) === 0) count++;
  }
  return count;
}

function getJis4Count(kanjis, jisCode) {
  let count = 0;
  for (let i = 0; i < kanjis.length; i++) {
    if (jisCode.getGrade(kanjis[i]) >= 0) count++;
  }
  return count;
}

function getFontList(onkuns) {
  return onkuns.map((str) => str.split(" ")[1])
    .filter((kanji) => {
      if (0 < jkat.getGrade(kanji)) return false;
      if (unicode.getGrade(kanji) === 0) return false; // URO
      return true;
    }).join("\n");
}

const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const jinmei = new Kanji(Jinmei);
const jisCode = new Kanji(JISCode);
const unicode = new Kanji(Unicode);
const Onkuns = await initOnkuns();

const aiueos = Array.from(
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
);
for (let i = 0; i < aiueos.length; i++) {
  const aiueo = aiueos[i];
  const onkuns = Onkuns.get(aiueo);
  if (!onkuns) continue;
  const dir = `src/音訓/${aiueo}`;
  Deno.mkdirSync(dir, { recursive: true });
  const kanjis = toKanjis(onkuns);
  const joyoCount = getJoyoCount(kanjis, jinmei);
  const jis4Count = getJis4Count(kanjis, jisCode);
  const allCount = kanjis.length;
  if (0 < allCount - jis4Count) {
    Deno.mkdirSync(`${dir}/fonts`, { recursive: true });
  }
  const fontFace = getFontFace(onkuns.keys().next().value);
  const kanjiPanel = getKanjiPanel(onkuns, dir);
  const html = eta.render("eta/onkun.eta", {
    fontFace,
    joyoCount,
    jis4Count,
    allCount,
    aiueo,
    kanjiPanel,
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
}
