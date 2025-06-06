import { parse } from "node-html-parser";
import { convert } from "fontconv";

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

async function build(dir, splitRange) {
  for (let i = 1; i <= splitRange.length; i++) {
    const from = splitRange[i - 1];
    const to = (i == splitRange.length) ? undefined : splitRange[i];
    const svg = getSmallSvg(`${dir}/font.svg`, from, to);
    if (svg) {
      const woff2 = await convert(svg, ".woff2", { removeLigatures: true });
      Deno.writeFileSync(`${dir}/font.${i}.woff2`, woff2);
    } else {
      break;
    }
  }
}

const strokesThreshold = 35;
const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
for (let i = 1; i < strokesThreshold; i++) {
  await build(`src/画数/${i}画`, splitRange);
}
await build(`src/画数/${strokesThreshold}画〜`, splitRange);
