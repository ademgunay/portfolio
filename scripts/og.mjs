import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <circle cx="1000" cy="160" r="260" fill="#8957e5" opacity="0.25"/>
  <text x="80" y="200" font-family="Menlo, monospace" font-size="32" fill="#7ee787">$ whoami</text>
  <text x="80" y="310" font-family="Helvetica, Arial" font-size="96" font-weight="700" fill="#e6edf3">Adem Gunay</text>
  <text x="80" y="390" font-family="Helvetica, Arial" font-size="42" fill="#58a6ff">Lead Frontend Engineer · Android &amp; Flutter</text>
  <text x="80" y="540" font-family="Menlo, monospace" font-size="28" fill="#8b949e">// Bangkok, Thailand</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('wrote public/og-image.png');
