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

function getUnicodeNameIndex(code) {
  if (code < Number(0x3400)) return undefined;
  if (code <= Number(0x4DBF)) return ["ExtA", code - Number(0x3400)];
  if (code < Number(0x4E00)) return undefined;
  if (code <= Number(0x62FF)) return ["URO1", code - Number(0x4E00)];
  if (code <= Number(0x77FF)) return ["URO2", code - Number(0x6300)];
  if (code <= Number(0x8CFF)) return ["URO3", code - Number(0x7800)];
  if (code <= Number(0x9FFF)) return ["URO4", code - Number(0x8D00)];
  if (code < Number(0xF900)) return undefined;
  if (code <= Number(0xFAD9)) return ["CI", code - Number(0xF900)];
  if (code <= Number(0x215FF)) return ["ExtB1", code - Number(0x20000)];
  if (code <= Number(0x230FF)) return ["ExtB2", code - Number(0x21600)];
  if (code <= Number(0x245FF)) return ["ExtB3", code - Number(0x23100)];
  if (code <= Number(0x260FF)) return ["ExtB4", code - Number(0x24600)];
  if (code <= Number(0x275FF)) return ["ExtB5", code - Number(0x26100)];
  if (code <= Number(0x290FF)) return ["ExtB6", code - Number(0x27600)];
  if (code <= Number(0x2A6DF)) return ["ExtB7", code - Number(0x29100)];
  if (code < Number(0x2A700)) return undefined;
  if (code <= Number(0x2B739)) return ["ExtC", code - Number(0x2A700)];
  if (code < Number(0x2B740)) return undefined;
  if (code <= Number(0x2B81D)) return ["ExtD", code - Number(0x2B740)];
  if (code < Number(0x2B820)) return undefined;
  if (code <= Number(0x2CEA1)) return ["ExtE", code - Number(0x2B820)];
  if (code < Number(0x2CEB0)) return undefined;
  if (code <= Number(0x2EBE0)) return ["ExtF", code - Number(0x2CEB0)];
  if (code < Number(0x2EBF0)) return undefined;
  if (code <= Number(0x2EE5D)) return ["ExtI", code - Number(0x2EBF0)];
  if (code < Number(0x2F800)) return undefined;
  if (code <= Number(0xFA1D)) return ["CIS", code - Number(0x2F800)];
  if (code < Number(0x30000)) return undefined;
  if (code <= Number(0x3134A)) return ["ExtG", code - Number(0x30000)];
  if (code < Number(0x31350)) return undefined;
  if (code <= Number(0x323AF)) return ["ExtH", code - Number(0x31350)];
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

async function fetchCSVIndex(name) {
  const response = await fetch(`/kanji-dict/glyph/${name}.csv.idx`);
  const buffer = await response.arrayBuffer();
  const arr = new Uint16Array(buffer);
  let sum = 0;
  return Array.from(arr, (x) => sum += x);
}

async function fetchCSV(name, index) {
  const arr = await fetchCSVIndex(name);
  const from = arr[index];
  const to = arr[index + 1] - 1;
  const response = await fetch(`/kanji-dict/glyph/${name}.csv`, {
    headers: {
      "content-type": "multipart/byteranges",
      "range": `bytes=${from}-${to}`,
    },
  });
  return await response.text();
}

function getSvg(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const glyph = doc.querySelector("glyph");
  const d = glyph.getAttribute("d");
  const horizAdvX = glyph.getAttribute("horiz-adv-x");
  const vertAdvY = glyph.getAttribute("vert-adv-y");
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
  width="300" height="300" viewBox="0 0 ${horizAdvX} ${vertAdvY}"
  transform="scale(1, -1)">
  <path d="${d}">
</svg>
`;
}

unicodeNames = [
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
];

jisCodeNames = [
  "表外",
  "JIS第1水準",
  "JIS第2水準",
  "JIS第3水準",
  "JIS第4水準",
];

jkatNames = [
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

function getLink(url, text) {
  const a = document.createElement("a");
  a.href = url;
  a.textContent = text;
  return a;
}

function addKanjiInfo(code, csv) {
  const arr = csv.split(",");
  const table = document.querySelector("table");
  const trs = table.querySelectorAll("tr");
  trs[0].children[1].textContent = `U+${code.toString(16).toUpperCase()}`;
  trs[1].children[1].textContent = unicodeNames[Number(arr[1])];
  trs[2].children[1].textContent = jisCodeNames[Number(arr[2])];
  trs[3].children[1].textContent = jkatNames[Number(arr[3])];
  trs[4].children[1].textContent = arr[4].replace(/ /g, ","); // 音読み
  trs[5].children[1].textContent = arr[5].replace(/ /g, ","); // 訓読み
  if (arr[6] != "0") {
    const strokes = `${arr[6]}画`;
    const strokesURL = `/kanji-dict/画数/${strokes}/`;
    trs[6].children[1].appendChild(getLink(strokesURL, strokes));
  }
  const componentURL = `/kanji-dict/部首/${arr[7]}/`;
  trs[7].children[1].appendChild(getLink(componentURL, arr[7]));
  trs[8].children[1].textContent = arr[8]; // 部首
  const examples = document.getElementById("examples");
  const divs = examples.querySelectorAll("div");
  divs[0].appendChild(getExampleLinks(arr[9])); // 用例
  divs[1].appendChild(getExampleLinks(arr[10])); // 熟語
  divs[2].appendChild(getExampleLinks(arr[11])); // 学習例
}

async function loadGlyph() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  // TODO: IVS/IVD
  const matchCode = q.match(/^[uU] ?/);
  const code = matchCode
    ? parseInt("0x" + q.slice(matchCode[0].length))
    : q.codePointAt(0);
  const nameIndex = getUnicodeNameIndex(code);
  if (nameIndex) {
    const kanji = String.fromCodePoint(code);
    const hex = code.toString(16).toUpperCase();
    document.title = `${kanji} (U+${hex}) | ${document.title}`;
    const [name, index] = nameIndex;
    const xml = await fetchGlyph(name, index);
    const svg = getSvg(xml);
    document.getElementById("kanji").innerHTML = svg;
    const csv = await fetchCSV(name, index);
    addKanjiInfo(code, csv);
  } else {
    const span = document.createElement("span");
    span.textContent = "\ufffd";
    span.style.fontSize = "300px";
    span.style.lineHeight = 1;
    document.getElementById("kanji").appendChild(span);
  }
}

loadConfig();
loadGlyph();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
