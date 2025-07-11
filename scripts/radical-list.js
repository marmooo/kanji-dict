import { JISCode, JKAT, Kanji, UnicodeRadical } from "@marmooo/kanji";

function initRadical() {
  const arr = structuredClone(UnicodeRadical);
  arr.forEach((list, i) => {
    arr[i] = list.filter((kanji) => {
      if (kanji in jkat.dict) return false;
      if (kanji in jisCode.dict) return false;
      return true;
    });
  });
  return arr;
}

const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const Radicals = initRadical();
const radicalComponents = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠",
);

for (let i = 0; i < radicalComponents.length; i++) {
  const dir = `src/部首/${radicalComponents[i]}部`;
  Deno.mkdirSync(dir, { recursive: true });
  const list = Radicals[i]
    .sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("\n");
  Deno.writeTextFileSync(dir + "/font.lst", list);
}
