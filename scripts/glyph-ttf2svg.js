import { ttf2svgFont } from "@marmooo/ttf2svg";
import { string } from "@tdewolff/minify";

function range(start, end) {
  const list = Array(end - start);
  for (let i = 0; i < end - start; i++) {
    list[i] = String.fromCodePoint(start + i);
  }
  return list;
}

// TODO: opentype.js 1.3.4 does not support IVS/IVD (HEAD is supported)
// ex: font.charToGlyph("\u82a6\ue0100");
const options = { removeNotdef: true, removeLigatures: true };
const jigmo1 = Deno.readFileSync("fonts/Jigmo/Jigmo.ttf");
const jigmo2 = Deno.readFileSync("fonts/Jigmo/Jigmo2.ttf");
const jigmo3 = Deno.readFileSync("fonts/Jigmo/Jigmo3.ttf");

const URO1 = range(Number(0x4E00), Number(0x62FF) + 1);
options.text = URO1.join("");
const URO1SVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/URO1.svg", string("image/svg+xml", URO1SVG));

const URO2 = range(Number(0x6300), Number(0x77FF) + 1);
options.text = URO2.join("");
const URO2SVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/URO2.svg", string("image/svg+xml", URO2SVG));

const URO3 = range(Number(0x7800), Number(0x8CFF) + 1);
options.text = URO3.join("");
const URO3SVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/URO3.svg", string("image/svg+xml", URO3SVG));

const URO4 = range(Number(0x8D00), Number(0x9FFF) + 1);
options.text = URO4.join("");
const URO4SVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/URO4.svg", string("image/svg+xml", URO4SVG));

const CI = range(Number(0xF900), Number(0xFAD9) + 1);
options.text = CI.join("");
const CISVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/CI.svg", string("image/svg+xml", CISVG));

const CIS = range(Number(0x2F800), Number(0x2FA1D) + 1);
options.text = CIS.join("");
const CISSVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/CIS.svg", string("image/svg+xml", CISSVG));

const ExtA = range(Number(0x3400), Number(0x4DBF) + 1);
options.text = ExtA.join("");
const ExtASVG = ttf2svgFont(jigmo1, options);
Deno.writeTextFile("src/glyph/ExtA.svg", string("image/svg+xml", ExtASVG));

const ExtB1 = range(Number(0x20000), Number(0x215FF) + 1);
options.text = ExtB1.join("");
const ExtB1SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB1.svg", string("image/svg+xml", ExtB1SVG));

const ExtB2 = range(Number(0x21600), Number(0x230FF) + 1);
options.text = ExtB2.join("");
const ExtB2SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB2.svg", string("image/svg+xml", ExtB2SVG));

const ExtB3 = range(Number(0x23100), Number(0x245FF) + 1);
options.text = ExtB3.join("");
const ExtB3SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB3.svg", string("image/svg+xml", ExtB3SVG));

const ExtB4 = range(Number(0x24600), Number(0x260FF) + 1);
options.text = ExtB4.join("");
const ExtB4SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB4.svg", string("image/svg+xml", ExtB4SVG));

const ExtB5 = range(Number(0x26100), Number(0x275FF) + 1);
options.text = ExtB5.join("");
const ExtB5SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB5.svg", string("image/svg+xml", ExtB5SVG));

const ExtB6 = range(Number(0x27600), Number(0x290FF) + 1);
options.text = ExtB6.join("");
const ExtB6SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB6.svg", string("image/svg+xml", ExtB6SVG));

const ExtB7 = range(Number(0x29100), Number(0x2A6DF) + 1);
options.text = ExtB7.join("");
const ExtB7SVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtB7.svg", string("image/svg+xml", ExtB7SVG));

const ExtC = range(Number(0x2A700), Number(0x2B73F) + 1);
options.text = ExtC.join("");
const ExtCSVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtC.svg", string("image/svg+xml", ExtCSVG));

const ExtD = range(Number(0x2B740), Number(0x2B81D) + 1);
options.text = ExtD.join("");
const ExtDSVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtD.svg", string("image/svg+xml", ExtDSVG));

const ExtE = range(Number(0x2B820), Number(0x2CEAD) + 1);
options.text = ExtE.join("");
const ExtESVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtE.svg", string("image/svg+xml", ExtESVG));

const ExtF = range(Number(0x2CEB0), Number(0x2EBE0) + 1);
options.text = ExtF.join("");
const ExtFSVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtF.svg", string("image/svg+xml", ExtFSVG));

const ExtG = range(Number(0x30000), Number(0x3134A) + 1);
options.text = ExtG.join("");
const ExtGSVG = ttf2svgFont(jigmo3, options);
Deno.writeTextFile("src/glyph/ExtG.svg", string("image/svg+xml", ExtGSVG));

const ExtH = range(Number(0x31350), Number(0x323AF) + 1);
options.text = ExtH.join("");
const ExtHSVG = ttf2svgFont(jigmo3, options);
Deno.writeTextFile("src/glyph/ExtH.svg", string("image/svg+xml", ExtHSVG));

const ExtI = range(Number(0x2EBF0), Number(0x2EE5D) + 1);
options.text = ExtI.join("");
const ExtISVG = ttf2svgFont(jigmo2, options);
Deno.writeTextFile("src/glyph/ExtI.svg", string("image/svg+xml", ExtISVG));

const ExtJ = range(Number(0x323B0), Number(0x33479) + 1);
options.text = ExtJ.join("");
const ExtJSVG = ttf2svgFont(jigmo3, options);
Deno.writeTextFile("src/glyph/ExtJ.svg", string("image/svg+xml", ExtJSVG));
