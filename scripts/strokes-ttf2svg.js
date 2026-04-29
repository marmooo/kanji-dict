import { ttf2svgFont } from "@marmooo/ttf2svg";
// import { minify } from "@tdewolff/minify";

export async function minify(_mimeType, svg) {
  const command = new Deno.Command("minify", {
    args: ["--type", "svg"],
    stdin: "piped",
    stdout: "piped",
    stderr: "inherit",
  });
  const child = command.spawn();
  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(svg));
  await writer.close();
  const { code, stdout } = await child.output();
  if (code !== 0) {
    throw new Error("minify failed");
  }
  return new TextDecoder().decode(stdout);
}

async function build(inFile, outFile, baseOptions) {
  const text = Deno.readTextFileSync(inFile);
  const ttf1 = Deno.readFileSync("fonts/Jigmo/Jigmo.ttf");
  const ttf2 = Deno.readFileSync("fonts/Jigmo/Jigmo2.ttf");
  const ttf3 = Deno.readFileSync("fonts/Jigmo/Jigmo3.ttf");
  const options = { ...baseOptions, text: text.replaceAll(/\n/g, "") };
  const svg1 = ttf2svgFont(ttf1, options);
  const svg2 = ttf2svgFont(ttf2, options);
  const svg3 = ttf2svgFont(ttf3, options);
  const [header, footer] = getHeaderFooter([svg1, svg2, svg3]);
  const svg = header +
    getGlyphs(svg1, fromRegExp, toRegExp) +
    getGlyphs(svg2, fromRegExp, toRegExp) +
    getGlyphs(svg3, fromRegExp, toRegExp) +
    footer;
  const minified = await minify("image/svg+xml", svg);
  Deno.writeTextFileSync(outFile, minified);
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

const baseOptions = {
  removeNotdef: true,
  removeLigatures: true,
};
const strokesThreshold = 35;
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;
for (let i = 1; i < strokesThreshold; i++) {
  await build(
    `src/画数/${i}画/font.lst`,
    `src/画数/${i}画/font.svg`,
    baseOptions,
  );
}
await build(
  `src/画数/${strokesThreshold}画〜/font.lst`,
  `src/画数/${strokesThreshold}画〜/font.svg`,
  baseOptions,
);
