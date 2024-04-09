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
const options = { removeNotdef: true };
const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const fromRegExp = /<glyph [^\/>]*\/>/;
const toRegExp = /<\/font>/;

for (let i = 0; i < radicalComponents.length; i++) {
  build(
    `src/部首/${radicalComponents[i]}部/font.lst`,
    `src/部首/${radicalComponents[i]}部/font.svg`,
    options,
  );
}
