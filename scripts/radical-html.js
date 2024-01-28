import { Eta } from "eta";
import {
  JISCode,
  JKAT,
  JoyoRadical,
  Kanji,
  UnicodeRadical,
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
  UnicodeRadical[count].forEach((kanji) => {
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

function getKanjiPanel(graded) {
  const open = (graded[14].length < 500) ? "open" : "";
  let html = "";
  const joyo = graded.slice(0, 10);
  if (joyo.flat().length > 0) {
    html += `<h4>常用漢字</h4>\n`;
    html += `<div class="fs-3 pb-3 notranslate">\n`;
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
<div id="unicodeList" class="fs-3 notranslate">
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
        html += `<div class="fs-3 pb-3 notranslate">`;
        list.forEach((kanji) => {
          html += getKanjiLink(kanji);
        });
        html += "</div>\n";
      }
    }
  });
  return html;
}

function getRadicalPanel(list) {
  const dict = {};
  list.forEach((info) => {
    const name = dict[info.yomi];
    if (name) {
      if (!name.includes(info.name)) {
        dict[info.yomi] += info.name;
      }
    } else {
      dict[info.yomi] = info.name;
    }
  });
  let html = "";
  for (const [yomi, name] of Object.entries(dict)) {
    html += `<li>${name} (${yomi})</li>\n`;
  }
  return html;
}

function getRadicalComponentPanel() {
  let html = "";
  radicalComponents.forEach((name) => {
    html += `<a href="/kanji-dict/部首/${name}部/" class="px-1">${name}</a>`;
  });
  return html;
}

function initRadicalDB() {
  const arr = new Array(radicalComponents.length);
  const dict = {};
  for (let i = 0; i < radicalComponents.length; i++) {
    arr[i] = [];
    dict[radicalComponents[i]] = i;
  }
  const csv = Deno.readTextFileSync("data/radicals1.csv");
  csv.trimEnd().split("\n").forEach((line) => {
    const [kanji, component, componentYomi, name, yomi] = line.split(",");
    if (component[0] in dict) {
      const i = dict[component[0]];
      arr[i].push({ kanji, component, componentYomi, name, yomi });
    }
  });
  return arr;
}

function getFontFace(dir, from, to, i) {
  const hexFrom = from.toString(16).toUpperCase();
  const hexTo = to.toString(16).toUpperCase();
  return `
@font-face {
  font-family:jigmo;
  src:url("/kanji-dict/部首/${dir}/font.${i}.woff2") format("woff2");
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
    const index = Math.min(codes.length, splitRange[i]);
    const rangeTo = codes[index - 1];
    style += getFontFace(dir, rangeFrom, rangeTo, i);
    if (to == rangeTo) break;
  }
  return style;
}

const splitRange = [0, 64, 128, 256, 512, 1024, 2048, Infinity];
const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const radicalDB = initRadicalDB();

for (let i = 0; i < UnicodeRadical.length; i++) {
  const graded = getGradedKanjiList(i);
  const fontFaces = (graded[14].length < 500)
    ? getFontFaces(`${radicalComponents[i]}部`, graded[14], splitRange)
    : "";
  const joyoCount = JoyoRadical[i].length;
  const jis4Count = UnicodeRadical[i]
    .filter((kanji) => jisCode.getGrade(kanji) >= 0).length;
  const allCount = UnicodeRadical[i].length;
  const radical = radicalDB[i][0];
  const radicalPanel = getRadicalPanel(radicalDB[i]);
  const radicalComponentPanel = getRadicalComponentPanel();
  const kanjiPanel = getKanjiPanel(graded);
  const dir = `src/部首/${radical.component}`;
  Deno.mkdirSync(dir, { recursive: true });
  const html = eta.render("eta/radical.eta", {
    fontFaces,
    joyoCount,
    jis4Count,
    allCount,
    radical,
    radicalPanel,
    radicalComponentPanel,
    kanjiPanel,
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
}
