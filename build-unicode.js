import { Eta } from "https://deno.land/x/eta@v3.1.1/src/index.ts";

const charts = [
  {
    dir: "ExtA",
    name: "CJK統合漢字拡張A",
    range: [Number(0x3400), Number(0x4DBF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡A に収録されている文字の一覧です。",
    lead:
      `CJK統合漢字拡張A は基本多言語面 (第0面) の <span id="range">U+3400-4DBF</span> の範囲に定義されています。`,
  },
  {
    dir: "URO1",
    name: "CJK統合漢字 (4E00-62FF)",
    range: [Number(0x4E00), Number(0x62FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+4E00-62FF (1/4) に収録されている文字の一覧です。",
    lead:
      `CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。`,
  },
  {
    dir: "URO2",
    name: "CJK統合漢字 (6300-77FF)",
    range: [Number(0x6300), Number(0x77FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+6300-77FF (2/4) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  {
    dir: "URO3",
    name: "CJK統合漢字 (7800-8CFF)",
    range: [Number(0x7800), Number(0x8CFF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+7800-8CFF (3/4) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  {
    dir: "URO4",
    name: "CJK統合漢字 (8D00-9FFF)",
    range: [Number(0x8D00), Number(0x9FFF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+8D00-9FFF (4/4) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  {
    dir: "CI",
    name: "CJK互換漢字",
    range: [Number(0xF900), Number(0xFAD9)],
    description:
      "Unicode のブロックの1つである CJK互換漢字に収録されている文字の一覧です。",
    lead:
      "CJK互換漢字は基本多言語面 (第0面) の U+F900-FAFF の範囲に定義されています。",
  },
  {
    dir: "ExtB1",
    name: "CJK統合漢字拡張B (20000-215FF)",
    range: [Number(0x20000), Number(0x215FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+20000-215FF (1/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB2",
    name: "CJK統合漢字拡張B (21600-230FF)",
    range: [Number(0x21600), Number(0x230FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+21600-230FF (2/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB3",
    name: "CJK統合漢字拡張B (23100-245FF)",
    range: [Number(0x23100), Number(0x245FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+23100-245FF (3/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB4",
    name: "CJK統合漢字拡張B (24600-260FF)",
    range: [Number(0x24600), Number(0x260FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+24600-260FF (4/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB5",
    name: "CJK統合漢字拡張B (26100-275FF)",
    range: [Number(0x26100), Number(0x275FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+26100-275FF (5/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB6",
    name: "CJK統合漢字拡張B (27600-290FF)",
    range: [Number(0x27600), Number(0x290FF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+27600-290FF (6/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtB7",
    name: "CJK統合漢字拡張B (29100-2A6DF)",
    range: [Number(0x29100), Number(0x2A6DF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+29100-2A6DF (7/7) に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  {
    dir: "ExtC",
    name: "CJK統合漢字拡張C",
    range: [Number(0x2A700), Number(0x2B739)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張C に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張C は追加漢字面 (第2面) の U+2A700-2B739 の範囲に定義されています。",
  },
  {
    dir: "ExtD",
    name: "CJK統合漢字拡張D",
    range: [Number(0x2B740), Number(0x2B81D)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張D に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張D は追加漢字面 (第2面) の U+2B740-2B81D の範囲に定義されています。",
  },
  {
    dir: "ExtE",
    name: "CJK統合漢字拡張E",
    range: [Number(0x2B820), Number(0x2CEA1)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張E に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張E は追加漢字面 (第2面) の U+2B820-2CEA1 の範囲に定義されています。",
  },
  {
    dir: "ExtF",
    name: "CJK統合漢字拡張F",
    range: [Number(0x2CEB0), Number(0x2EBE0)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張F に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張F は追加漢字面 (第2面) の U+2CEB0-2EBE0 の範囲に定義されています。",
  },
  {
    dir: "ExtI",
    name: "CJK統合漢字拡張I",
    range: [Number(0x2EBF0), Number(0x2EE5D)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張I に収録されている文字の一覧です。",
    lead:
      "CJK統合漢字拡張I は追加漢字面 (第2面) の U+2EBF0-2EE5D の範囲に定義されています。",
  },
  {
    dir: "CIS",
    name: "CJK互換漢字補助",
    range: [Number(0x2F800), Number(0x2FA1D)],
    description:
      "Unicode のブロックの1つである CJK互換漢字補助に収録されている文字の一覧です。",
    lead:
      "CJK互換漢字補助 は追加漢字面 (第2面) の U+2F800-2FA1D の範囲に定義されています。",
  },
  {
    dir: "ExtG",
    name: "CJK統合漢字拡張G",
    range: [Number(0x30000), Number(0x3134A)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張G に収録されている文字の一覧です。",
    lead:
      "CJK互換漢字補助 は第三漢字面 (第3面) の U+30000-3134A の範囲に定義されています。",
  },
  {
    dir: "ExtH",
    name: "CJK統合漢字拡張H",
    range: [Number(0x31350), Number(0x323AF)],
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張H に収録されている文字の一覧です。",
    lead:
      "CJK互換漢字補助 は第三漢字面 (第3面) の U+31350-323AF の範囲に定義されています。",
  },
];

function getTable(from, to) {
  let html = "";
  const n = Math.ceil((to - from) / 16);
  for (let i = 0; i < n; i++) {
    const positionHex = (from + i * 16).toString(16).toUpperCase();
    html += `<tr><th>${positionHex}</th>`;
    for (let j = 0; j < 16; j++) {
      const code = from + i * 16 + j;
      const hex = code.toString(16).toUpperCase();
      const kanji = String.fromCodePoint(code);
      html += `<td><a href="/kanji-dict/glyph/?q=U+${hex}">${kanji}</a></td>`;
    }
    html += "</tr>\n";
  }
  return html;
}

function getFontFace(dir, from, to, i) {
  const hexFrom = from.toString(16).toUpperCase();
  const hexTo = to.toString(16).toUpperCase();
  return `
@font-face {
  font-family:jigmo;
  src:url("/kanji-dict/unicode/${dir}.${i}.woff2") format("woff2");
  font-display:swap;
  unicode-range: U+${hexFrom}-${hexTo};
}
`;
}

function getFontFaces(dir, from, to, splitRange) {
  let style = "";
  for (let i = 1; i <= splitRange.length; i++) {
    const rangeFrom = from + splitRange[i - 1];
    const rangeTo = from + splitRange[i];
    if (rangeTo < to) {
      if (i == splitRange.length) {
        style += getFontFace(dir, rangeFrom, to, i);
      } else {
        style += getFontFace(dir, rangeFrom, rangeTo, i);
      }
    } else {
      style += getFontFace(dir, rangeFrom, to, i);
      break;
    }
  }
  return style;
}

const splitRange = [0, 64, 128, 256, 512, 1024, 2048];
const eta = new Eta({ views: ".", cache: true });
charts.forEach((chart) => {
  const dir = `src/unicode/${chart.dir}`;
  Deno.mkdirSync(dir, { recursive: true });
  const [from, to] = chart.range;
  const fontFaces = getFontFaces(chart.dir, from, to, splitRange);
  const positionWidth = from.toString(16).length == 4 ? 50 : 60;
  const width = from.toString(16).length == 4 ? 451 : 461;
  const height = Math.ceil((to - from) / 16 + 1) * 25 + 1;
  const html = eta.render("unicode.eta", {
    fontFaces,
    positionWidth,
    width,
    height,
    dir: chart.dir,
    name: chart.name,
    description: chart.description,
    lead: chart.lead,
    table: getTable(from, to),
  });
  Deno.writeTextFileSync(dir + "/index.html", html);
});
