function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

const ranges = {
  "ExtA": [0x3400, 0x4DBF],
  "URO1": [0x4E00, 0x62FF],
  "URO2": [0x6300, 0x77FF],
  "URO3": [0x7800, 0x8CFF],
  "URO4": [0x8D00, 0x9FFF],
  "CI": [0xF900, 0xFAD9],
  "ExtB1": [0x20000, 0x215FF],
  "ExtB2": [0x21600, 0x230FF],
  "ExtB3": [0x23100, 0x245FF],
  "ExtB4": [0x24600, 0x260FF],
  "ExtB5": [0x26100, 0x275FF],
  "ExtB6": [0x27600, 0x290FF],
  "ExtB7": [0x29100, 0x2A6DF],
  "ExtC": [0x2A700, 0x2B739],
  "ExtD": [0x2B740, 0x2B81D],
  "ExtE": [0x2B820, 0x2CEA1],
  "ExtF": [0x2CEB0, 0x2EBE0],
  "ExtI": [0x2EBF0, 0x2EE5D],
  "CIS": [0x2F800, 0x2FA1D],
  "ExtG": [0x30000, 0x3134A],
  "ExtH": [0x31350, 0x323AF],
  "ExtJ": [0x323B0, 0x33479],
};

function getUnicodeNameIndex(code) {
  for (const [name, [start, end]] of Object.entries(ranges)) {
    if (code >= start && code <= end) {
      return [name, code - start];
    }
  }
  return undefined;
}

async function fetchGlyphIndex(name) {
  const response = await fetch(`/kanji-dict/glyph/${name}.svg.idx`);
  const buffer = await response.arrayBuffer();
  const arr = new Uint16Array(buffer);
  let sum = 0;
  return Array.from(arr, (x) => sum += x);
}

async function fetchGlyph(name, index) {
  const arr = await fetchGlyphIndex(name);
  const from = arr[index];
  const to = arr[index + 1] - 1;
  const response = await fetch(`/kanji-dict/glyph/${name}.svg`, {
    headers: {
      "content-type": "multipart/byteranges",
      "range": `bytes=${from}-${to}`,
    },
  });
  return await response.text();
}

async function fetchTSVIndex(name) {
  const response = await fetch(`/kanji-dict/glyph/${name}.tsv.idx`);
  const buffer = await response.arrayBuffer();
  const arr = new Uint16Array(buffer);
  let sum = 0;
  return Array.from(arr, (x) => sum += x);
}

async function fetchTSV(name, index) {
  const arr = await fetchTSVIndex(name);
  const from = arr[index];
  const to = arr[index + 1] - 1;
  const response = await fetch(`/kanji-dict/glyph/${name}.tsv`, {
    headers: {
      "content-type": "multipart/byteranges",
      "range": `bytes=${from}-${to}`,
    },
  });
  return await response.text();
}

function getSVG(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const glyph = doc.querySelector("glyph");
  const d = glyph.getAttribute("d");
  const horizAdvX = glyph.getAttribute("horiz-adv-x");
  const vertAdvY = glyph.getAttribute("vert-adv-y");
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
  width="1em" height="1em" viewBox="0 0 ${horizAdvX} ${vertAdvY}">
  <g transform="scale(1, -1) translate(0, -${vertAdvY})"><path d="${d}"></g>
</svg>
`;
}

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
const unicodeNames = [
  "表外",
  "CJK統合漢字 (URO)",
  "CJK互換漢字",
  "CJK互換漢字補助",
  "CJK統合漢字拡張A",
  "CJK統合漢字拡張B",
  "CJK統合漢字拡張C",
  "CJK統合漢字拡張D",
  "CJK統合漢字拡張E",
  "CJK統合漢字拡張F",
  "CJK統合漢字拡張G",
  "CJK統合漢字拡張H",
  "CJK統合漢字拡張I",
  "CJK統合漢字拡張J",
];
const jisCodeNames = [
  "表外",
  "JIS第1水準",
  "JIS第2水準",
  "JIS第3水準",
  "JIS第4水準",
];
const jkatNames = [
  "表外",
  "10級 (小学1年生)",
  "9級 (小学2年生)",
  "8級 (小学3年生)",
  "7級 (小学4年生)",
  "6級 (小学5年生)",
  "5級 (小学6年生)",
  "4級 (中学1〜2年生)",
  "3級 (中学3年生)",
  "準2級 (高校性)",
  "2級 (常用漢字)",
  "準1級 (JIS第1水準)",
  "1級 (JIS第2水準)",
];

function getExampleLinks(text) {
  const fragment = new DocumentFragment();
  text.split(" ").forEach((word) => {
    const a = document.createElement("a");
    a.href = `https://www.google.com/search?q=${word}とは`;
    a.textContent = word;
    a.className = "px-1 text-nowrap";
    a.target = "_blank";
    a.rel = "noopener noreferer";
    fragment.appendChild(a);
  });
  return fragment;
}

