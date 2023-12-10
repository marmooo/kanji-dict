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

const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);

function setRadicalComponents() {
  const root = document.getElementById("radicalComponents");
  radicalComponents.forEach((name) => {
    const a = document.createElement("a");
    a.href = `/kanji-dict/部首/${name}部/`;
    a.className = "px-1";
    a.textContent = name;
    root.appendChild(a);
  });
}

const jkat = new Kanji(JKAT);
setGrades();
setRadicalComponents();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("search").onclick = search;
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") search();
});
