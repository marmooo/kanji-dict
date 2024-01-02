import { parse } from "node-html-parser";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";

function getSmallSvg(svgFile, from, to) {
  const svg = Deno.readTextFileSync(svgFile);
  const doc = parse(svg);
  const font = doc.querySelector("svg > defs > font");
  const glyphs = font.querySelectorAll("glyph");
  const target = glyphs.slice(from, to);
  if (target.length == 0) return;
  glyphs.forEach((glyph) => glyph.remove());
  target.forEach((glyph) => font.appendChild(glyph));
  return doc.toString();
}

function build(name, splitRange) {
  for (let i = 1; i <= splitRange.length; i++) {
    const from = splitRange[i - 1];
    const to = (i == splitRange.length) ? undefined : splitRange[i];
    const svg = getSmallSvg(`src/glyph/${name}.svg`, from, to);
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

const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
for (const name of names) {
  build(name, splitRange);
}