function getReferenceLink(name, url) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = url;
  a.textContent = name;
  a.className = "px-1 text-nowrap";
  a.target = "_blank";
  a.rel = "noopener noreferer";
  li.appendChild(a);
  return li;
}

function getDictReferences(kanji) {
  const fragment = new DocumentFragment();
  const hex = kanji.codePointAt(0).toString(16).toUpperCase();
  fragment.appendChild(getReferenceLink(
    "Wiktionary",
    `https://ja.wiktionary.org/wiki/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "zi.tools",
    `https://zi.tools/zi/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "漢典",
    `https://www.zdic.net/hans/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "漢語多功能字庫",
    `https://humanum.arts.cuhk.edu.hk//Lexis/lexi-mf/search.php?word=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "國學大師",
    `https://www.guoxuedashi.net/zidian/${hex}.html`,
  ));
  return fragment;
}

function getMeaningReferences(kanji) {
  const fragment = new DocumentFragment();
  const hex = kanji.codePointAt(0).toString(16).toUpperCase();
  fragment.appendChild(getReferenceLink(
    "康熙字典網上版",
    `https://www.kangxizidian.com/kxhans/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "說文解字第一網",
    `http://www.shuowen.net/jiezi/${hex}/`,
  ));
  fragment.appendChild(getReferenceLink(
    "中華語文知識庫",
    `https://www.chinese-linguipedia.org/search_results.html?query=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "異體字詞典",
    `https://jf.xmu.edu.cn/variants/cc.html?q=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "古今文字集成",
    `http://www.ccamc.co/cjkv.php?cjkv=${kanji}`,
  ));
  return fragment;
}

function getChineseGlyphReferences(kanji) {
  const fragment = new DocumentFragment();
  fragment.appendChild(getReferenceLink(
    "Etymology",
    `https://hanziyuan.net/#${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "簡牘字典",
    `https://wcd-ihp.ascdc.sinica.edu.tw/woodslip/result.php?search=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "歷史文字資料庫",
    `https://wcd-ihp.ascdc.sinica.edu.tw/union/?c=search&moji=${kanji}`,
  ));
  return fragment;
}

function getJapanGlyphReferences(kanji) {
  const fragment = new DocumentFragment();
  const hex = kanji.codePointAt(0).toString(16).toUpperCase();
  fragment.appendChild(getReferenceLink(
    "漢字字体規範史データセット",
    `https://search.hng-data.org/search/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "篆書字体データセット",
    `http://codh.rois.ac.jp/tensho/unicode/U+${hex}`,
  ));
  fragment.appendChild(getReferenceLink(
    "日本古典籍くずし字データセット",
    `http://codh.rois.ac.jp/char-shape/unicode/U+${hex}`,
  ));
  fragment.appendChild(getReferenceLink(
    "史的文字データベース",
    `https://mojiportal.nabunken.go.jp/?c=search&moji=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "拓本文字データベース",
    `http://coe21.zinbun.kyoto-u.ac.jp/djvuchar?query=${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "浄瑠璃丸本字形データベース",
    `https://prj-kyodo-enpaku.w.waseda.jp/kuzushiji/DB/glyph/U+${hex}.html`,
  ));
  fragment.appendChild(getReferenceLink(
    "国語研変体仮名字形データベース",
    `https://cid.ninjal.ac.jp/hentaiganaDB/DB/glyph/U+${hex}.html`,
  ));
  return fragment;
}

function getUnicodeReferences(kanji) {
  const fragment = new DocumentFragment();
  const hex = kanji.codePointAt(0).toString(16).toUpperCase();
  fragment.appendChild(getReferenceLink(
    "Unihan Database",
    `http://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${hex}`,
  ));
  fragment.appendChild(getReferenceLink(
    "CHISE",
    `https://www.chise.org/est/view/character/${kanji}`,
  ));
  fragment.appendChild(getReferenceLink(
    "GlyphWiki",
    `https://glyphwiki.org/wiki/u${hex.toLowerCase()}`,
  ));
  fragment.appendChild(getReferenceLink(
    "文字情報基盤",
    `https://moji.or.jp/mojikibansearch/result?UCS=${hex}`,
  ));
  return fragment;
}

