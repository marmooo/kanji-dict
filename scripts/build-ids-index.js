// Build the reverse index the /kanji-dict/ids/?q= page (src/ids.js)
// fetches once and searches client-side.
//
// data/ids.csv already maps each kanji to its IDS decomposition(s)
// (built by scripts/build-ids.js). This script inverts that mapping:
// for every component character, which kanji contain it anywhere in
// their decomposition?
//
// This used to also precompute every co-occurring component *pair*
// and pre-generate a static page per component/pair — 13,571 + a
// further 251,890 directories. Instead, src/ids/?q=XY now just
// fetches this single index and intersects the per-component kanji
// lists in the browser, so no per-combination data or pages are
// needed at all.
//
// A component matching only one kanji has nothing to compare it
// against — there's no "similar characters" to browse — so those
// are dropped (13,571 -> 7,634 components).
//
//   deno run --allow-read --allow-write scripts/build-ids-index.js

const MIN_KANJI_COUNT = 2;

function sortByCodePoint(kanjiSet) {
  return Array.from(kanjiSet).sort((a, b) =>
    a.codePointAt(0) - b.codePointAt(0)
  );
}

function build() {
  const csv = Deno.readTextFileSync("data/ids.csv");
  const single = new Map(); // component -> Set<kanji>

  for (const line of csv.split("\n")) {
    if (line === "") continue;
    const commaIndex = line.indexOf(",");
    const kanji = line.slice(0, commaIndex);
    const idsField = line.slice(commaIndex + 1);

    // A kanji can have several alternative decompositions (space
    // separated); every component from every alternative counts.
    for (const sequence of idsField.split(" ")) {
      if (sequence === "") continue;
      for (const c of new Set(Array.from(sequence))) {
        if (!single.has(c)) single.set(c, new Set());
        single.get(c).add(kanji);
      }
    }
  }

  const lines = Array.from(single.entries())
    .filter(([, kanjiSet]) => kanjiSet.size >= MIN_KANJI_COUNT)
    .sort((a, b) => a[0].codePointAt(0) - b[0].codePointAt(0))
    .map(([c, kanjiSet]) => `${c}\t${sortByCodePoint(kanjiSet).join("")}`);

  Deno.mkdirSync("src/ids", { recursive: true });
  Deno.writeTextFileSync("src/ids/index.csv", lines.join("\n"));

  console.log(`src/ids/index.csv: ${lines.length} components`);
}

build();
