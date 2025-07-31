async function getCharBuffer(char) {
  const size = 4;
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.font = `${size}px sans-serif`;
  ctx.fillStyle = "white";
  ctx.fillText(char, 0, size);
  const blob = await canvas.convertToBlob();
  const buffer = await blob.arrayBuffer();
  return buffer;
}

function buffersEqual(a, b) {
  if (!a || !b) return false;
  if (a.byteLength !== b.byteLength) return false;
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  for (let i = 0; i < va.length; i++) {
    if (va[i] !== vb[i]) return false;
  }
  return true;
}

let cachedRefBuffer = null;

self.onmessage = async (e) => {
  if (!cachedRefBuffer) {
    cachedRefBuffer = await getCharBuffer("\uffff");
  }
  const { chars } = e.data;
  const results = await Promise.all(
    chars.map(async (char) => {
      const buf = await getCharBuffer(char);
      const supported = !buffersEqual(buf, cachedRefBuffer);
      return { char, supported };
    }),
  );
  self.postMessage(results);
};
