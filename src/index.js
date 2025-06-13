import { Kanji } from "https://cdn.jsdelivr.net/npm/@marmooo/kanji@0.1.1/esm/kanji.js";
import { JKAT } from "https://cdn.jsdelivr.net/npm/@marmooo/kanji@0.1.1/esm/jkat.js";

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
loadConfig();

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

function kanaToHira(str) {
  return str.replace(/[ァ-ヶ]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function search() {
  const text = document.getElementById("searchText").value;
  if (!text) return;
  if (/[0-9]/.test(text[0])) {
    const strokes = parseInt(text);
    if (strokes < 35) {
      location.href = `/kanji-dict/画数/${strokes}画/`;
    } else {
      location.href = `/kanji-dict/画数/35画〜/`;
    }
    return;
  } else if (/[あ-ゖァ-ヶ]/.test(text[0])) {
    location.href = `/kanji-dict/音訓/${kanaToHira(text[0])}/`;
    return;
  }
  // TODO: IVS/IVD
  const matchCode = text.match(/^[uU]\+?/);
  if (matchCode) {
    const code = text.slice(matchCode[0].length);
    location.href = `/kanji-dict/glyph/?q=U+${code}`;
  } else {
    const kanji = text[0];
    const grade = jkat.getGrade(kanji);
    if (grade >= 0) {
      location.href = `/kanji-dict/${dirNames[grade]}/${kanji}/`;
    } else {
      location.href = `/kanji-dict/glyph/?q=${kanji}`;
    }
  }
}

function setGrades() {
  for (let g = 0; g < 10; g++) {
    const e = document.getElementById(dirNames[g]);
    for (let i = 0; i < JKAT[g].length; i++) {
      const kanji = JKAT[g][i];
      const a = document.createElement("a");
      a.href = `/kanji-dict/${dirNames[g]}/${kanji}/`;
      a.className = "px-1";
      a.textContent = kanji;
      e.appendChild(a);
    }
  }
}

const jkat = new Kanji(JKAT);
setGrades();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("search").onclick = search;
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") search();
});
