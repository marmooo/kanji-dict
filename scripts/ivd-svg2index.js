// Same length-array `.idx` scheme as scripts/glyph-svg2index.js,
// applied to the *.svg files produced by ivd-ttf2svg.js under
// src/ivd/ (e.g. src/ivd/URO1.svg, src/ivd/ExtB3.2.svg) — a separate
// directory from the base-kanji glyph fonts in src/glyph/ (URO1.svg,
// ExtB3.svg, ...), so there's no name collision to guard against
// here despite the matching block names.
//
// src/ivd/ also holds the IVD preview pages themselves
// (src/ivd/URO1/index.html, ...), so this only picks up plain files
// ending in .svg, skipping those per-block subdirectories.
//
// Unlike the URO/Ext blocks, glyphs here are never looked up via
// `codepoint - blockStart` at runtime — they're looked up by the
// plain ordinal position recorded in src/ivd/{block}.json (see that
// file's `index` field). Every glyph written into one of these .svg
// files is meaningful and none are skipped, so there's no "fill
// missing glyphs" gap-handling to do here.

function getIndex(filePath) {
  const svg = Deno.readTextFileSync(filePath);
  const glyphRegExp = /<glyph [^\/>]*\/>/g;
  const matches = [...svg.matchAll(glyphRegExp)];
  const encoder = new TextEncoder();
  const arr = [];
  matches.forEach((match, i) => {
    const to = match.index;
    if (i > 0) {
      const from = matches[i - 1].index;
      arr.push(encoder.encode(svg.slice(from, to)).length);
    } else {
      arr.push(encoder.encode(svg.slice(0, to)).length);
    }
  });
  const from = matches.at(-1).index;
  const to = from + matches.at(-1)[0].length;
  arr.push(encoder.encode(svg.slice(from, to)).length);
  const blob = new Uint8Array(new Uint16Array(arr).buffer);
  Deno.writeFileSync(`${filePath}.idx`, blob);
  console.log(filePath, matches.length, "glyphs");
}

for (const entry of Deno.readDirSync("src/ivd")) {
  if (entry.isFile && entry.name.endsWith(".svg")) {
    getIndex(`src/ivd/${entry.name}`);
  }
}
