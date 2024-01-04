import { parse } from "node-html-parser";
import svg2ttf from "svg2ttf";
import ttf2woff2 from "ttf2woff2";

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

function build(dir, splitRange) {
  for (let i = 1; i <= splitRange.length; i++) {
    const from = splitRange[i - 1];
    const to = (i == splitRange.length) ? undefined : splitRange[i];
    const svg = getSmallSvg(`${dir}/font.svg`, from, to);
    if (svg) {
      const ttf = svg2ttf(svg);
      Deno.writeFileSync(`${dir}/font.${i}.ttf`, ttf.buffer);
      Deno.writeFileSync(
        `${dir}/font.${i}.woff2`,
        ttf2woff2(ttf.buffer),
      );
    } else {
      break;
    }
  }
}

const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);
const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
for (let i = 0; i < radicalComponents.length; i++) {
  build(`src/部首/${radicalComponents[i]}部`, splitRange);
}
