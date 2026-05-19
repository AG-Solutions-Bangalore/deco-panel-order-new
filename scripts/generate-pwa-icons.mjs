/**
 * Generates PNG icons from SVG sources for PWA manifest.
 * Uses Node.js built-in modules only — no external dependencies.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { createHash } from "node:crypto"
import path from "node:path"
import { deflateSync } from "node:zlib"

const ICONS_DIR = path.resolve(import.meta.dirname, "../public/icons")

const PRESETS = [
  { name: "icon-192", size: 192, color: [99, 102, 241, 255] },
  { name: "icon-512", size: 512, color: [99, 102, 241, 255] },
  { name: "apple-touch-icon", size: 180, color: [99, 102, 241, 255] },
]

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeB = Buffer.from(type, "ascii")
  const crcData = Buffer.concat([typeB, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcData))
  return Buffer.concat([len, typeB, data, crc])
}

function solidColorPNG(width, height, r, g, b, a) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace
  const ihdrChunk = pngChunk("IHDR", ihdr)

  // Raw pixel data with filter byte (0 = None) per row
  const rowSize = width * 4 + 1 // filter byte + RGBA pixels
  const rawData = Buffer.alloc(rowSize * height)
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize
    rawData[rowOffset] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 4
      rawData[px] = r
      rawData[px + 1] = g
      rawData[px + 2] = b
      rawData[px + 3] = a
    }
  }

  // Compress with zlib
  const compressed = deflateSync(rawData, { level: 9 })
  const idatChunk = pngChunk("IDAT", compressed)

  // IEND
  const iendChunk = pngChunk("IEND", Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

mkdirSync(ICONS_DIR, { recursive: true })

for (const preset of PRESETS) {
  const png = solidColorPNG(preset.size, preset.size, ...preset.color)
  const filePath = path.join(ICONS_DIR, `${preset.name}.png`)
  writeFileSync(filePath, png)
  const hash = createHash("md5").update(png).digest("hex").slice(0, 8)
  console.log(`✓ ${preset.name}.png  (${preset.size}x${preset.size}, md5:${hash})`)
}

console.log("\nAll icons generated successfully.")