function addReferences(kanji) {
  const references = document.getElementById("references");
  const ul = references.querySelectorAll("ul");
  ul[0].appendChild(getDictReferences(kanji)); // 総合 (中国)
  ul[1].appendChild(getMeaningReferences(kanji)); // 字義
  ul[2].appendChild(getChineseGlyphReferences(kanji)); // 字体 (中国)
  ul[3].appendChild(getJapanGlyphReferences(kanji)); // 字体 (日本)
  ul[4].appendChild(getUnicodeReferences(kanji)); // Unicode
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

function getIDSComponent(idsString) {
  let html = "";
  if (idsString.length === 0) return "";
  idsString.split(" ").forEach((kanjis) => {
    html += "<li>";
    html += Array.from(kanjis).map((kanji) => {
      return `<span>${kanji}</span>`;
    }).join(" ＋ ");
    html += "</li>";
  });
  return html;
}

async function getKanjiComponent(kanjiString) {
  if (kanjiString === "") return "";
  let html = "";
  const arr = Array.from(kanjiString);
  const promises = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const kanji = arr[i];
    promises[i] = loadGlyph(kanji.codePointAt(0));
  }
  const glyphs = await Promise.all(promises);
  for (let i = 0; i < glyphs.length; i++) {
    html += `<a class="p-1" href="/kanji-dict/glyph/?q=${
      arr[i]
    }">${glyphs[i]}</a>`;
  }
  return html;
}

async function addKanjiInfo(kanji, hex, tsv) {
  const arr = tsv.split("\t");
  const grade = Number(arr[4]);
  const table = document.querySelector("table");
  const trs = table.querySelectorAll("tr");
  trs[0].children[1].textContent = `${arr[0]} (${arr[1]})`;
  trs[1].children[1].textContent = unicodeNames[Number(arr[2])];
  trs[2].children[1].textContent = jisCodeNames[Number(arr[3])];
  trs[3].children[1].textContent = jkatNames[grade];
  trs[4].children[1].textContent = arr[5].replace(/ /g, ","); // 音読み
  trs[5].children[1].textContent = arr[6].replace(/ /g, ","); // 訓読み
  trs[6].children[1].innerHTML = getStrokesComponent(arr[7]);
  trs[7].children[1].innerHTML = getRadicalComponent(arr[8]);
  trs[8].children[1].textContent = arr[9]; // 部首
  document.getElementById("ids").innerHTML = getIDSComponent(arr[10]); // IDS
  document.getElementById("variants").innerHTML = await getKanjiComponent(arr[11]); // Variants
  const unihan = document.getElementById("unihan");
  const tds = unihan.querySelectorAll("td:nth-of-type(2)");
  for (let i = 0; i <= 6; i++) { // Variants
    tds[i].innerHTML = await getKanjiComponent(arr[i + 12]);
  }
  for (let i = 7; i <= 17; i++) { // Readings
    tds[i].textContent = arr[i + 12];
  }
  const examples = document.getElementById("examples");
  const divs = examples.querySelectorAll("div");
  divs[0].appendChild(getExampleLinks(arr[30])); // 用例
  divs[1].appendChild(getExampleLinks(arr[31])); // 熟語
  divs[2].appendChild(getExampleLinks(arr[32])); // 学習例
  if (grade != 0) {
    const kidsURL = `/kanji-dict/${dirNames[grade - 1]}/${kanji}/`;
    const a = document.getElementById("kids");
    a.classList.remove("d-none");
    a.href = kidsURL;
  }
  const description =
    `漢字「${kanji}」(U+${hex}) の読み方・画数・部首・用例・成り立ちをまとめたページです。`;
  ['meta[name="description"]', 'meta[property="og:description"]']
    .forEach((selector) => {
      document.querySelector(selector).setAttribute("content", description);
    });
}

async function loadSVG(code) {
  const nameIndex = getUnicodeNameIndex(code);
  if (nameIndex) {
    const [name, index] = nameIndex;
    const xml = await fetchGlyph(name, index);
    return getSVG(xml);
  }
}

async function loadGlyph(code) {
  const svg = await loadSVG(code);
  if (svg) {
    return svg;
  } else {
    return `<span>\ufffd</span>`;
  }
}

async function loadMainGlyph(code) {
  const glyph = await loadGlyph(code);
  document.getElementById("kanji").innerHTML = glyph;
}

loadConfig();
const params = new URLSearchParams(location.search);
const q = params.get("q");
const matchCode = q.match(/^[uU] ?/);
const code = matchCode
  ? parseInt("0x" + q.slice(matchCode[0].length))
  : q.codePointAt(0);
loadMainGlyph(code);

const nameIndex = getUnicodeNameIndex(code);
if (nameIndex) {
  const kanji = String.fromCodePoint(code);
  const hex = code.toString(16).toUpperCase();
  document.title = `${kanji} (U+${hex}) | ${document.title}`;
  const [name, index] = nameIndex;
  const tsv = await fetchTSV(name, index);
  await addKanjiInfo(kanji, hex, tsv);
  addReferences(kanji);
} else {
  document.title = `\ufffd (U+FFFD) | ${document.title}`;
}

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
