// Build the human-browsable IVD variant preview pages, baked at
// build time (fast, and the total bytes served are the same either
// way — so there's no point fetching them client-side) — one page
// per block, same 22 blocks the base-kanji glyph fonts already use:
//
//   src/ivd/URO1/index.html, src/ivd/ExtJ/index.html, ...
//
// Laid out like eta/unicode.eta: main content + a sidebar table of
// every block (grouped exactly the same way — URO1..4 and ExtB1..7
// share a row) linking to the other pages, so it's the same familiar
// browsing UI already used for the plain Unicode block listing.
//
// Glyph outlines are read directly from the Jigmo font files (not
// through the packed IVD_*.svg + .idx pair), so this script has no
// build-order dependency on ivd-ttf2svg.js — run them in either
// order.
//
//   deno run --allow-read --allow-write --allow-net --allow-env scripts/ivd-html.js

import { Eta } from "eta";
import { toSVG } from "@marmooo/ttf2svg";
import { collectIvdEntries, loadJigmoFonts } from "./lib/ivd-entries.js";
import { blockInfo, blocks, getBlock, sidebarRows } from "./lib/ivd-blocks.js";

// toSVG() doesn't set fill, so glyphs default to a hardcoded black
// path — fine in light mode but invisible against a dark background.
// currentColor makes them follow the page's (and dark-mode's) text
// color like every other inline glyph on the site.
function withCurrentColor(svg) {
  return svg.replace("<svg ", '<svg fill="currentColor" ');
}

function findBaseGlyphSVG(fonts, base) {
  for (const fontKey of ["jigmo1", "jigmo2", "jigmo3"]) {
    const font = fonts[fontKey];
    const gid = font.charToGlyphIndex(String.fromCodePoint(base));
    if (gid > 0) {
      return withCurrentColor(toSVG(font, font.glyphs.get(gid)) ?? "");
    }
  }
  return "";
}

function build() {
  const { bytes, fonts } = loadJigmoFonts();
  const entries = collectIvdEntries(bytes);

  // block -> Map<base, entries[]>
  const byBlock = new Map();
  for (const entry of entries) {
    const block = getBlock(entry.base);
    if (!block) continue;
    const byBase = byBlock.get(block) ?? new Map();
    const list = byBase.get(entry.base) ?? [];
    list.push(entry);
    byBase.set(entry.base, list);
    byBlock.set(block, byBase);
  }

  // per-block kanji/variant totals, for the sidebar's counts
  const counts = new Map();
  for (const [name] of blocks) {
    const byBase = byBlock.get(name) ?? new Map();
    let variantCount = 0;
    for (const list of byBase.values()) variantCount += list.length;
    counts.set(name, { kanjiCount: byBase.size, variantCount });
  }

  function buildSidebarHtml(currentBlock) {
    return sidebarRows.map(([label, blockNames]) => {
      const rowKanji = blockNames.reduce(
        (n, b) => n + counts.get(b).kanjiCount,
        0,
      );
      const rowVariants = blockNames.reduce(
        (n, b) => n + counts.get(b).variantCount,
        0,
      );
      const links = blockNames.map((b) => {
        const [, start, end] = blocks.find(([name]) => name === b);
        const range = `${start.toString(16).toUpperCase()}-${
          end.toString(16).toUpperCase()
        }`;
        const active = b === currentBlock ? " fw-bold" : "";
        return `<div class="${active}"><a href="/kanji-dict/ivd/${b}/">${range}</a></div>`;
      }).join("\n");
      return `<tr><td>${label}</td><td>${links}</td>` +
        `<td class="text-end">${rowKanji.toLocaleString()}</td>` +
        `<td class="text-end">${rowVariants.toLocaleString()}</td></tr>`;
    }).join("\n");
  }

  const eta = new Eta({ views: ".", cache: true });

  for (const [name] of blocks) {
    const byBase = byBlock.get(name) ?? new Map();
    const bases = [...byBase.keys()].sort((a, b) => a - b);

    const rows = bases.map((base) => {
      const list = byBase.get(base);
      const hex = base.toString(16).toUpperCase();
      const baseChar = String.fromCodePoint(base);
      const baseSVG = findBaseGlyphSVG(fonts, base);
      const cells = list.map((entry) => {
        const font = fonts[entry.fontKey];
        const svg = withCurrentColor(
          toSVG(font, font.glyphs.get(entry.glyphID)) ?? "",
        );
        const vsHex = entry.vs.toString(16).toUpperCase();
        return `<div class="tile">${svg}<br><small>U+${vsHex}</small></div>`;
      }).join("\n");
      // the raw base+selector sequences, once per row (not repeated
      // per tile) so the text is still selectable/searchable/
      // copy-pastable without stacking every tile's height — most
      // environments will just render each as the plain base
      // character anyway (that's exactly why the SVGs above exist).
      const text = list.map((entry) =>
        baseChar + String.fromCodePoint(entry.vs)
      ).join(" ");
      return `<div class="ivd-row d-flex flex-wrap align-items-center gap-3">
        <div class="base">${baseSVG}<br><small><a href="/kanji-dict/glyph/?q=U+${hex}">U+${hex}</a></small></div>
        <div class="d-flex flex-wrap">${cells}</div>
        <div class="ivd-text notranslate text-muted small ms-auto">${text}</div>
      </div>`;
    }).join("\n");

    const { kanjiCount, variantCount } = counts.get(name);
    const info = blockInfo[name];
    const html = eta.render("eta/ivd.eta", {
      name: info.name,
      description: info.description,
      lead: info.lead,
      sidebarHtml: buildSidebarHtml(name),
      kanjiCount,
      variantCount,
      rowsHtml: rows ||
        `<p class="text-muted">このブロックには異体字がありません。</p>`,
    });
    Deno.mkdirSync(`src/ivd/${name}`, { recursive: true });
    Deno.writeTextFileSync(`src/ivd/${name}/index.html`, html);
    console.log(
      `src/ivd/${name}/index.html: ${kanjiCount} kanji, ${variantCount} variants`,
    );
  }
}

build();
