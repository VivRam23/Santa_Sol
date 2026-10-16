// Build-time helpers for images and logos in /public.
// A missing file renders as a labelled placeholder instead of a broken image,
// so the page builds before every photo has been exported.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');

export interface Asset {
  src: string;
  width: number;
  height: number;
}

/** Reads width and height from a JPEG or PNG header. No dependencies. */
function rasterSize(buf: Buffer): { width: number; height: number } | null {
  // PNG: IHDR starts at byte 16.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk markers until a start-of-frame (SOF0–SOF15, except DHT/JPG/DAC).
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const length = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + length;
    }
  }
  return null;
}

/** Reads width and height from an SVG viewBox (or width/height attributes). */
function svgSize(text: string): { width: number; height: number } | null {
  const vb = text.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
  const w = text.match(/\swidth="([\d.]+)/);
  const h = text.match(/\sheight="([\d.]+)/);
  return w && h ? { width: Math.round(+w[1]), height: Math.round(+h[1]) } : null;
}

/** Looks up /public/<folder>/<file>. Returns null when the file has not been added yet. */
export function asset(folder: 'images' | 'brand', file: string): Asset | null {
  const path = join(PUBLIC, folder, file);
  if (!existsSync(path)) return null;
  const size = file.endsWith('.svg')
    ? svgSize(readFileSync(path, 'utf8'))
    : rasterSize(readFileSync(path));
  if (!size) return null;
  return { src: `/${folder}/${file}`, ...size };
}
