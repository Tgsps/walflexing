// Generates the PWA / Apple-touch PNG icons with zero external dependencies.
// A gold crescent (Istanbul vibe) on the brand emerald-green background.
// Output: public/pwa-192x192.png, pwa-512x512.png, maskable-512x512.png, apple-touch-icon.png
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

// ---- minimal PNG encoder ----------------------------------------------------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- drawing ----------------------------------------------------------------
const GREEN = [6, 45, 35];
const GREEN_2 = [10, 65, 50];
const GOLD = [196, 148, 24];

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// Anti-aliased coverage of a disc at pixel (px,py) via 3x3 supersampling.
function discCoverage(px, py, cx, cy, r) {
  let hit = 0;
  for (let sy = 0; sy < 3; sy++) {
    for (let sx = 0; sx < 3; sx++) {
      const x = px + (sx + 0.5) / 3;
      const y = py + (sy + 0.5) / 3;
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) hit++;
    }
  }
  return hit / 9;
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size * 0.5;
  const cy = size * 0.5;
  const R = size * 0.3; // outer disc
  const carveCx = cx + size * 0.12;
  const carveCy = cy - size * 0.02;
  const carveR = size * 0.255; // carving disc -> crescent
  const starCx = cx + size * 0.17;
  const starCy = cy - size * 0.13;
  const starR = size * 0.05;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // background: subtle vertical gradient green -> green-2
      const bg = mix(GREEN, GREEN_2, y / size);
      let col = bg;

      // crescent = outer disc minus carve disc
      const outer = discCoverage(x, y, cx, cy, R);
      const carve = discCoverage(x, y, carveCx, carveCy, carveR);
      let goldCov = Math.max(0, outer - carve);

      // little star accent
      const star = discCoverage(x, y, starCx, starCy, starR);
      goldCov = Math.max(goldCov, star);

      if (goldCov > 0) col = mix(bg, GOLD, goldCov);

      const i = (y * size + x) * 4;
      rgba[i] = col[0];
      rgba[i + 1] = col[1];
      rgba[i + 2] = col[2];
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

const targets = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['maskable-512x512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of targets) {
  const png = drawIcon(size);
  writeFileSync(join(publicDir, name), png);
  console.log(`✓ ${name} (${size}x${size}, ${png.length} bytes)`);
}
