import { parse } from "node-html-parser";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";

function getSmallSvg(name, from, to) {
  const svg = Deno.readTextFileSync(`src/glyph/${name}.svg`);
  const doc = parse(svg);
  const font = doc.querySelector("svg > defs > font");
  const glyphs = font.querySelectorAll("glyph");
  const target = glyphs.slice(from, to);
  if (target.length == 0) return;
  glyphs.forEach((glyph) => glyph.remove());
  target.forEach((glyph) => font.appendChild(glyph));
  return doc.toString();
}

const names = [
  "ExtA",
  "URO1",
  "URO2",
  "URO3",
  "URO4",
  "CI",
  "ExtB1",
  "ExtB2",
  "ExtB3",
  "ExtB4",
  "ExtB5",
  "ExtB6",
  "ExtB7",
  "ExtC",
  "ExtD",
  "ExtE",
  "ExtF",
  "ExtI",
  "CIS",
  "ExtG",
  "ExtH",
];

// // heavy
// for (const name of names) {
//   const svg = Deno.readTextFileSync(`src/glyph/${name}.svg`);
//   const ttf = svg2ttf(svg);
//   Deno.writeFileSync(`src/unicode/${name}.ttf`, ttf.buffer);
//   Deno.writeFileSync(`src/unicode/${name}.woff2`, ttf2woff2(ttf.buffer));
// }
const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
for (const name of names) {
  for (let i = 1; i <= splitRange.length; i++) {
    const from = splitRange[i - 1];
    const to = (i == splitRange.length) ? undefined : splitRange[i];
    const svg = getSmallSvg(name, from, to);
    if (svg) {
      const ttf = svg2ttf(svg);
      Deno.writeFileSync(`src/unicode/${name}.${i}.ttf`, ttf.buffer);
      Deno.writeFileSync(
        `src/unicode/${name}.${i}.woff2`,
        ttf2woff2(ttf.buffer),
      );
    } else {
      break;
    }
  }
}
