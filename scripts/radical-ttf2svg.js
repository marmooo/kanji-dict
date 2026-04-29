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
const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;

for (let i = 0; i < radicalComponents.length; i++) {
  await build(
    `src/部首/${radicalComponents[i]}部/font.lst`,
    `src/部首/${radicalComponents[i]}部/font.svg`,
    baseOptions,
  );
}
