// Canonical block ranges — copied verbatim from src/glyph.js's
// `ranges` (and the same ranges the base-kanji glyph fonts already
// use: URO1.svg, ExtB3.svg, ...) so nothing ever drifts apart.
//
// One IVD preview page is generated per block here — URO1..4 and
// ExtB1..7 are NOT merged. A single merged "URO" page turned out to
// be ~70MB once real Jigmo data was involved, which is exactly the
// problem this finer split avoids (worst case now is one full
// sub-block's worth of variants, capped further by CHUNK_SIZE in
// ivd-ttf2svg.js if needed).

export const blocks = [
  ["ExtA", 0x3400, 0x4DBF],
  ["URO1", 0x4E00, 0x62FF],
  ["URO2", 0x6300, 0x77FF],
  ["URO3", 0x7800, 0x8CFF],
  ["URO4", 0x8D00, 0x9FFF],
  ["CI", 0xF900, 0xFAD9],
  ["ExtB1", 0x20000, 0x215FF],
  ["ExtB2", 0x21600, 0x230FF],
  ["ExtB3", 0x23100, 0x245FF],
  ["ExtB4", 0x24600, 0x260FF],
  ["ExtB5", 0x26100, 0x275FF],
  ["ExtB6", 0x27600, 0x290FF],
  ["ExtB7", 0x29100, 0x2A6DF],
  ["ExtC", 0x2A700, 0x2B739],
  ["ExtD", 0x2B740, 0x2B81D],
  ["ExtE", 0x2B820, 0x2CEA1],
  ["ExtF", 0x2CEB0, 0x2EBE0],
  ["ExtI", 0x2EBF0, 0x2EE5D],
  ["CIS", 0x2F800, 0x2FA1D],
  ["ExtG", 0x30000, 0x3134A],
  ["ExtH", 0x31350, 0x323AF],
  ["ExtJ", 0x323B0, 0x33479],
];

/** @returns {string | undefined} block name, e.g. "URO3" */
export function getBlock(code) {
  for (const [name, start, end] of blocks) {
    if (code >= start && code <= end) return name;
  }
  return undefined;
}

// Sidebar rows, in the same order/grouping as eta/unicode.eta's own
// sidebar table (URO1..4 share one row, ExtB1..7 share one row,
// everything else is its own row) — same reference UI, just linking
// to /kanji-dict/ivd/{block}/ instead of /kanji-dict/unicode/{block}/.
export const sidebarRows = [
  ["CJK統合漢字拡張A", ["ExtA"]],
  ["CJK統合漢字", ["URO1", "URO2", "URO3", "URO4"]],
  ["CJK互換漢字", ["CI"]],
  [
    "CJK統合漢字拡張B",
    ["ExtB1", "ExtB2", "ExtB3", "ExtB4", "ExtB5", "ExtB6", "ExtB7"],
  ],
  ["CJK統合漢字拡張C", ["ExtC"]],
  ["CJK統合漢字拡張D", ["ExtD"]],
  ["CJK統合漢字拡張E", ["ExtE"]],
  ["CJK統合漢字拡張F", ["ExtF"]],
  ["CJK統合漢字拡張I", ["ExtI"]],
  ["CJK互換漢字補助", ["CIS"]],
  ["CJK統合漢字拡張G", ["ExtG"]],
  ["CJK統合漢字拡張H", ["ExtH"]],
  ["CJK統合漢字拡張J", ["ExtJ"]],
];

// Per-block display text for the <h1>/description paragraph, mirroring
// scripts/unicode-html.js's `charts` table (same block names, same
// "lead" sentences about which plane/range each Unicode block is
// officially defined in) but with a `description` adapted to what
// this page actually shows: IVS variants, not the block's plain
// character list.
export const blockInfo = {
  ExtA: {
    name: "CJK統合漢字拡張A",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張A に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張A は基本多言語面 (第0面) の U+3400-4DBF の範囲に定義されています。",
  },
  URO1: {
    name: "CJK統合漢字 (4E00-62FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+4E00-62FF (1/4) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  URO2: {
    name: "CJK統合漢字 (6300-77FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+6300-77FF (2/4) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  URO3: {
    name: "CJK統合漢字 (7800-8CFF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+7800-8CFF (3/4) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  URO4: {
    name: "CJK統合漢字 (8D00-9FFF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字のうち、U+8D00-9FFF (4/4) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字は基本多言語面 (第0面) の U+4E00-99FF の範囲に定義されています。",
  },
  CI: {
    name: "CJK互換漢字",
    description:
      "Unicode のブロックの1つである CJK互換漢字に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK互換漢字は基本多言語面 (第0面) の U+F900-FAD9 の範囲に定義されています。",
  },
  ExtB1: {
    name: "CJK統合漢字拡張B (20000-215FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+20000-215FF (1/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB2: {
    name: "CJK統合漢字拡張B (21600-230FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+21600-230FF (2/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB3: {
    name: "CJK統合漢字拡張B (23100-245FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+23100-245FF (3/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB4: {
    name: "CJK統合漢字拡張B (24600-260FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+24600-260FF (4/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB5: {
    name: "CJK統合漢字拡張B (26100-275FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+26100-275FF (5/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB6: {
    name: "CJK統合漢字拡張B (27600-290FF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+27600-290FF (6/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtB7: {
    name: "CJK統合漢字拡張B (29100-2A6DF)",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張B のうち、U+29100-2A6DF (7/7) に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張B は追加漢字面 (第2面) の U+20000-2A6DF の範囲に定義されています。",
  },
  ExtC: {
    name: "CJK統合漢字拡張C",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張C に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張C は追加漢字面 (第2面) の U+2A700-2B73F の範囲に定義されています。",
  },
  ExtD: {
    name: "CJK統合漢字拡張D",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張D に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張D は追加漢字面 (第2面) の U+2B740-2B81D の範囲に定義されています。",
  },
  ExtE: {
    name: "CJK統合漢字拡張E",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張E に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張E は追加漢字面 (第2面) の U+2B820-2CEAD の範囲に定義されています。",
  },
  ExtF: {
    name: "CJK統合漢字拡張F",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張F に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張F は追加漢字面 (第2面) の U+2CEB0-2EBE0 の範囲に定義されています。",
  },
  ExtI: {
    name: "CJK統合漢字拡張I",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張I に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張I は追加漢字面 (第2面) の U+2EBF0-2EE5D の範囲に定義されています。",
  },
  CIS: {
    name: "CJK互換漢字補助",
    description:
      "Unicode のブロックの1つである CJK互換漢字補助に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK互換漢字補助 は追加漢字面 (第2面) の U+2F800-2FA1D の範囲に定義されています。",
  },
  ExtG: {
    name: "CJK統合漢字拡張G",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張G に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張G は第三漢字面 (第3面) の U+30000-3134A の範囲に定義されています。",
  },
  ExtH: {
    name: "CJK統合漢字拡張H",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張H に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張H は第三漢字面 (第3面) の U+31350-323AF の範囲に定義されています。",
  },
  ExtJ: {
    name: "CJK統合漢字拡張J",
    description:
      "Unicode のブロックの1つである CJK統合漢字拡張J に含まれる漢字の異体字(IVS)一覧です。",
    lead:
      "CJK統合漢字拡張J は第三漢字面 (第3面) の U+323B0-33479 の範囲に定義されています。",
  },
};
