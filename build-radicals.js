import { TextLineStream } from "https://deno.land/std/streams/mod.ts";
import { Unicode1Radical, Kanji } from "../kanji/src/mod.js";

async function singleRadicals() {
  const dict = {};
  const file = await Deno.open("components.csv");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const arr = line.split(",");
    const radicalGroupName = arr[0];
    const radicalGroupYomi = arr[1];
    const radicalName = arr[2];
    const radicalYomi = arr[3];
    dict[radicalGroupName] = { radicalGroupName, radicalGroupYomi, radicalName, radicalYomi };
  }
  return dict;
}

async function kanjivgRadicals() {
  const dict = {};
  const file = await Deno.open("kanjivg-radicals.csv");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const arr = line.split(",");
    const kanji = arr[0];
    const radicalGroupName = arr[1];
    const radicalGroupYomi = arr[2];
    const radicalName = arr[3];
    const radicalYomi = arr[4];
    dict[kanji] = { radicalGroupName, radicalGroupYomi, radicalName, radicalYomi };
  }
  return dict;
}

async function getRadicalGroupYomis() {
  const dict = {};
  const file = await Deno.open("kanjivg-radicals.csv");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const arr = line.split(",");
    const radicalGroupName = arr[1];
    const radicalGroupYomi = arr[2];
    dict[radicalGroupName] = radicalGroupYomi;
  }
  return dict;
}

function buildLevel1() {
  const result = [];
  const bmp3Radical = new Kanji(Unicode1Radical);
  Unicode1Radical.forEach((list) => {
    list.forEach((kanji) => {
      const radicalGroupId = bmp3Radical.getGrade(kanji);
      const radicalGroupName = radicalGroupNames[radicalGroupId] + "部";
      const radicalGroupYomi = radicalGroupYomis[radicalGroupName];
      result.push([kanji, radicalGroupName, radicalGroupYomi, "", ""]);
    });
  });
  const text = result.map((arr) => arr.join(",")).join("\n");
  Deno.writeTextFileSync("radicals1.csv", text);
}

function buildLevel2() {
  const result = [];
  const bmp3Radical = new Kanji(Unicode1Radical);
  Unicode1Radical.forEach((list) => {
    list.forEach((kanji) => {
      const radicalGroupId = bmp3Radical.getGrade(kanji);
      const radicalGroupName = radicalGroupNames[radicalGroupId] + "部";
      const radicalGroupYomi = radicalGroupYomis[radicalGroupName];
      const singleRadical = singleRadicalDB[radicalGroupName];
      if (singleRadical) {
        result.push([kanji, radicalGroupName, radicalGroupYomi, singleRadical.radicalName, singleRadical.radicalYomi]);
      } else {
        result.push([kanji, radicalGroupName, radicalGroupYomi, "", ""]);
      }
    });
  });
  const text = result.map((arr) => arr.join(",")).join("\n");
  Deno.writeTextFileSync("radicals2.csv", text);
}

const radicalGroupNames = Array.from(
  "一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金長門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲鬼魚鳥鹵鹿麥麻黃黍黑黹黽鼎鼓鼠鼻齊齒龍龜龠"
);
const radicalGroupYomis = await getRadicalGroupYomis();
const singleRadicalDB = await singleRadicals();

buildLevel1();
buildLevel2();

// const kanjivgRadicalsDB = await kanjivgRadicals();
// Unicode1Radical.forEach((list) => {
//   list.forEach((kanji) => {
//     const radicalGroupId = bmp3Radical.getGrade(kanji);
//     const radicalGroupName = radicalGroupNames[radicalGroupId] + "部";
//     const radicalGroupYomi = radicalGroupYomis[radicalGroupName];
//     // const info = kanjivgRadicalsDB[kanji];
//     // if (info) {
//     //   // if (radicalGroupName != info.radicalGroupName) {
//     //   //   console.log(kanji, radicalGroupName, info.radicalGroupName);
//     //   // }
//     //   result.push([kanji, ...Array.from(Object.values(info))]);
//     // } else {
//     //   result.push([kanji, radicalGroupName, radicalGroupYomi, "", ""]);
//     // }
//     result.push([kanji, radicalGroupName, radicalGroupYomi, "", ""]);
//   });
// });
// console.log(result.map((arr) => arr.join(",")).join("\n"));
