function loadConfig() {
  const isDark =
    document.documentElement.getAttribute("data-bs-theme") === "dark";
  applySvgTheme(isDark);
}

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
  applySvgTheme(newTheme === "dark");
}

function applySvgTheme(isDark) {
  document.querySelectorAll("object").forEach((object) => {
    applyOrWait(object, isDark);
  });
}

function applyOrWait(object, isDark) {
  if (applyToObject(object, isDark)) return;
  if (themedObjects.has(object)) return;
  themedObjects.add(object);
  object.addEventListener("load", () => {
    const currentDark =
      document.documentElement.getAttribute("data-bs-theme") === "dark";
    applyToObject(object, currentDark);
  }, { once: true });
}

function applyToObject(object, isDark) {
  const doc = object.contentDocument;
  if (!doc || doc.documentURI === "about:blank") return false;
  const svg = doc.documentElement;
  if (!svg) return false;
  svg.style.background = isDark ? "#212529" : "#fff";
  const paths = doc.querySelectorAll("path");
  paths.forEach((path) => {
    path.style.stroke = isDark ? "#fff" : "#000";
  });
  object.style.visibility = "visible";
  return true;
}

function prev() {
  animator.stop().finish();
  currPos -= 1;
  if (currPos < 1) currPos = 1;
  let i = 1;
  while (true) {
    const path = kanjiSvg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute("stroke", "inherit");
      } else if (i == currPos) {
        path.setAttribute("stroke", "red");
      } else {
        path.setAttribute("stroke", "none");
      }
    } else {
      break;
    }
    i += 1;
  }
}

function stop() {
  animator.stop().finish();
  currPos = 0;
  let i = 1;
  while (true) {
    const path = kanjiSvg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      path.setAttribute("stroke", "inherit");
    } else {
      break;
    }
    i += 1;
  }
  document.getElementById("stop").classList.add("d-none");
  document.getElementById("play").classList.remove("d-none");
}

function play() {
  animator.reset().play();
  let i = 1;
  while (true) {
    const path = kanjiSvg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      path.setAttribute("stroke", "inherit");
    } else {
      break;
    }
    i += 1;
  }
  document.getElementById("stop").classList.remove("d-none");
  document.getElementById("play").classList.add("d-none");
}

function next() {
  animator.stop().finish();
  if (currPos < kakusu) {
    currPos += 1;
  }
  let i = 1;
  while (true) {
    const path = kanjiSvg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute("stroke", "inherit");
      } else if (i == currPos) {
        path.setAttribute("stroke", "red");
      } else {
        path.setAttribute("stroke", "none");
      }
    } else {
      break;
    }
    i += 1;
  }
}

function getKakusu() {
  let kakusu = 1;
  while (true) {
    const path = kanjiSvg.getElementById("kvg:" + kanjiId + "-s" + kakusu);
    if (path) {
      kakusu += 1;
    } else {
      break;
    }
  }
  return kakusu - 1;
}

function addHitsujun() {
  const hitsujun = document.getElementById("hitsujun");
  for (let i = 1; i <= kakusu; i++) {
    const svg = kanjiSvg.cloneNode(true);
    svg.setAttribute("width", 64);
    svg.setAttribute("height", 64);
    svg.removeAttribute("id");
    for (let j = i + 1; j <= kakusu; j++) {
      // cloneNode した要素は Safari だけ getElementById が動かない
      const id = "kvg:" + kanjiId + "-s" + j;
      const path = svg.querySelector(`[id="${id}"]`);
      path.setAttribute("stroke", "lightgray");
      path.removeAttribute("id");
    }
    hitsujun.appendChild(svg);
  }
}

function addAnimation() {
  animator = new Vivus(
    "kanji",
    { type: "oneByOne", duration: kakusu * 50 },
    () => {
      setTimeout(addAnimation, 2000);
    },
  );
}

function isLoaded(object) {
  const doc = object.contentDocument;
  if (!doc) return false;
  const svg = doc.querySelector("svg");
  if (!svg) return false;
  if (svg.getCurrentTime() < 0) return false;
  return true;
}

function initPage(object) {
  kanjiSvg = object.contentDocument.documentElement;
  kakusu = getKakusu();
  addHitsujun();
  addAnimation();
  const glyphURL = `/kanji-dict/glyph/?q=U+${kanjiId.toUpperCase()}`;
  document.getElementById("glyph").href = glyphURL;

  if (localStorage.getItem("darkMode") == 1) {
    const svg = document.getElementById("kanji")
      .contentDocument.documentElement;
    svg.style.background = "#212529";
    svg.firstElementChild.style.stroke = "#fff";
  }
}

function init(object) {
  if (isLoaded(object)) {
    initPage(object);
  } else {
    object.onload = () => {
      initPage(object);
    };
  }
}

const themedObjects = new WeakSet();
const object = document.getElementById("kanji");
const kanjiId = object.data.split("/").at(-1).split(".")[0];
let animator;
let kanjiSvg;
let kakusu;
let currPos = 1;
init(object);
loadConfig();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("next").onclick = next;
document.getElementById("play").onclick = play;
document.getElementById("stop").onclick = stop;
document.getElementById("prev").onclick = prev;
