/**
 * Generates app icons from public/originalIcon.jpeg.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const source = path.join(rootDir, "public", "originalIcon.jpeg");
const iconsDir = path.join(rootDir, "public", "icons");
const favicon = path.join(rootDir, "public", "favicon.png");

if (!existsSync(source)) {
  throw new Error(`Missing source logo: ${source}`);
}

const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$source = ${JSON.stringify(source)}
$iconsDir = ${JSON.stringify(iconsDir)}
$favicon = ${JSON.stringify(favicon)}
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

function Save-SquarePng([string]$path, [int]$size) {
  $src = [System.Drawing.Image]::FromFile($source)
  try {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($src, 0, 0, $size, $size)
      } finally {
        $g.Dispose()
      }
      $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $src.Dispose()
  }
}

Save-SquarePng $favicon 64
Save-SquarePng (Join-Path $iconsDir 'icon-192.png') 192
Save-SquarePng (Join-Path $iconsDir 'icon-512.png') 512
Save-SquarePng (Join-Path $iconsDir 'apple-touch-icon.png') 180
`;

execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script], {
  stdio: "inherit",
});

console.log("App icons generated from public/originalIcon.jpeg.");
