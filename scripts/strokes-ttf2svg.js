import { ttf2svgFont } from "@marmooo/ttf2svg";
import { string } from "@tdewolff/minify";

function build(inFile, outFile, options) {
  const text = Deno.readTextFileSync(inFile);
  const ttf1 = Deno.readFileSync("fonts/Jigmo-20230816/Jigmo.ttf");
  const ttf2 = Deno.readFileSync("fonts/Jigmo-20230816/Jigmo2.ttf");
  const ttf3 = Deno.readFileSync("fonts/Jigmo-20230816/Jigmo3.ttf");
  options.text = text.replaceAll(/\n/g, "");
  const svg1 = ttf2svgFont(ttf1, options);
  const svg2 = ttf2svgFont(ttf2, options);
  const svg3 = ttf2svgFont(ttf3, options);
  const svg = svg1.slice(0, svg1.match(toRegExp).index) +
    svg2.slice(svg2.match(fromRegExp).index, svg2.match(toRegExp).index) +
    svg3.slice(svg2.match(fromRegExp).index);
  Deno.writeTextFile(outFile, string("image/svg+xml", svg));
}

// TODO: opentype.js 1.3.4 does not support IVS/IVD (HEAD is supported)
// ex: font.charToGlyph("\u82a6\ue0100");
const options = { removeNotdef: true, removeLigatures: true };
const strokesThreshold = 35;
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;

for (let i = 1; i < strokesThreshold; i++) {
  build(
    `src/画数/${i}画/font.lst`,
    `src/画数/${i}画/font.svg`,
    options,
  );
}
build(
  `src/画数/${strokesThreshold}画〜/font.lst`,
  `src/画数/${strokesThreshold}画〜/font.svg`,
  options,
);
