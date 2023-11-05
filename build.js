import { readLines } from "https://deno.land/std/io/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.1.1/src/index.ts";
import ttf2svg from "npm:@marmooo/ttf2svg@0.0.4";

const w1_ = Array.from(
  "一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六",
);
const w2_ = Array.from(
  "引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話",
);
const w3_ = Array.from(
  "悪安暗医委意育員院飲運泳駅央横屋温化荷界開階寒感漢館岸起期客究急級宮球去橋業曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕死使始指歯詩次事持式実写者主守取酒受州拾終習集住重宿所暑助昭消商章勝乗植申身神真深進世整昔全相送想息速族他打対待代第題炭短談着注柱丁帳調追定庭笛鉄転都度投豆島湯登等動童農波配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服福物平返勉放味命面問役薬由油有遊予羊洋葉陽様落流旅両緑礼列練路和",
);
const w4_ = Array.from(
  "愛案以衣位茨印英栄媛塩岡億加果貨課芽賀改械害街各覚潟完官管関観願岐希季旗器機議求泣給挙漁共協鏡競極熊訓軍郡群径景芸欠結建健験固功好香候康佐差菜最埼材崎昨札刷察参産散残氏司試児治滋辞鹿失借種周祝順初松笑唱焼照城縄臣信井成省清静席積折節説浅戦選然争倉巣束側続卒孫帯隊達単置仲沖兆低底的典伝徒努灯働特徳栃奈梨熱念敗梅博阪飯飛必票標不夫付府阜富副兵別辺変便包法望牧末満未民無約勇要養浴利陸良料量輪類令冷例連老労録",
);
const w5_ = Array.from(
  "圧囲移因永営衛易益液演応往桜可仮価河過快解格確額刊幹慣眼紀基寄規喜技義逆久旧救居許境均禁句型経潔件険検限現減故個護効厚耕航鉱構興講告混査再災妻採際在財罪殺雑酸賛士支史志枝師資飼示似識質舎謝授修述術準序招証象賞条状常情織職制性政勢精製税責績接設絶祖素総造像増則測属率損貸態団断築貯張停提程適統堂銅導得毒独任燃能破犯判版比肥非費備評貧布婦武復複仏粉編弁保墓報豊防貿暴脈務夢迷綿輸余容略留領歴",
);
const w6_ = Array.from(
  "胃異遺域宇映延沿恩我灰拡革閣割株干巻看簡危机揮貴疑吸供胸郷勤筋系敬警劇激穴券絹権憲源厳己呼誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸除承将傷障蒸針仁垂推寸盛聖誠舌宣専泉洗染銭善奏窓創装層操蔵臓存尊退宅担探誕段暖値宙忠著庁頂腸潮賃痛敵展討党糖届難乳認納脳派拝背肺俳班晩否批秘俵腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳郵優預幼欲翌乱卵覧裏律臨朗論",
);
// https://okjiten.jp/7-tyuugakuseikanji.html
// 漢検4級
const w7_ = Array.from(
  "握扱依威偉為違緯維壱芋隠陰鋭影越援縁煙鉛汚押奥憶菓箇暇雅介壊戒皆較獲刈甘監汗歓勧乾鑑環含奇鬼祈輝幾儀戯詰脚却丘及朽拠巨距御驚凶恐響叫狭狂況仰駆屈掘繰傾恵迎撃肩堅遣兼軒圏剣玄誇鼓枯継互更荒抗攻稿香恒項豪込婚鎖歳彩載剤咲惨雌伺紫刺脂旨執芝煮斜釈寂狩朱趣需秀舟襲柔獣瞬巡旬盾紹召沼詳床称畳丈飾殖触浸震慎侵寝振薪陣尽尋吹是征姓井跡扇占鮮訴燥騒僧贈即俗耐替拓沢濁脱丹端嘆淡弾恥遅致蓄沖跳徴澄珍沈抵堤摘滴添殿途吐渡奴怒透唐桃盗塔到倒逃踏稲闘胴峠突鈍曇弐悩濃輩杯泊拍迫薄爆髪抜罰繁販搬範般盤被疲彼避尾微匹描浜敏怖膚浮腐敷普賦舞幅払噴柄壁捕舗峰抱砲肪坊忙冒傍帽凡盆漫慢妙眠矛霧娘茂網猛黙紋踊雄与誉腰溶躍謡翼雷頼絡欄離粒慮療隣涙隷麗齢暦劣烈恋露郎惑腕",
);
// 漢検3級
const w8_ = Array.from(
  "哀慰詠悦閲炎宴欧殴乙卸穏架佳華嫁餓怪悔塊概慨該穫隔郭岳掛滑勘肝貫敢緩冠換喚企軌棄棋忌既岐騎犠欺菊吉喫虐虚脅峡凝緊斤愚偶遇啓鶏携掲刑憩契鯨賢倹幻雇顧弧孤悟娯甲孔控拘郊硬綱巧坑慌絞酵克獄魂紺恨墾催債削錯搾撮擦暫施祉諮侍慈軸湿疾赦邪殊寿潤遵徐如晶掌鐘焦衝昇匠譲錠嬢冗嘱辱審伸辛粋炊遂衰穂酔随髄瀬牲婿請隻惜斥籍摂潜繕措阻粗礎双桑葬掃遭憎促賊逮胎怠滞袋滝託卓択諾奪胆鍛壇稚畜窒駐抽鋳彫超聴陳鎮墜訂帝締哲斗塗陶凍痘匿篤豚尿粘婆排陪縛伐帆伴藩畔蛮泌卑碑姫漂苗赴符封伏覆墳紛癖募慕簿崩芳胞縫倣邦飽奉妨乏謀膨房某墨没翻魔埋膜又魅滅免幽憂誘擁揚揺抑裸濫吏隆了猟陵糧厘零霊励裂錬廉炉漏廊浪楼湾",
);
const w9_ = Array.from(
  "亜尉逸姻韻畝浦疫謁猿凹翁虞渦禍靴寡稼蚊拐懐劾涯垣核殻嚇潟括喝渇褐轄且缶陥患堪棺款閑寛憾還艦頑飢宜偽擬糾窮拒享挟恭矯暁菌琴謹襟吟隅勲薫茎渓蛍慶傑嫌献謙繭顕懸弦呉碁江肯侯洪貢溝衡購拷剛酷昆懇佐唆詐砕宰栽斎崎索酢桟傘肢嗣賜滋璽漆遮蛇酌爵珠儒囚臭愁酬醜汁充渋銃叔淑粛塾俊准殉循庶緒叙升抄肖尚宵症祥渉訟硝粧詔奨彰償礁浄剰縄壌醸津唇娠紳診刃迅甚帥睡枢崇据杉斉逝誓析拙窃仙栓旋践遷薦繊禅漸租疎塑壮荘捜挿曹喪槽霜藻妥堕惰駄泰濯但棚痴逐秩嫡衷弔挑眺釣懲勅朕塚漬坪呈廷邸亭貞逓偵艇泥迭徹撤悼搭棟筒謄騰洞督凸屯軟尼妊忍寧把覇廃培媒賠伯舶漠肌鉢閥煩頒妃披扉罷猫賓頻瓶扶附譜侮沸雰憤丙併塀幣弊偏遍泡俸褒剖紡朴僕撲堀奔麻摩磨抹岬銘妄盲耗厄愉諭癒唯悠猶裕融庸窯羅酪痢履柳竜硫虜涼僚寮倫累塁戻鈴賄枠挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶斬恣摯餌鹿叱嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴誰旦綻緻酎貼嘲捗椎爪鶴諦溺填妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剥箸氾汎阪斑眉膝肘阜訃蔽餅璧蔑哺蜂貌頬睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇",
);
const gradeByKanjis = [[], w1_, w2_, w3_, w4_, w5_, w6_, w7_, w8_, w9_];
const w10_ = generateNonRegularKanjiList();
gradeByKanjis.push(w10_);
const kanjiGrade = {};
for (let level = 1; level < gradeByKanjis.length; level++) {
  gradeByKanjis[level].forEach((kanji) => {
    kanjiGrade[kanji] = level;
  });
}
const dirNames = [
  null,
  "小1",
  "小2",
  "小3",
  "小4",
  "小5",
  "小6",
  "中2",
  "中3",
  "常用",
  "常用外",
];
const grades = [
  null,
  "小学1年生",
  "小学2年生",
  "小学3年生",
  "小学4年生",
  "小学5年生",
  "小学6年生",
  "中学1〜2年生",
  "中学3年生",
  "常用漢字",
  "常用外漢字",
];

