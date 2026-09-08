// Minimal parser for the `cmap` table's format 14 subtable
// (Unicode Variation Sequences, platform 0 / encoding 5).
//
// @marmooo/ttf2svg bundles opentype.js@1.3.4, which does not parse
// format 14 cmap subtables at all (it silently ignores them), so this
// reads the raw bytes directly instead of going through `parse()`.
//
// Only this table is parsed here; glyph outlines are still extracted
// via `@marmooo/ttf2svg`'s `font.glyphs.get(glyphID)` + `toSVG()`,
// which don't depend on cmap at all.

/**
 * @param {Uint8Array} buf  raw .ttf file bytes
 * @returns {Map<number, {
 *   defaultRanges: [number, number][],
 *   nonDefault: Map<number, number>,
 * }>} keyed by variation selector codepoint (e.g. 0xE0100)
 */
export function parseCmap14(buf) {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  function u16(o) {
    return view.getUint16(o, false);
  }
  function u32(o) {
    return view.getUint32(o, false);
  }
  function u24(o) {
    return (view.getUint8(o) << 16) | (view.getUint8(o + 1) << 8) |
      view.getUint8(o + 2);
  }

  // --- locate the `cmap` table via the sfnt table directory ---
  const numTables = u16(4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i++) {
    const recordOffset = 12 + i * 16;
    const tag = String.fromCharCode(
      view.getUint8(recordOffset),
      view.getUint8(recordOffset + 1),
      view.getUint8(recordOffset + 2),
      view.getUint8(recordOffset + 3),
    );
    if (tag === "cmap") {
      cmapOffset = u32(recordOffset + 8);
      break;
    }
  }
  if (cmapOffset === -1) {
    throw new Error("cmap table not found");
  }

  // --- find the (platformID=0, encodingID=5) encoding record ---
  const cmapNumTables = u16(cmapOffset + 2);
  let subtableOffset = -1;
  for (let i = 0; i < cmapNumTables; i++) {
    const recordOffset = cmapOffset + 4 + i * 8;
    const platformID = u16(recordOffset);
    const encodingID = u16(recordOffset + 2);
    if (platformID === 0 && encodingID === 5) {
      subtableOffset = cmapOffset + u32(recordOffset + 4);
      break;
    }
  }
  const result = new Map();
  if (subtableOffset === -1) {
    return result; // this font has no IVS data at all
  }

  const format = u16(subtableOffset);
  if (format !== 14) {
    throw new Error(`unexpected cmap subtable format: ${format}`);
  }
  const numVarSelectorRecords = u32(subtableOffset + 6);
  for (let i = 0; i < numVarSelectorRecords; i++) {
    const recordOffset = subtableOffset + 10 + i * 11;
    const varSelector = u24(recordOffset);
    const defaultUVSOffset = u32(recordOffset + 3);
    const nonDefaultUVSOffset = u32(recordOffset + 7);

    const defaultRanges = [];
    if (defaultUVSOffset !== 0) {
      const base = subtableOffset + defaultUVSOffset;
      const numRanges = u32(base);
      for (let j = 0; j < numRanges; j++) {
        const o = base + 4 + j * 4;
        const start = u24(o);
        const additionalCount = view.getUint8(o + 3);
        defaultRanges.push([start, start + additionalCount]);
      }
    }

    const nonDefault = new Map();
    if (nonDefaultUVSOffset !== 0) {
      const base = subtableOffset + nonDefaultUVSOffset;
      const numMappings = u32(base);
      for (let j = 0; j < numMappings; j++) {
        const o = base + 4 + j * 5;
        const unicodeValue = u24(o);
        const glyphID = u16(o + 3);
        nonDefault.set(unicodeValue, glyphID);
      }
    }

    result.set(varSelector, { defaultRanges, nonDefault });
  }
  return result;
}
