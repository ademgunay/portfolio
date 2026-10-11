// Usage: node scripts/placeholder.mjs <slug> "<App Name>" <#hex>
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [slug, name, hex] = process.argv.slice(2);
if (!slug || !name || !/^#[0-9a-f]{6}$/i.test(hex ?? '')) {
  console.error('Usage: node scripts/placeholder.mjs <slug> "<App Name>" <#hex>');
  process.exit(1);
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="585" height="1266">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${hex}"/><stop offset="1" stop-color="#0d1117"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Helvetica, Arial" font-size="44" font-weight="700" fill="#e6edf3">${esc(name)}</text>
</svg>`;
const dir = `src/assets/apps/${slug}`;
mkdirSync(dir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(`${dir}/placeholder.png`);
console.log(`wrote ${dir}/placeholder.png`);
