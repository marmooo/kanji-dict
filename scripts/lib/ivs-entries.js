// Shared helper for ivs-ttf2svg.js and ivs-html.js.
//
// Collects every (base codepoint, variation selector) pair whose
// glyph is visually distinct from the base character's own glyph,
// across Jigmo.ttf / Jigmo2.ttf / Jigmo3.ttf.
//
// "Visually distinct" here just means: it appears in the cmap format
// 14 subtable's *non-default* UVS table. Per Jigmo's own build script
// (kamichikoichi/jigmo, makefont.pl), a sequence only gets a
// non-default entry (and a dedicated glyph) when its rendered shape
// differs from the base glyph; sequences that render identically to
// the base are recorded in the *default* UVS ranges instead and are
// skipped here since there's nothing new to display for them.
//
// The entries are returned sorted by (base, then variation selector)
// ascending — a canonical order we define ourselves. Jigmo's own
// internal glyph order (a Perl `sort(keys(%ivslist))` over strings
// like "u4e00-ue0100", used only to hand out temporary PUA code
// points during the font build) is a build-time artifact with no
// linguistic or registry meaning, mixes different hex-string lengths
// for BMP vs supplementary-plane base characters, and isn't preserved
// here or relied upon anywhere in these scripts.

import { parse } from "@marmooo/ttf2svg";
import { parseCmap14 } from "./cmap14.js";

function toArrayBuffer(u8) {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

export function loadJigmoFonts() {
  const bytes = {
    jigmo1: Deno.readFileSync("fonts/Jigmo/Jigmo.ttf"),
    jigmo2: Deno.readFileSync("fonts/Jigmo/Jigmo2.ttf"),
    jigmo3: Deno.readFileSync("fonts/Jigmo/Jigmo3.ttf"),
  };
  const fonts = Object.fromEntries(
    Object.entries(bytes).map(([key, buf]) => [key, parse(toArrayBuffer(buf))]),
  );
  return { bytes, fonts };
}

/**
 * @param {Record<string, Uint8Array>} bytes  from loadJigmoFonts()
 * @returns {{ base: number, vs: number, fontKey: string, glyphID: number }[]}
 */
export function collectIvsEntries(bytes) {
  const entries = [];
  for (const fontKey of ["jigmo1", "jigmo2", "jigmo3"]) {
    const varSelectors = parseCmap14(bytes[fontKey]);
    for (const [vs, { nonDefault }] of varSelectors) {
      for (const [base, glyphID] of nonDefault) {
        entries.push({ base, vs, fontKey, glyphID });
      }
    }
  }
  entries.sort((a, b) => a.base - b.base || a.vs - b.vs);
  return entries;
}
