import { loadGlyph } from "./glyph-loader.js";

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;

// component -> kanji[]; fetched once per page load and reused for
// every search on this page (the query box lets you search again
// without a full page reload).
let indexPromise;
async function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch("/kanji-dict/ids/index.csv")
      .then((response) => response.text())
      .then((text) => {
        const map = new Map();
        for (const line of text.split("\n")) {
          if (line === "") continue;
          const [component, kanjiStr] = line.split("\t");
          map.set(component, Array.from(kanjiStr));
        }
        return map;
      });
  }
  return indexPromise;
}

// `q` is a plain string of one or more components, e.g. "彳" or
// "彳亍" — each character in it is one component to match, the same
// way a kanji's own IDS decomposition is represented elsewhere on
// this site (see src/glyph.js's getIDSComponent()). Kanji must
// contain *every* listed component (in any of their decompositions,
// not necessarily adjacent) to match.
function search(index, q) {
  const components = Array.from(new Set(Array.from(q)));
  if (components.length === 0) return [];
  let result;
  for (const c of components) {
    const kanjiList = index.get(c);
    if (!kanjiList) return [];
    const kanjiSet = new Set(kanjiList);
    result = result ? result.filter((k) => kanjiSet.has(k)) : kanjiList;
  }
  return result;
}

const BATCH_SIZE = 100;

// Renders `items` (kanji or bare components — both are single
// characters) as glyph links into `container`, replacing whatever
// was there before. Kept generic so both the search results list and
// the sidebar's per-stroke-count groups can share it.
async function renderGlyphLinks(container, items, hrefOf) {
  container.innerHTML = "";
  if (items.length === 0) return;
  const loading = document.createElement("div");
  loading.className = "text-muted fs-6";
  loading.textContent = "読み込み中...";
  container.appendChild(loading);
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const glyphs = await Promise.all(
      batch.map((item) => loadGlyph(item.codePointAt(0))),
    );
    const fragment = document.createDocumentFragment();
    batch.forEach((item, j) => {
      const a = document.createElement("a");
      a.className = "p-1";
      a.href = hrefOf(item);
      a.innerHTML = glyphs[j];
      fragment.appendChild(a);
    });
    container.insertBefore(fragment, loading);
  }
  loading.remove();
}

function updateHeader(q, count) {
  const components = Array.from(new Set(Array.from(q)));
  document.getElementById("heading").textContent = q ? q : "構成検索";
  document.title = q
    ? `${q} の構成検索 | こども漢字辞書`
    : "構成検索 | こども漢字辞書";
  const description = document.getElementById("description");
  if (components.length === 0) {
    description.textContent = "検索したい構成要素を入力してください。";
  } else if (components.length === 1) {
    description.textContent = `「${
      components[0]
    }」を構成要素として含む漢字は ${count}字あります。`;
  } else {
    description.textContent = `「${
      components.join("」「")
    }」をすべて構成要素として含む漢字は ${count}字あります。`;
  }
}

async function runSearch(q) {
  const index = await loadIndex();
  const kanjiList = search(index, q);
  updateHeader(q, kanjiList.length);
  const list = document.getElementById("list");
  await renderGlyphLinks(
    list,
    kanjiList,
    (kanji) => `/kanji-dict/glyph/?q=${kanji}`,
  );
}

// The sidebar lists every component with a stroke count from 1 to
// 15 (see scripts/build-ids-strokes.js), collapsed by default. A
// group's glyphs are only loaded the first time it's opened, so the
// initial page load doesn't have to fetch a few thousand glyphs it
// might never be asked to show. 1〜2画 only have a handful of
// components each, so those two stay open from the start.
const OPEN_BY_DEFAULT = 2;

async function loadStrokeGroups() {
  const response = await fetch("/kanji-dict/ids/strokes.csv");
  const text = await response.text();
  return text.split("\n").filter((line) => line !== "").map((line) => {
    const [strokes, componentStr] = line.split("\t");
    return [strokes, Array.from(componentStr ?? "")];
  });
}

function buildStrokeSidebar(groups) {
  const container = document.getElementById("strokes");
  for (const [strokes, components] of groups) {
    if (components.length === 0) continue;
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `${strokes}画 (${components.length})`;
    details.appendChild(summary);
    const body = document.createElement("div");
    body.className = "pb-3";
    details.appendChild(body);
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      renderGlyphLinks(
        body,
        components,
        (component) => `/kanji-dict/ids/?q=${component}`,
      );
    };
    // 1〜2画は該当する構成要素が少なく一覧性が高いので、開いた状態で
    // 表示する(この場合は toggle イベントを待たずにその場で読み込む)。
    if (Number(strokes) <= OPEN_BY_DEFAULT) {
      details.open = true;
      load();
    }
    details.addEventListener("toggle", () => {
      if (details.open) load();
    });
    container.appendChild(details);
  }
}

function main() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const input = document.getElementById("query");
  input.value = q;
  runSearch(q);
  loadStrokeGroups().then(buildStrokeSidebar);

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newQ = input.value.trim();
    const url = new URL(location.href);
    if (newQ) {
      url.searchParams.set("q", newQ);
    } else {
      url.searchParams.delete("q");
    }
    history.pushState(null, "", url);
    runSearch(newQ);
  });
}

main();
