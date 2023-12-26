import { Kanji } from "https://cdn.jsdelivr.net/npm/@marmooo/kanji@0.0.2/esm/kanji.js";
import { JKAT } from "https://cdn.jsdelivr.net/npm/@marmooo/kanji@0.0.2/esm/jkat.js";

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

function search() {
  const text = document.getElementById("searchText").value;
  if (!text) return;
  if (/[0-9]/.test(text[0])) {
    const strokes = parseInt(text);
    if (strokes < 25) {
      location.href = `/kanji-dict/画数/${strokes}画/`;
    } else {
      location.href = `/kanji-dict/画数/25画〜/`;
    }
  } else {
    const kanji = text[0];
    const grade = jkat.getGrade(kanji);
    if (grade >= 0) {
      location.href = "/kanji-dict/" + dirNames[grade] + "/" + kanji + "/";
    } else {
      location.href = "/kanji-dict/常用外/" + kanji + "/";
    }
  }
}

function setGrades() {
  for (let i = 0; i < 10; i++) {
    const e = document.getElementById(dirNames[i]);
    for (let j = 0; j < JKAT[i].length; j++) {
      const kanji = JKAT[i][j];
      const a = document.createElement("a");
      a.href = "/kanji-dict/" + dirNames[i] + "/" + kanji + "/";
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
