import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const W = 1200
const H = 630

// 5x7 bitmap font (rows are 5 bits wide)
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
}

function drawText(buf, x0, y0, text, scale, r, g, b, alpha) {
  let cursor = x0
  for (const ch of text) {
    const glyph = FONT[ch]
    if (!glyph) {
      cursor += 4 * scale
      continue
    }
    for (let row = 0; row < 7; row++) {
      const bits = glyph[row]
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) {
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              const px = cursor + col * scale + sx
              const py = y0 + row * scale + sy
              if (px >= 0 && px < W && py >= 0 && py < H) {
                const idx = (py * W + px) * 4
                buf[idx] = r
                buf[idx + 1] = g
                buf[idx + 2] = b
                buf[idx + 3] = alpha
              }
            }
          }
        }
      }
    }
    cursor += 7 * scale
  }
}

const raw = Buffer.alloc(W * H * 4)

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4
    // vertical gradient
    const t = y / H
    const v = 8 + t * 10
    raw[idx] = v
    raw[idx + 1] = v + 1
    raw[idx + 2] = v + 2
    raw[idx + 3] = 255
    // grid lines
    const grid = 60
    if (x % grid === 0 || y % grid === 0) {
      raw[idx] = Math.min(raw[idx] + 8, 60)
      raw[idx + 1] = Math.min(raw[idx + 1] + 9, 60)
      raw[idx + 2] = Math.min(raw[idx + 2] + 10, 60)
    }
  }
}

// central glow
const cx = W / 2
const cy = H / 2 - 30
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const d = Math.hypot(x - cx, y - cy)
    if (d < 420) {
      const fade = 1 - d / 420
      const idx = (y * W + x) * 4
      raw[idx] = Math.min(raw[idx] + 20 * fade, 60)
      raw[idx + 1] = Math.min(raw[idx + 1] + 26 * fade, 70)
      raw[idx + 2] = Math.min(raw[idx + 2] + 30 * fade, 78)
    }
  }
}

// Y monogram (large)
drawText(raw, cx - 30, cy - 28, 'Y', 12, 0, 229, 255, 255)

// YEON title
drawText(raw, cx - 140, cy + 90, 'YEON', 8, 229, 233, 238, 255)

// subtitle
drawText(raw, cx - 250, cy + 170, 'DEVELOPER', 4, 154, 163, 171, 255)
drawText(raw, cx - 60, cy + 170, 'DISCORD', 4, 154, 163, 171, 255)
drawText(raw, cx + 95, cy + 170, 'SECURITY', 4, 154, 163, 171, 255)

// decode: strip filter bytes
const stride = W * 4
const filtered = Buffer.alloc(stride * H + H)
for (let y = 0; y < H; y++) {
  filtered[y * (stride + 1)] = 0
  raw.copy(filtered, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
}

// chunks
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  const crcTable = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crcTable[n] = c >>> 0
  }
  let crc = 0xffffffff
  for (const b of Buffer.concat([typeBuf, data])) {
    crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8)
  }
  crcBuf.writeUInt32BE((crc ^ 0xffffffff) >>> 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // RGBA
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(filtered, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

writeFileSync('public/og-cover.png', png)
console.log('og-cover.png written', png.length, 'bytes')
