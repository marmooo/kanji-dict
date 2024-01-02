import { ttf2svgFont } from "@marmooo/ttf2svg";
import { $ } from "deno_dx";

async function build(inFile, outFile, options) {
  const text = Deno.readTextFileSync(inFile);
  const list = text.replaceAll(/\n/g, "");
  const svg1 = ttf2svgFont(
    "fonts/Jigmo-20230816/Jigmo.ttf",
    list,
    options,
  );
  const svg2 = ttf2svgFont(
    "fonts/Jigmo-20230816/Jigmo2.ttf",
    list,
    options,
  );
  const svg3 = ttf2svgFont(
    "fonts/Jigmo-20230816/Jigmo3.ttf",
    list,
    options,
  );
  const svg = svg1.slice(0, svg1.match(toRegExp).index) +
    svg2.slice(svg2.match(fromRegExp).index, svg2.match(toRegExp).index) +
    svg3.slice(svg2.match(fromRegExp).index);
  Deno.writeTextFile(outFile, svg);
  return await $`minify ${outFile} -o ${outFile}`;
}

// TODO: opentype.js 1.3.4 does not support IVS/IVD (HEAD is supported)
// ex: font.charToGlyph("\u82a6\ue0100");
const options = { removeNotdef: true };
const strokesThreshold = 35;
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;

for (let i = 1; i < strokesThreshold; i++) {
  await build(
    `src/画数/${i}画/font.lst`,
    `src/画数/${i}画/font.svg`,
    options,
  );
}
await build(
  `src/画数/${strokesThreshold}画〜/font.lst`,
  `src/画数/${strokesThreshold}画〜/font.svg`,
  options,
);
