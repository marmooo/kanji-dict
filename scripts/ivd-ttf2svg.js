// Build the production assets for kanji IVD variants, one per block
// — the *same* 22 blocks the base-kanji glyph fonts already use
// (URO1.svg, ExtB3.svg, ...; see scripts/lib/ivd-blocks.js). URO1..4
// and ExtB1..7 are kept separate here (not merged into one "URO" /
// "ExtB" file) specifically to keep each file's size manageable — a
// merged URO file turned out to be ~70MB with real Jigmo data.
//
//   src/ivd/URO1.svg, src/ivd/URO2.svg, ...
//     SVG fonts (same <font><glyph unicode="..." d="..."/></font>
//     shape as src/glyph/URO1.svg etc.) — living in src/ivd/, right
//     alongside the IVD preview pages (src/ivd/URO1/index.html), so
//     there's no need for the base-kanji glyph files' plain block
//     names to be disambiguated with a prefix; same layout as
//     src/unicode/'s own block fonts (src/unicode/URO1.3.woff2)
//     sitting next to src/unicode/URO1/index.html. A block only gets
//     a ".N" chunk suffix (URO2.1.svg, URO2.2.svg, ...) if it still
//     needed to be split further; otherwise it's just {block}.svg.
//     Run ivd-svg2index.js afterwards to generate the matching .idx
//     files, exactly like glyph-svg2index.js does for the base
//     blocks.
//
//   src/ivd/{block}.json  (one per block, 22 files total)
//     { "<base codepoint, lowercase hex>": [
//         { "vs": "<selector, lowercase hex>", "file": "URO1", "index": 0 },
//         ...
//       ], ... }
//     `file` + `index` is exactly the (name, index) pair that
//     src/glyph.js's fetchIvdGlyph() already knows how to resolve
//     into a byte range of the matching src/ivd/{file}.svg via its
//     .idx file — index here is a plain ordinal position in that
//     file, not a codepoint offset, since IVD glyphs aren't spread
//     over a dense contiguous Unicode range the way base kanji are.
//
//     This is split per block (rather than one big index) so that a
//     glyph page only ever fetches a small file for the block its
//     kanji belongs to — most kanji have zero IVD variants, and a
//     single global index would otherwise be downloaded on every
//     glyph page view for no reason.
//
// See scripts/lib/ivd-entries.js for how entries are collected and
// ordered, and scripts/lib/ivd-blocks.js for the block table.

import { toSVGFont } from "@marmooo/ttf2svg";
import { collectIvdEntries, loadJigmoFonts } from "./lib/ivd-entries.js";
import { getBlock } from "./lib/ivd-blocks.js";

export async function minify(_mimeType, svg) {
  const command = new Deno.Command("minify", {
    args: ["--type", "svg"],
    stdin: "piped",
    stdout: "piped",
    stderr: "inherit",
  });
  const child = command.spawn();
  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(svg));
  await writer.close();
  const { code, stdout } = await child.output();
  if (code !== 0) {
    throw new Error("minify failed");
  }
  return new TextDecoder().decode(stdout);
}

// Safety net in case a single block's variants are still too many for
// one file — unlikely now that URO/ExtB are no longer merged, but
// cheap insurance.
const CHUNK_SIZE = 6000;

async function build() {
  const { bytes, fonts } = loadJigmoFonts();
  const entries = collectIvdEntries(bytes);

  // block -> entries[], preserving the (base, vs) canonical order
  const byBlock = new Map();
  let skipped = 0;
  for (const entry of entries) {
    const block = getBlock(entry.base);
    if (!block) {
      skipped++;
      continue;
    }
    const list = byBlock.get(block) ?? [];
    list.push(entry);
    byBlock.set(block, list);
  }

  let variantTotal = 0;
  let kanjiTotal = 0;
  let fileTotal = 0;
  Deno.mkdirSync("src/ivd", { recursive: true });

  for (const [block, blockEntries] of byBlock) {
    const chunks = [];
    for (let i = 0; i < blockEntries.length; i += CHUNK_SIZE) {
      chunks.push(blockEntries.slice(i, i + CHUNK_SIZE));
    }

    const ivdIndex = {}; // baseHex -> [{ vs, file, index }]
    for (let c = 0; c < chunks.length; c++) {
      const chunk = chunks[c];
      const fileName = chunks.length === 1 ? block : `${block}.${c + 1}`;

      const glyphs = chunk.map((entry, i) => {
        const glyph = fonts[entry.fontKey].glyphs.get(entry.glyphID);
        // The glyph's own PUA code point only means something inside
        // its *source* .ttf (Jigmo / Jigmo2 / Jigmo3 each hand out
        // U+100000+n independently, so the same value can point to
        // unrelated glyphs in different files). It's overwritten
        // here with a private, collision-free placeholder purely so
        // toSVGFont() has something to put in unicode="..."; only
        // this glyph's *position* in the file is ever used to look
        // it up again (see {block}.json's `index`).
        glyph.unicode = 0xE000 + i;
        return glyph;
      });

      // Assumes Jigmo / Jigmo2 / Jigmo3 share the same unitsPerEm /
      // ascender / descender (they're one coherent font family split
      // across three files for size reasons) — worth a quick visual
      // sanity check in the preview pages if any variant looks
      // mis-sized or vertically offset.
      const svg = toSVGFont(fonts.jigmo1, glyphs, {
        removeNotdef: true,
        removeLigatures: true,
      });
      const minified = await minify("image/svg+xml", svg);
      Deno.writeTextFileSync(`src/ivd/${fileName}.svg`, minified);
      fileTotal++;

      chunk.forEach((entry, i) => {
        const baseHex = entry.base.toString(16);
        const vsHex = entry.vs.toString(16);
        (ivdIndex[baseHex] ??= []).push({
          vs: vsHex,
          file: fileName,
          index: i,
        });
      });
    }

    Deno.writeTextFileSync(
      `src/ivd/${block}.json`,
      JSON.stringify(ivdIndex),
    );
    variantTotal += blockEntries.length;
    kanjiTotal += Object.keys(ivdIndex).length;
  }

  console.log(
    `${variantTotal} variants for ${kanjiTotal} kanji, ` +
      `in ${fileTotal} src/ivd/*.svg + ${byBlock.size} src/ivd/*.json file(s)` +
      (skipped ? ` (${skipped} entries outside known blocks, skipped)` : ""),
  );
}

await build();
