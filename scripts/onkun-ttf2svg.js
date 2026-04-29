import { basename, dirname } from "@std/path";
import { expandGlob } from "@std/fs";
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
  if (text === "") { // TODO: update ttf2svg?
    Deno.writeTextFileSync(outFile, "");
    return;
  }
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

const filePath = "src/音訓/**/*.lst";
const baseOptions = {
  removeNotdef: true,
  removeLigatures: true,
};
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;
const files = expandGlob(filePath, { globstar: true });
for await (const file of files) {
  const dirName = dirname(file.path);
  const baseName = basename(file.path);
  await build(
    file.path,
    `${dirName}/${baseName.split(".")[0]}.svg`,
    baseOptions,
  );
}
