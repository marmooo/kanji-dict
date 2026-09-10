// Shared by src/glyph.js and src/ids.js. Loads a single kanji glyph
// as inline SVG using the same block-index + Range-fetch scheme
// src/glyph/ already serves (src/glyph/{block}.svg + .svg.idx).
//
// fetchGlyphIndex() is cached per block: src/ids/ pages can ask for
// hundreds or thousands of glyphs from the same block (e.g. URO1),
// so fetching and re-summing that block's .idx file every single
// time would be wasteful.

export const ranges = {
  "ExtA": [0x3400, 0x4DBF],
  "URO1": [0x4E00, 0x62FF],
  "URO2": [0x6300, 0x77FF],
  "URO3": [0x7800, 0x8CFF],
  "URO4": [0x8D00, 0x9FFF],
  "CI": [0xF900, 0xFAD9],
  "ExtB1": [0x20000, 0x215FF],
  "ExtB2": [0x21600, 0x230FF],
  "ExtB3": [0x23100, 0x245FF],
  "ExtB4": [0x24600, 0x260FF],
  "ExtB5": [0x26100, 0x275FF],
  "ExtB6": [0x27600, 0x290FF],
  "ExtB7": [0x29100, 0x2A6DF],
  "ExtC": [0x2A700, 0x2B739],
  "ExtD": [0x2B740, 0x2B81D],
  "ExtE": [0x2B820, 0x2CEA1],
  "ExtF": [0x2CEB0, 0x2EBE0],
  "ExtI": [0x2EBF0, 0x2EE5D],
  "CIS": [0x2F800, 0x2FA1D],
  "ExtG": [0x30000, 0x3134A],
  "ExtH": [0x31350, 0x323AF],
  "ExtJ": [0x323B0, 0x33479],
};

export function getUnicodeNameIndex(code) {
  for (const [name, [start, end]] of Object.entries(ranges)) {
    if (code >= start && code <= end) {
      return [name, code - start];
    }
  }
  return undefined;
}

const glyphIndexCache = {};

export async function fetchGlyphIndex(name) {
  if (name in glyphIndexCache) {
    return glyphIndexCache[name];
  }
  const response = await fetch(`/kanji-dict/glyph/${name}.svg.idx`);
  const buffer = await response.arrayBuffer();
  const arr = new Uint16Array(buffer);
  let sum = 0;
  const result = Array.from(arr, (x) => sum += x);
  glyphIndexCache[name] = result;
  return result;
}

export async function fetchGlyph(name, index) {
  const arr = await fetchGlyphIndex(name);
  const from = arr[index];
  const to = arr[index + 1] - 1;
  const response = await fetch(`/kanji-dict/glyph/${name}.svg`, {
    headers: {
      "content-type": "multipart/byteranges",
      "range": `bytes=${from}-${to}`,
    },
  });
  return await response.text();
}

export function getSVG(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const glyph = doc.querySelector("glyph");
  const d = glyph.getAttribute("d");
  const horizAdvX = glyph.getAttribute("horiz-adv-x");
  const vertAdvY = glyph.getAttribute("vert-adv-y");
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
  width="1em" height="1em" viewBox="0 0 ${horizAdvX} ${horizAdvX}">
  <g transform="scale(1, -1) translate(0, -${vertAdvY})"><path d="${d}"></g>
</svg>
`;
}

export async function loadSVG(code) {
  const nameIndex = getUnicodeNameIndex(code);
  if (nameIndex) {
    const [name, index] = nameIndex;
    const xml = await fetchGlyph(name, index);
    return getSVG(xml);
  }
}

export async function loadGlyph(code) {
  const svg = await loadSVG(code);
  if (svg) {
    return svg;
  } else {
    return `<span>\ufffd</span>`;
  }
}
