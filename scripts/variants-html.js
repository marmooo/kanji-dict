// Build the "異体字(別字)" preview pages under src/variants/, mirroring
// src/ivd/'s structure exactly (same 22 blocks, same sidebar layout).
// This is the same variant list already shown inline on
// /kanji-dict/glyph/?q=... (the "異体字(別字)" section, driven by the
// Variants column merged into each kanji's TSV row) — just laid out
// here one block at a time for browsing, the way src/ivd/ browses
// IVS variants.
//
// data/variants.csv (built by scripts/build-variants.js) has one line
// per character with at least one variant:
//   <char>,<variant1><variant2>...
// with no separator between the variant characters — each line is
// already fully symmetric (if 亜 lists 亞, 亞's own line lists 亜),
// so no extra symmetrization is needed here.
//
// Baked at build time (not fetched client-side) for the same reason
// as src/ivd/: the total bytes served are the same either way, and
// static HTML is faster. Glyphs are read directly from the Jigmo
// fonts by codepoint — no IVS/cmap14 involved, since every character
// here (base and variant alike) is a plain, separately-encoded
// kanji, already covered by the ordinary src/glyph/*.svg fonts.
//
//   deno run --allow-read --allow-write --allow-net --allow-env scripts/variants-html.js

import { Eta } from "eta";
import { toSVG } from "@marmooo/ttf2svg";
import { loadJigmoFonts } from "./lib/ivd-entries.js";
import { blockInfo, blocks, getBlock, sidebarRows } from "./lib/variants-blocks.js";

function withCurrentColor(svg) {
  return svg.replace("<svg ", '<svg fill="currentColor" ');
}

function findGlyphSVG(fonts, code) {
  for (const fontKey of ["jigmo1", "jigmo2", "jigmo3"]) {
    const font = fonts[fontKey];
    const gid = font.charToGlyphIndex(String.fromCodePoint(code));
    if (gid > 0) {
      return withCurrentColor(toSVG(font, font.glyphs.get(gid)) ?? "");
    }
  }
  return "";
}

function parseVariantsCSV(text) {
  // base char -> variant chars[]
  const map = new Map();
  for (const line of text.split("\n")) {
    if (!line) continue;
    const commaIndex = line.indexOf(",");
    const a = line.slice(0, commaIndex);
    const b = line.slice(commaIndex + 1);
    map.set(a, [...b]); // [...b] splits on codepoints, not UTF-16 units
  }
  return map;
}

function build() {
  const { fonts } = loadJigmoFonts();
  const text = Deno.readTextFileSync("data/variants.csv");
  const variantsByChar = parseVariantsCSV(text);

  // block -> Map<base code, variant chars[]>
  const byBlock = new Map();
  for (const [baseChar, variantChars] of variantsByChar) {
    const base = baseChar.codePointAt(0);
    const block = getBlock(base);
    if (!block) continue;
    const byBase = byBlock.get(block) ?? new Map();
    byBase.set(base, variantChars);
    byBlock.set(block, byBase);
  }

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
        return `<div class="${active}"><a href="/kanji-dict/variants/${b}/">${range}</a></div>`;
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
      const variantChars = byBase.get(base);
      const hex = base.toString(16).toUpperCase();
      const baseSVG = findGlyphSVG(fonts, base);
      const cells = variantChars.map((char) => {
        const svg = findGlyphSVG(fonts, char.codePointAt(0));
        const vHex = char.codePointAt(0).toString(16).toUpperCase();
        return `<div class="tile">${svg}<br><small><a href="/kanji-dict/glyph/?q=U+${vHex}">U+${vHex}</a></small></div>`;
      }).join("\n");
      const text = variantChars.join(" ");
      return `<div class="variant-row d-flex flex-wrap align-items-center gap-3">
        <div class="base">${baseSVG}<br><small><a href="/kanji-dict/glyph/?q=U+${hex}">U+${hex}</a></small></div>
        <div class="d-flex flex-wrap">${cells}</div>
        <div class="variant-text notranslate text-muted small ms-auto">${text}</div>
      </div>`;
    }).join("\n");

    const { kanjiCount, variantCount } = counts.get(name);
    const info = blockInfo[name];
    const html = eta.render("eta/variants.eta", {
      name: info.name,
      description: info.description,
      lead: info.lead,
      sidebarHtml: buildSidebarHtml(name),
      kanjiCount,
      variantCount,
      rowsHtml: rows ||
        `<p class="text-muted">このブロックには異体字がありません。</p>`,
    });
    Deno.mkdirSync(`src/variants/${name}`, { recursive: true });
    Deno.writeTextFileSync(`src/variants/${name}/index.html`, html);
    console.log(
      `src/variants/${name}/index.html: ${kanjiCount} kanji, ${variantCount} variants`,
    );
  }
}

build();
