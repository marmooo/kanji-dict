import { basename, dirname } from "@std/path";
import { expandGlob } from "@std/fs";
import { ttf2svgFont } from "@marmooo/ttf2svg";
import { string } from "@tdewolff/minify";

function build(inFile, outFile, options) {
  const text = Deno.readTextFileSync(inFile);
  if (text === "") { // TODO: update ttf2svg?
    Deno.writeTextFile(outFile, "");
    return;
  }
  const ttf1 = Deno.readFileSync("fonts/Jigmo/Jigmo.ttf");
  const ttf2 = Deno.readFileSync("fonts/Jigmo/Jigmo2.ttf");
  const ttf3 = Deno.readFileSync("fonts/Jigmo/Jigmo3.ttf");
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
const filePath = "src/音訓/**/*.lst";
const options = { removeNotdef: true, removeLigatures: true };
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;
const files = expandGlob(filePath, { globstar: true });
for await (const file of files) {
  const dirName = dirname(file.path);
  const baseName = basename(file.path);
  build(file.path, `${dirName}/${baseName.split(".")[0]}.svg`, options);
}
