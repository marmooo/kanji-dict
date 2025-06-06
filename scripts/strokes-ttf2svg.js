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
  const [header, footer] = getHeaderFooter([svg1, svg2, svg3]);
  const svg = header +
    getGlyphs(svg1, fromRegExp, toRegExp) +
    getGlyphs(svg2, fromRegExp, toRegExp) +
    getGlyphs(svg3, fromRegExp, toRegExp) +
    footer;
  Deno.writeTextFile(outFile, string("image/svg+xml", svg));
}

function getHeaderFooter(svgs) {
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const fromResult = svg.match(fromRegExp);
    if (!fromResult) continue;
    const header = svg.slice(0, fromResult.index);
    const footer = svg.slice(svg.match(toRegExp).index);
    return [header, footer];
  }
  throw new Error("font list is empty");
}

function getGlyphs(svg, fromRegExp, toRegExp) {
  const fromResult = svg.match(fromRegExp);
  if (!fromResult) return "";
  return svg.slice(fromResult.index, svg.match(toRegExp).index);
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
