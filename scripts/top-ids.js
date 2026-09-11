// Replaces the "漢字構成" <details> block on the top page
// (src/index.html) with links to the TOP_N most frequent IDS
// components in src/ids/index.csv (e.g. /kanji-dict/ids/?q=木),
// shown in that same frequency order (most kanji first), not code
// point order like the other lists on this page.
//
// The block sits right after the existing 康熙字典214部首 <details>,
// between marker comments so re-running this script updates it in
// place instead of duplicating it (the markers are added on first
// run if they aren't there yet).
//
// Change TOP_N below to show more or fewer components, or pass a
// number on the command line to override it for one run:
//   deno run -RW scripts/top-ids.js        # uses TOP_N
//   deno run -RW scripts/top-ids.js 100    # top 100 instead

const TOP_N = 200;

const START_MARKER = "<!-- ids:start -->";
const END_MARKER = "<!-- ids:end -->";

function loadTopComponents(n) {
  const csv = Deno.readTextFileSync("src/ids/index.csv");
  const rows = csv.split("\n").filter((line) => line !== "").map((line) => {
    const [component, kanjiStr] = line.split("\t");
    return [component, Array.from(kanjiStr).length];
  });
  rows.sort((a, b) => b[1] - a[1]); // most kanji first
  return rows.slice(0, n).map(([component]) => component);
}

function buildBlock(components) {
  const links = components
    .map((c) =>
      `              <a href="/kanji-dict/ids/?q=${c}" class="px-1">${c}</a>`
    )
    .join("\n");
  return `${START_MARKER}
          <details>
            <summary>漢字構成</summary>
            <div class="pb-3 notranslate">
${links}
            </div>
          </details>
          ${END_MARKER}`;
}

function build() {
  const n = Deno.args[0] ? Number(Deno.args[0]) : TOP_N;
  const block = buildBlock(loadTopComponents(n));
  const html = Deno.readTextFileSync("src/index.html");

  const hasMarkers = html.includes(START_MARKER) &&
    html.includes(END_MARKER);
  let updated;
  if (hasMarkers) {
    const start = html.indexOf(START_MARKER);
    const end = html.indexOf(END_MARKER) + END_MARKER.length;
    updated = html.slice(0, start) + block + html.slice(end);
  } else {
    // First run: drop the block in right after the 康熙字典214部首
    // </details>, before that column's closing </div>.
    const anchor = "</details>\n        </div>";
    const anchorIndex = html.indexOf(anchor);
    if (anchorIndex === -1) {
      throw new Error(
        "could not find the 康熙字典214部首 details block to insert after " +
          "— insert the ids:start/ids:end markers into src/index.html by hand once",
      );
    }
    const insertAt = anchorIndex + "</details>".length;
    updated = html.slice(0, insertAt) + "\n          " + block +
      html.slice(insertAt);
  }

  Deno.writeTextFileSync("src/index.html", updated);
  console.log(`src/index.html updated with top ${n} components`);
}

build();
