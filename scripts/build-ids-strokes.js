// Build the sidebar data for /kanji-dict/ids/: which components
// (already narrowed down to the ones src/ids/index.csv has, i.e.
// matching at least 2 kanji) fall under each stroke count, so the
// page has something to browse besides an empty search box.
//
// Stroke counts come from @marmooo/kanji's UnicodeStrokes, the same
// source scripts/strokes-list.js uses for src/画数/ — it covers CJK
// Unicode broadly, not just standard kanji, so it also has entries
// for most IDS components (a handful of IDC/enclosure-like symbols
// have no stroke count and are simply left out of the sidebar; they
// still work through the search box itself).
//
// Capped at 15 strokes: components past that are rare and specific
// enough that browsing-by-stroke-count stops being useful, so they
// are left out of the sidebar (still reachable by typing them into
// the search box directly).
//
//   deno run -R --allow-write scripts/build-ids-strokes.js

import { UnicodeStrokes } from "@marmooo/kanji";

const MAX_STROKES = 15;

function loadComponents() {
  const csv = Deno.readTextFileSync("src/ids/index.csv");
  return csv.split("\n").filter((line) => line !== "").map((line) =>
    line.split("\t")[0]
  );
}

function build() {
  const strokeOf = new Map();
  UnicodeStrokes.forEach((list, strokes) => {
    list.forEach((component) => strokeOf.set(component, strokes));
  });

  const groups = Array.from({ length: MAX_STROKES + 1 }, () => []);
  let skipped = 0;
  for (const component of loadComponents()) {
    const strokes = strokeOf.get(component);
    if (strokes === undefined || strokes > MAX_STROKES) {
      skipped++;
      continue;
    }
    groups[strokes].push(component);
  }

  const lines = [];
  for (let strokes = 1; strokes <= MAX_STROKES; strokes++) {
    const sorted = groups[strokes].sort((a, b) =>
      a.codePointAt(0) - b.codePointAt(0)
    );
    lines.push(`${strokes}\t${sorted.join("")}`);
  }
  Deno.writeTextFileSync("src/ids/strokes.csv", lines.join("\n"));

  console.log(
    `src/ids/strokes.csv: 1-${MAX_STROKES} strokes, ${skipped} components skipped (no stroke count or over ${MAX_STROKES})`,
  );
}

build();
