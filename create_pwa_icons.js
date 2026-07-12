const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  const table = Array.from({ length: 256 }, (_, i) => {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });

  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  const out = Buffer.alloc(4);
  out.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 0);
  return out;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuf, data]));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createPng(path, width, height, rgba) {
  const pixels = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const offset = y * (width * 4 + 1);
    pixels[offset] = 0;
    for (let x = 0; x < width; x++) {
      const i = offset + 1 + x * 4;
      pixels[i] = rgba[0];
      pixels[i + 1] = rgba[1];
      pixels[i + 2] = rgba[2];
      pixels[i + 3] = rgba[3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const data = zlib.deflateSync(pixels);
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', data),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  fs.writeFileSync(path, png);
}

if (!fs.existsSync('public')) fs.mkdirSync('public');
createPng('public/pwa-192x192.png', 192, 192, [22, 163, 74, 255]);
createPng('public/pwa-512x512.png', 512, 512, [22, 163, 74, 255]);
console.log('Created placeholder PWA icons');