function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

function toKanjiId(str) {
  const hex = str.codePointAt(0).toString(16);
  return ("00000" + hex).slice(-5);
}

// function toKanji(kanjiId) {
//   return String.fromCodePoint(parseInt("0x" + kanjiId));
// }

// CC BY-SA 2.1
async function _fetchInfo(kanjiId) {
  // https://mojikiban.ipa.go.jp/search/help/api
  // https://qiita.com/RW21/items/2b21335a5ad1463e18a0
  return await fetch("https://mojikiban.ipa.go.jp/mji/q?UCS=0x" + kanjiId)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function getSingleKanjiInfoFromIPA(kanji) {
  return new Promise((resolve) => {
    const kanjiId = toKanjiId(kanji);
    fetch("https://mojikiban.ipa.go.jp/mji/q?UCS=0x" + kanjiId)
      .then((response) => response.json())
      .then((data) => resolve([kanji, data]));
  });
}

async function getKanjiInfoFromIPA() {
  const kanjiInfo = {};
  for (const kanjis of gradeByKanjis) {
    for (const kanji of kanjis) {
      await getSingleKanjiInfoFromIPA(kanji).then((res) => {
        kanjiInfo[kanji] = res;
      });
      await sleep(2000);
    }
  }
  return kanjiInfo;
}

function generateNonRegularKanjiList() {
  const list = {};
  for (let i = 1; i <= 4; i++) {
    const kanji = Deno.readTextFileSync(`jis/${i}.lst`).toString().split("\n");
    list[kanji] = true;
  }
  gradeByKanjis.forEach((kanjis) => {
    kanjis.forEach((kanji) => {
      delete list[kanji];
    });
  });
  return Object.keys(list);
}

// http://etc.dounokouno.com/bushu-search/bushu-list.html
async function getBushuInfo() {
  const bushuInfo = [];
  let i = 1;
  const fileReader = await Deno.open("bushu-list-20110425.csv");
  for await (const line of readLines(fileReader)) {
    const [kanji, _partsName, names] = line.split(",");
    bushuInfo[parseInt(i)] = [kanji.split(" "), names.split(" ")];
    i += 1;
  }
  return bushuInfo;
}

function getGradedVocab(kanji, level) {
  const filepath = "graded-vocab-ja/dist/" + level + ".csv";
  const examples = Deno.readTextFileSync(filepath).toString().split("\n")
    .map((line) => line.split(",")[0])
    .filter((word) => word.includes(kanji));
  return examples;
}

function getGradedIdioms(kanji, level) {
  const filepath = "graded-idioms-ja/dist/" + level + ".csv";
  const examples = Deno.readTextFileSync(filepath).toString().split("\n")
    .map((line) => line.split(",")[0])
    .filter((word) => word.includes(kanji));
  return examples;
}

function getGrade(word) {
  const chars = word.split("");
  const grades = chars.map((x) => {
    if (x in kanjiGrade) {
      return kanjiGrade[x];
    } else if (/[一-龠々]/.test(x)) {
      return 10;
    } else {
      return 0;
    }
  });
  return Math.max(...grades);
}

function getProperIdioms(words, level) {
  const examples = [];
  words.forEach((word) => {
    const grades = word.split("").map((str) => getGrade(str));
    const difficulty = grades.filter((grade) => grade >= level).length;
    if (difficulty == 1) {
      examples.push(word);
    }
  });
  return examples;
}

async function getBuildInfo() {
  const bushuInfo = await getBushuInfo();
  if (!Deno.statSync("kanji-info.json")) {
    getKanjiInfoFromIPA().then((kanjiInfo) => {
      const json = JSON.stringify(kanjiInfo, null, "\t");
      Deno.writeTextFileSync("kanji-info.json", json);
    });
  }
  const kanjiInfo = JSON.parse(Deno.readTextFileSync("kanji-info.json"));
  const buildInfo = {};
  for (const [kanji, info] of Object.entries(kanjiInfo)) {
    if (!info[1]["results"]) { // 部首は除外
      continue;
    }
    buildInfo[kanji] = {};
    const b = buildInfo[kanji];
    const level = getGrade(kanji);
    if (level <= 0) {
      console.log("error1: " + kanji);
      continue;
    }
    const vocab = getGradedVocab(kanji, level).filter((word) =>
      !/^[一-龠々]+$/.test(word)
    );
    const idioms = getGradedIdioms(kanji, level);
    const examples = getProperIdioms(idioms.concat(vocab), level);
    b["dir"] = dirNames[level];
    b["学年"] = grades[level];
    // 字体によって読み方や画数が異なるため、基準となる漢字 (包摂区分 "0") を参照するようにする
    const results = kanjiInfo[kanji][1]["results"];
    for (let i = 0; i < results.length; i++) {
      const jisx0213 = results[i]["JISX0213"];
      if (jisx0213 && jisx0213["包摂区分"] == "0") {
        if ("読み" in results[i]) {
          const onyomi = results[i]["読み"]["音読み"];
          const kunyomi = results[i]["読み"]["訓読み"];
          if (onyomi) {
            b["音読み"] = onyomi;
          } else {
            b["音読み"] = [];
          }
          if (kunyomi) {
            b["訓読み"] = kunyomi;
          } else {
            b["訓読み"] = [];
          }
          b["総画数"] = results[i]["総画数"];
          const bushuId = info[1]["results"][0]["部首内画数"][0]["部首"];
          const [bushu, bushuName] = bushuInfo[bushuId];
          b["部首"] = bushu;
          b["部首名"] = bushuName;
          b["用例"] = vocab;
          b["熟語"] = idioms;
          b["学年例"] = examples;
          break;
        } else {
          console.log("error2: " + kanji);
        }
      }
    }
  }
  return buildInfo;
}

function notFoundSvg() {
  return `
<svg role="img" aria-label="未発見" xmlns="http://www.w3.org/2000/svg" fill="red" width="64" height="64" viewBox="0 0 16 16">
  <title>未発見</title>
  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
</svg>
`;
}

function replaceSize(text, width, height) {
  return text
    .replace('width="100"', `width="${width}"`)
    .replace('height="100"', `height="${height}"`) + "\n";
}

function getAncientSvgs(kanji) {
  const kinbun = ttf2svg("fonts/syunju102/Shunju-tsu-kyoiku.ttf", kanji) ||
    notFoundSvg();
  const reisho = ttf2svg("fonts/aoyagireisyosimo_ttf_2_01.ttf", kanji) ||
    notFoundSvg();
  const sousho = ttf2svg("fonts/KouzanBrushFontSousyo.ttf", kanji) ||
    notFoundSvg();
  const gyousho = ttf2svg("fonts/衡山毛筆フォント行書.ttf", kanji) ||
    notFoundSvg();
  return {
    "古代文字": replaceSize(kinbun, 64, 64),
    "隷書": replaceSize(reisho, 64, 64),
    "草書": replaceSize(sousho, 64, 64),
    "行書": replaceSize(gyousho, 64, 64),
  };
}

function toLinks(idioms) {
  let html = "\n";
  for (let i = 0; i < idioms.length; i++) {
    const url = "https://www.google.com/search?q=" + idioms[i] + "とは";
    html += `<a href="${url}" target="_blank" rel="noopener noreferer">${
      idioms[i]
    }</a>\n`;
  }
  return html;
}

// TODO: ルビ
let buildInfo;
try {
  buildInfo = JSON.parse(Deno.readTextFileSync("build-info.json"));
} catch {
  buildInfo = await getBuildInfo();
  const json = JSON.stringify(buildInfo, null, "\t");
  Deno.writeTextFileSync("build-info.json", json);
}

const eta = new Eta({ views: ".", cache: true });
for (let level = 1; level < gradeByKanjis.length; level++) {
  const dir = "src/" + dirNames[level];
  Deno.mkdirSync(dir, { recursive: true });
  for (const kanji of gradeByKanjis[level]) {
    if (buildInfo[kanji]) {
      const kanjiId = toKanjiId(kanji);
      const ancientSvgs = getAncientSvgs(kanji);
      const info = buildInfo[kanji];
      const html = eta.render("page.eta", {
        kanji: kanji,
        kanjiId: kanjiId,
        info: info,
        ancientSvgs: ancientSvgs,
        examples1: toLinks(info["用例"].slice(0, 10)),
        examples2: toLinks(info["熟語"].slice(0, 10)),
        examples3: toLinks(info["学年例"].slice(0, 10)),
      });
      const kanjiDir = dir + "/" + kanji;
      Deno.mkdirSync(kanjiDir, { recursive: true });
      Deno.writeTextFileSync(kanjiDir + "/index.html", html);
    }
  }
}
