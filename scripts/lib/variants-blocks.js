// src/variants/ mirrors src/ivd/'s structure exactly (same 22 blocks,
// same sidebar), so the block table itself is reused as-is from
// ivd-blocks.js rather than duplicated. Only the description text
// differs, since this page is about the Unihan-style "異体字(別字)"
// character-to-character variant mappings (data/variants.csv, built
// by scripts/build-variants.js from cjkvi-variants and friends) —
// not the Jigmo IVS glyphs src/ivd/ shows.

import {
  blockInfo as ivdBlockInfo,
  blocks,
  getBlock,
  sidebarRows,
} from "./ivd-blocks.js";

export { blocks, getBlock, sidebarRows };

export const blockInfo = Object.fromEntries(
  Object.entries(ivdBlockInfo).map(([key, info]) => [
    key,
    {
      name: info.name,
      description: info.description.replace("異体字(IVS)", "異体字(別字)"),
      lead: info.lead,
    },
  ]),
);
