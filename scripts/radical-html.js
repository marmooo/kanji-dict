import { Eta } from "eta";
import { JKAT, Kanji, Unicode1Radical } from "@marmooo/kanji";

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

function getRadicalList(list) {
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

function getKanjiList(radicalId) {
  let html = "";
  for (const kanji of Unicode1Radical[radicalId]) {
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
  return html;
}

function getRadicalComponentList() {
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

const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟⾉色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const eta = new Eta({ views: ".", cache: true });
const jkat = new Kanji(JKAT);
const radicalDB = initRadicalDB();

for (let i = 0; i < Unicode1Radical.length; i++) {
  const radical = radicalDB[i][0];
  const radicalList = getRadicalList(radicalDB[i]);
  const radicalComponentList = getRadicalComponentList();
  const kanjiList = getKanjiList(i);
  const count = radicalDB[i].length;
  const dir = `src/部首/${radical.component}`;
  Deno.mkdirSync(dir, { recursive: true });
  const html = eta.render("eta/radical.eta", {
    count,
    radical,
    radicalList,
    radicalComponentList,
    kanjiList,
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
}
