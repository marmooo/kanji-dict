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

function checkCharacters(chars) {
  return new Promise((resolve) => {
    const handle = (e) => {
      worker.removeEventListener("message", handle);
      resolve(e.data);
    };
    worker.addEventListener("message", handle);
    worker.postMessage({ chars });
  });
}

function colorTable(td, result) {
  return new Promise((resolve) => {
    if (td.classList.contains("bg-warning-subtle")) {
      resolve();
    } else {
      if (!result.supported) {
        td.classList.add("bg-warning-subtle");
      }
      resolve();
    }
  });
}

function isElementInViewport(node) {
  const { top, bottom } = node.getBoundingClientRect();
  return 0 <= bottom && top <= globalThis.innerHeight;
}

async function checkSupportInViewport() {
  const trs = codeTrs.filter((tr) => isElementInViewport(tr));
  const id = Date.now();
  scrollId = id;
  for (const tr of trs) {
    if (id != scrollId) continue;
    const tds = tr.children;
    const hex = tds[0].textContent;
    const from = Number(`0x${hex}`);
    const codes = Array(16).fill().map((_, i) => from + i);
    const chars = codes.map((code) => String.fromCodePoint(code));
    const results = await checkCharacters(chars);
    await Promise.all(
      results.map((result, i) => colorTable(tds[i + 1], result)),
    );
  }
}

loadConfig();
const worker = new Worker("/kanji-dict/unicode-worker.js", { type: "module" });
let scrollId;
const codeTrs = [...document.querySelectorAll("#table tr")].slice(1);
checkSupportInViewport();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
globalThis.addEventListener("scroll", checkSupportInViewport);
