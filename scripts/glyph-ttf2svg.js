import { ttf2svgFont } from "@marmooo/ttf2svg";
import { $ } from "deno_dx";

function range(start, end) {
  const list = Array(end - start);
  for (let i = 0; i < end - start; i++) {
    list[i] = String.fromCodePoint(start + i);
  }
  return list;
}

// TODO: opentype.js 1.3.4 does not support IVS/IVD (HEAD is supported)
// ex: font.charToGlyph("\u82a6\ue0100");
const options = { removeNotdef: true };

const URO1 = range(Number(0x4E00), Number(0x62FF) + 1);
const URO1SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  URO1.join(""),
  options,
);
Deno.writeTextFile("src/glyph/URO1.svg", URO1SVG);
await $`minify src/glyph/URO1.svg -o src/glyph/URO1.svg`;

const URO2 = range(Number(0x6300), Number(0x77FF) + 1);
const URO2SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  URO2.join(""),
  options,
);
Deno.writeTextFile("src/glyph/URO2.svg", URO2SVG);
await $`minify src/glyph/URO2.svg -o src/glyph/URO2.svg`;

const URO3 = range(Number(0x7800), Number(0x8CFF) + 1);
const URO3SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  URO3.join(""),
  options,
);
Deno.writeTextFile("src/glyph/URO3.svg", URO3SVG);
await $`minify src/glyph/URO3.svg -o src/glyph/URO3.svg`;

const URO4 = range(Number(0x8D00), Number(0x9FFF) + 1);
const URO4SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  URO4.join(""),
  options,
);
Deno.writeTextFile("src/glyph/URO4.svg", URO4SVG);
await $`minify src/glyph/URO4.svg -o src/glyph/URO4.svg`;

const CI = range(Number(0xF900), Number(0xFAD9) + 1);
const CISVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  CI.join(""),
  options,
);
Deno.writeTextFile("src/glyph/CI.svg", CISVG);
await $`minify src/glyph/CI.svg -o src/glyph/CI.svg`;

const CIS = range(Number(0x2F800), Number(0x2FA1D) + 1);
const CISSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  CIS.join(""),
  options,
);
Deno.writeTextFile("src/glyph/CIS.svg", CISSVG);
await $`minify src/glyph/CIS.svg -o src/glyph/CIS.svg`;

const ExtA = range(Number(0x3400), Number(0x4DBF) + 1);
const ExtASVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo.ttf",
  ExtA.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtA.svg", ExtASVG);
await $`minify src/glyph/ExtA.svg -o src/glyph/ExtA.svg`;

const ExtB1 = range(Number(0x20000), Number(0x215FF) + 1);
const ExtB1SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB1.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB1.svg", ExtB1SVG);
await $`minify src/glyph/ExtB1.svg -o src/glyph/ExtB1.svg`;

const ExtB2 = range(Number(0x21600), Number(0x230FF) + 1);
const ExtB2SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB2.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB2.svg", ExtB2SVG);
await $`minify src/glyph/ExtB2.svg -o src/glyph/ExtB2.svg`;

const ExtB3 = range(Number(0x23100), Number(0x245FF) + 1);
const ExtB3SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB3.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB3.svg", ExtB3SVG);
await $`minify src/glyph/ExtB3.svg -o src/glyph/ExtB3.svg`;

const ExtB4 = range(Number(0x24600), Number(0x260FF) + 1);
const ExtB4SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB4.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB4.svg", ExtB4SVG);
await $`minify src/glyph/ExtB4.svg -o src/glyph/ExtB4.svg`;

const ExtB5 = range(Number(0x26100), Number(0x275FF) + 1);
const ExtB5SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB5.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB5.svg", ExtB5SVG);
$`minify src/glyph/ExtB5.svg -o src/glyph/ExtB5.svg`;

const ExtB6 = range(Number(0x27600), Number(0x290FF) + 1);
const ExtB6SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB6.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB6.svg", ExtB6SVG);
await $`minify src/glyph/ExtB6.svg -o src/glyph/ExtB6.svg`;

const ExtB7 = range(Number(0x29100), Number(0x2A6DF) + 1);
const ExtB7SVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtB7.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtB7.svg", ExtB7SVG);
await $`minify src/glyph/ExtB7.svg -o src/glyph/ExtB7.svg`;

const ExtC = range(Number(0x2A700), Number(0x2B739) + 1);
const ExtCSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtC.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtC.svg", ExtCSVG);
await $`minify src/glyph/ExtC.svg -o src/glyph/ExtC.svg`;

const ExtD = range(Number(0x2B740), Number(0x2B81D) + 1);
const ExtDSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtD.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtD.svg", ExtDSVG);
await $`minify src/glyph/ExtD.svg -o src/glyph/ExtD.svg`;

const ExtE = range(Number(0x2B820), Number(0x2CEA1) + 1);
const ExtESVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtE.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtE.svg", ExtESVG);
await $`minify src/glyph/ExtE.svg -o src/glyph/ExtE.svg`;

const ExtF = range(Number(0x2CEB0), Number(0x2EBE0) + 1);
const ExtFSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtF.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtF.svg", ExtFSVG);
await $`minify src/glyph/ExtF.svg -o src/glyph/ExtF.svg`;

const ExtG = range(Number(0x30000), Number(0x3134A) + 1);
const ExtGSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo3.ttf",
  ExtG.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtG.svg", ExtGSVG);
await $`minify src/glyph/ExtG.svg -o src/glyph/ExtG.svg`;

const ExtH = range(Number(0x31350), Number(0x323AF) + 1);
const ExtHSVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo3.ttf",
  ExtH.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtH.svg", ExtHSVG);
await $`minify src/glyph/ExtH.svg -o src/glyph/ExtH.svg`;

const ExtI = range(Number(0x2EBF0), Number(0x2EE5D) + 1);
const ExtISVG = ttf2svgFont(
  "fonts/Jigmo-20230816/Jigmo2.ttf",
  ExtI.join(""),
  options,
);
Deno.writeTextFile("src/glyph/ExtI.svg", ExtISVG);
await $`minify src/glyph/ExtI.svg -o src/glyph/ExtI.svg`;
