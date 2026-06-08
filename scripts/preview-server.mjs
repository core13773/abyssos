// Standalone card preview server — bypasses Next.js for reliable SVG serving
import { createServer } from 'http';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const IMAGES = join(PUBLIC, 'images');

const MONSTERS_DIR = join(IMAGES, 'monsters');
const GATEKEEPERS_DIR = join(IMAGES, 'gatekeepers');
const GUARDIANS_DIR = join(IMAGES, 'guardians');

function listSvgs(dir) { return readdirSync(dir).filter(f => f.endsWith('.svg')).sort(); }

const monsterFiles = listSvgs(MONSTERS_DIR);
const gatekeeperFiles = listSvgs(GATEKEEPERS_DIR);
const guardianFiles = listSvgs(GUARDIANS_DIR);

function svgToDataUri(path) {
  const svg = readFileSync(path, 'utf-8');
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function cardSection(title, emoji, files, dir) {
  const cards = files.map((f, i) => {
    const uri = svgToDataUri(join(dir, f));
    const name = f.replace('.svg', '');
    return `<div class="card">
      <img src="${uri}" alt="${name}" loading="lazy">
      <div class="info">${i+1}. ${name}</div>
    </div>`;
  }).join('\n');
  return `<h2>${emoji} ${title} (${files.length})</h2><div class="grid">${cards}</div>`;
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Abyssos Card Preview (Standalone)</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a10; color: #e7e5e4; font-family: Georgia, serif; padding: 20px; }
  h1 { text-align: center; font-size: 28px; color: #f0d060; margin-bottom: 20px; }
  h2 { font-size: 20px; color: #daa520; margin: 36px 0 14px; border-bottom: 1px solid #292524; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; max-width: 1400px; margin: 0 auto; }
  .card { display: flex; flex-direction: column; align-items: center; transition: transform 0.2s; }
  .card:hover { transform: translateY(-4px); }
  .card img { width: 100%; max-width: 300px; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); }
  .info { margin-top: 6px; font-size: 12px; color: #78716c; text-align: center; }
  @media (max-width: 600px) { .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; } body { padding: 10px; } }
</style>
</head>
<body>
<h1>🔥 Abyssos v4.0 — Card Preview</h1>
<p style="text-align:center;color:#78716c;margin-bottom:24px;font-size:13px">
  👾 Monster ${monsterFiles.length} + 👹 Gatekeeper ${gatekeeperFiles.length} + ✨ Guardian ${guardianFiles.length} = ${monsterFiles.length + gatekeeperFiles.length + guardianFiles.length} Cards
  <br><small>SVG embedded as data URIs — no server requests needed</small>
</p>
${cardSection('Monster Cards', '👾', monsterFiles, MONSTERS_DIR)}
${cardSection('Gatekeeper Cards', '👹', gatekeeperFiles, GATEKEEPERS_DIR)}
${cardSection('Guardian Cards', '✨', guardianFiles, GUARDIANS_DIR)}
</body>
</html>`;

const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/preview') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`\n🔥 Card Preview Server running at:  http://localhost:${PORT}\n`);
  console.log(`   👾 Monsters:    ${monsterFiles.length} cards`);
  console.log(`   👹 Gatekeepers: ${gatekeeperFiles.length} cards`);
  console.log(`   ✨ Guardians:   ${guardianFiles.length} cards`);
  console.log(`   📦 Total:       ${monsterFiles.length + gatekeeperFiles.length + guardianFiles.length} cards`);
  console.log(`\n   Open http://localhost:${PORT} in your browser.\n`);
});
