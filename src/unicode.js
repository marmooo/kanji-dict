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

function getCharacterURL(char) {
  const canvas = document.createElement("canvas");
  const size = 4;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
  });
  context.font = `${size}px sans-serif`;
  context.fillStyle = "white";
  context.fillText(char, 0, size);
  return canvas.toDataURL();
}

const uFFFFURL = getCharacterURL("\uffff");

function characterIsSupported(char) {
  const charURL = getCharacterURL(char);
  return uFFFFURL != charURL;
}

function colorTable(td, code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!td.classList.contains("table-warning")) {
        const kanji = String.fromCodePoint(code);
        if (!characterIsSupported(kanji)) {
          td.classList.add("table-warning");
        }
      }
      resolve();
    }, 0);
  });
}

function isElementInViewport(node) {
  const { top } = node.getBoundingClientRect();
  return top <= window.innerHeight;
}

async function checkSupportInViewport() {
  const trs = codeTrs.filter((tr) => isElementInViewport(tr));
  for (const tr of trs) {
    const tds = tr.children;
    const hex = tds[0].textContent;
    const from = Number(`0x${hex}`);
    const codes = Array(16).fill().map((_, i) => from + i);
    await Promise.all(
      codes.map((code) => colorTable(tds[code - from + 1], code)),
    );
  }
}

loadConfig();
const codeTrs = [...document.querySelectorAll("#table tr")].slice(1);
checkSupportInViewport();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
globalThis.addEventListener("scroll", checkSupportInViewport);
