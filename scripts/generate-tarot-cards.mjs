/**
 * Golden Premium Tarot Card Generator
 * Generates 22 Major Arcana SVG cards with ornate golden frames and unique symbolic art.
 * Style: Medieval woodcut × Golden foil × Dante's Inferno
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'tarot');

const W = 750;
const H = 1050;

// ─── Card Data ───────────────────────────────────────────────────────────
const CARDS = [
  { n:0,  roman:'0',    name:'광대',       en:'The Fool',           symbol:'fool' },
  { n:1,  roman:'I',    name:'마법사',     en:'The Magician',       symbol:'magician' },
  { n:2,  roman:'II',   name:'여사제',     en:'The High Priestess', symbol:'priestess' },
  { n:3,  roman:'III',  name:'여황제',     en:'The Empress',        symbol:'empress' },
  { n:4,  roman:'IV',   name:'황제',       en:'The Emperor',        symbol:'emperor' },
  { n:5,  roman:'V',    name:'교황',       en:'The Hierophant',     symbol:'hierophant' },
  { n:6,  roman:'VI',   name:'연인',       en:'The Lovers',         symbol:'lovers' },
  { n:7,  roman:'VII',  name:'전차',       en:'The Chariot',        symbol:'chariot' },
  { n:8,  roman:'VIII', name:'힘',         en:'Strength',           symbol:'strength' },
  { n:9,  roman:'IX',   name:'은둔자',     en:'The Hermit',         symbol:'hermit' },
  { n:10, roman:'X',    name:'운명의 수레바퀴', en:'Wheel of Fortune', symbol:'wheel' },
  { n:11, roman:'XI',   name:'정의',       en:'Justice',            symbol:'justice' },
  { n:12, roman:'XII',  name:'매달린 남자', en:'The Hanged Man',    symbol:'hanged' },
  { n:13, roman:'XIII', name:'죽음',       en:'Death',              symbol:'death' },
  { n:14, roman:'XIV',  name:'절제',       en:'Temperance',         symbol:'temperance' },
  { n:15, roman:'XV',   name:'악마',       en:'The Devil',          symbol:'devil' },
  { n:16, roman:'XVI',  name:'탑',         en:'The Tower',          symbol:'tower' },
  { n:17, roman:'XVII', name:'별',         en:'The Star',           symbol:'star' },
  { n:18, roman:'XVIII',name:'달',         en:'The Moon',           symbol:'moon' },
  { n:19, roman:'XIX',  name:'태양',       en:'The Sun',            symbol:'sun' },
  { n:20, roman:'XX',   name:'심판',       en:'Judgement',          symbol:'judgement' },
  { n:21, roman:'XXI',  name:'세계',       en:'The World',          symbol:'world' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── Shared SVG Header / Footer ──────────────────────────────────────────
function svgWrap(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <!-- Gold gradient -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0d060"/>
      <stop offset="25%" stop-color="#daa520"/>
      <stop offset="50%" stop-color="#f5e6a0"/>
      <stop offset="75%" stop-color="#b8860b"/>
      <stop offset="100%" stop-color="#f0d060"/>
    </linearGradient>
    <linearGradient id="goldV" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#f5e6a0"/>
      <stop offset="30%" stop-color="#daa520"/>
      <stop offset="60%" stop-color="#b8860b"/>
      <stop offset="100%" stop-color="#f0d060"/>
    </linearGradient>
    <linearGradient id="goldSubtle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a08030"/>
      <stop offset="50%" stop-color="#c4a040"/>
      <stop offset="100%" stop-color="#a08030"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0805"/>
      <stop offset="40%" stop-color="#14100a"/>
      <stop offset="100%" stop-color="#0a0805"/>
    </linearGradient>
    <linearGradient id="centerGlow" x1="50%" y1="50%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b8860b" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#0a0805" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#daa520" stop-opacity="0.15"/>
      <stop offset="60%" stop-color="#0a0805" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#0a0805" stop-opacity="0.8"/>
    </radialGradient>

    <!-- Drop shadow filter -->
    <filter id="goldShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#daa520" flood-opacity="0.4"/>
    </filter>
    <filter id="innerShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
      <feOffset dx="0" dy="0"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
      <feFlood flood-color="#000" flood-opacity="0.6"/>
      <feComposite in2="shadowDiff" operator="in"/>
      <feComposite in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>

  <!-- Dark background with subtle texture dots -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <g opacity="0.03">
    ${Array.from({length:200}, (_,i) => {
      const x = (i * 173) % W;
      const y = (i * 311) % H;
      return `<circle cx="${x}" cy="${y}" r="${1 + (i%3)}" fill="#daa520"/>`;
    }).join('')}
  </g>

  ${inner}
</svg>`;
}

// ─── Golden Frame (shared across all cards) ──────────────────────────────
function goldenFrame(roman, name, enName) {
  const M = 30; // margin
  const innerW = W - M*2;
  const innerH = H - M*2;

  return `
  <!-- Outer frame -->
  <rect x="${M}" y="${M}" width="${innerW}" height="${innerH}" rx="12" ry="12"
        fill="none" stroke="url(#gold)" stroke-width="6" filter="url(#goldShadow)"/>
  <rect x="${M+8}" y="${M+8}" width="${innerW-16}" height="${innerH-16}" rx="8" ry="8"
        fill="none" stroke="url(#goldSubtle)" stroke-width="1.5" opacity="0.6"/>

  <!-- Corner ornaments -->
  ${cornerOrnament(M+4, M+4, 1)}
  ${cornerOrnament(M+innerW-4, M+4, 2)}
  ${cornerOrnament(M+4, M+innerH-4, 3)}
  ${cornerOrnament(M+innerW-4, M+innerH-4, 4)}

  <!-- Top filigree bar -->
  <rect x="${M+20}" y="${M+4}" width="${innerW-40}" height="2" fill="url(#gold)" opacity="0.4"/>
  <!-- Bottom filigree bar -->
  <rect x="${M+20}" y="${M+innerH-6}" width="${innerW-40}" height="2" fill="url(#gold)" opacity="0.4"/>

  <!-- Roman numeral at top -->
  <text x="${W/2}" y="${M+56}" text-anchor="middle"
        font-family="'Times New Roman', 'Cinzel', serif"
        font-size="${roman.length > 4 ? '24' : '36'}" font-weight="bold"
        fill="url(#gold)" filter="url(#goldShadow)"
        letter-spacing="3">${roman}</text>

  <!-- Decorative line under numeral -->
  <line x1="${W/2-80}" y1="${M+72}" x2="${W/2+80}" y2="${M+72}"
        stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <circle cx="${W/2}" cy="${M+72}" r="3" fill="url(#gold)" opacity="0.7"/>

  <!-- Card name (Korean) at bottom -->
  <text x="${W/2}" y="${H-M-60}" text-anchor="middle"
        font-family="'Cinzel', serif"
        font-size="${name.length > 5 ? '26' : '32'}" font-weight="bold"
        fill="url(#goldV)" filter="url(#goldShadow)"
        letter-spacing="4">${esc(name)}</text>

  <!-- Card name (English) -->
  <text x="${W/2}" y="${H-M-28}" text-anchor="middle"
        font-family="'Cinzel', 'Times New Roman', serif"
        font-size="15" font-style="italic"
        fill="url(#goldSubtle)" opacity="0.8"
        letter-spacing="2">${esc(enName)}</text>

  <!-- Decorative pillars -->
  <rect x="${M+14}" y="${M+90}" width="1.5" height="${innerH-170}" fill="url(#gold)" opacity="0.15" rx="1"/>
  <rect x="${M+innerW-15.5}" y="${M+90}" width="1.5" height="${innerH-170}" fill="url(#gold)" opacity="0.15" rx="1"/>
  `;
}

function cornerOrnament(cx, cy, dir) {
  const s = 18;
  let path = '';
  switch(dir) {
    case 1: // top-left
      path = `M${cx} ${cy+s} Q${cx} ${cy} ${cx+s} ${cy} M${cx} ${cy+s*0.7} Q${cx+s*0.3} ${cy+s*0.3} ${cx+s*0.7} ${cy}`;
      break;
    case 2: // top-right
      path = `M${cx-s} ${cy} Q${cx} ${cy} ${cx} ${cy+s} M${cx-s*0.7} ${cy} Q${cx-s*0.3} ${cy+s*0.3} ${cx} ${cy+s*0.7}`;
      break;
    case 3: // bottom-left
      path = `M${cx} ${cy-s} Q${cx} ${cy} ${cx+s} ${cy} M${cx} ${cy-s*0.7} Q${cx+s*0.3} ${cy-s*0.3} ${cx+s*0.7} ${cy}`;
      break;
    case 4: // bottom-right
      path = `M${cx-s} ${cy} Q${cx} ${cy} ${cx} ${cy-s} M${cx-s*0.7} ${cy} Q${cx-s*0.3} ${cy-s*0.3} ${cx} ${cy-s*0.7}`;
      break;
  }
  return `<path d="${path}" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.7"/>`;
}

// ─── Card-Specific Symbol Generators ─────────────────────────────────────

function symbolFool() { return `
<g transform="translate(${W/2},${H/2 - 10})">
  <!-- Radiant sunburst behind -->
  <g opacity="0.3">
    ${Array.from({length:16}, (_,i) => {
      const a = (i/16)*Math.PI*2;
      return `<line x1="0" y1="0" x2="${Math.cos(a)*120}" y2="${Math.sin(a)*120}" stroke="#daa520" stroke-width="1"/>`;
    }).join('')}
  </g>
  <!-- Cliff edge -->
  <path d="M-80,40 L-30,-10 L30,-10 L80,40 L80,100 L-80,100 Z" fill="#1a1208" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- The Fool figure (silhouette) -->
  <path d="M-8,-30 L-12,-5 L-18,20 L-22,40 L-6,38 L-2,10 L4,10 L8,38 L22,40 L18,20 L12,-5 L8,-30 Z"
        fill="url(#gold)" opacity="0.8"/>
  <!-- Head -->
  <circle cx="0" cy="-40" r="14" fill="url(#gold)" opacity="0.85"/>
  <!-- Hat / cap -->
  <path d="M-14,-42 L0,-65 L14,-42" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.7"/>
  <!-- Small dog -->
  <path d="M28,30 L32,38 L34,38 L30,30 L34,32 L38,38" stroke="url(#goldSubtle)" stroke-width="1.5" fill="none" opacity="0.6"/>
  <circle cx="30" cy="29" r="3" fill="url(#goldSubtle)" opacity="0.5"/>
  <!-- Feather / flower in hand -->
  <circle cx="16" cy="-50" r="6" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.6"/>
  <!-- Abyss swirls below -->
  <path d="M-60,70 Q-40,80 -20,70 Q0,60 20,70 Q40,80 60,70" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M-50,85 Q-25,95 0,85 Q25,75 50,85" stroke="url(#gold)" stroke-width="0.8" fill="none" opacity="0.2"/>
  <!-- Stars -->
  ${[[-70,-110],[60,-90],[-50,-80],[80,-60]].map(([x,y]) =>
    `<polygon points="${x},${y-6} ${x+2},${y-2} ${x+6},${y} ${x+2},${y+2} ${x},${y+6} ${x-2},${y+2} ${x-6},${y} ${x-2},${y-2}"
             fill="url(#gold)" opacity="0.5"/>`
  ).join('')}
</g>`; }

function symbolMagician() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Infinity symbol above -->
  <path d="M-35,-110 C-55,-130 -25,-150 -5,-130 C15,-110 35,-130 55,-110" stroke="url(#gold)" stroke-width="2.5" fill="none" opacity="0.8"/>
  <!-- Table / altar -->
  <rect x="-90" y="30" width="180" height="14" rx="3" fill="#1a1208" stroke="url(#gold)" stroke-width="2"/>
  <!-- Four tools on table: cup, wand, sword, pentacle -->
  <!-- Cup -->
  <path d="M-70,15 L-70,30 M-75,15 L-65,15 L-65,30 M-70,15 L-75,20 L-65,20 Z" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
  <!-- Wand -->
  <rect x="-28" y="5" width="3" height="25" fill="url(#gold)"/>
  <polygon points="-26.5,-2 -20,5 -33,5" fill="url(#gold)" opacity="0.7"/>
  <!-- Sword -->
  <line x1="20" y1="5" x2="30" y2="28" stroke="url(#gold)" stroke-width="2"/>
  <line x1="16" y1="8" x2="34" y2="8" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Pentacle -->
  ${starSVG(60, 20, 14, 7, 5, '#daa520', 0.7)}
  <!-- Magician figure -->
  <rect x="-10" y="-40" width="20" height="70" rx="5" fill="url(#gold)" opacity="0.8"/>
  <circle cx="0" cy="-50" r="15" fill="url(#gold)" opacity="0.85"/>
  <!-- Raised wand hand -->
  <line x1="-8" y1="-45" x2="-25" y2="-95" stroke="url(#gold)" stroke-width="3"/>
  <!-- Magical energy rays -->
  <g opacity="0.4">
    <line x1="-25" y1="-95" x2="-55" y2="-125" stroke="#f5e6a0" stroke-width="2"/>
    <line x1="-25" y1="-95" x2="-10" y2="-135" stroke="#f5e6a0" stroke-width="1.5"/>
    <line x1="-25" y1="-95" x2="-45" y2="-140" stroke="#f5e6a0" stroke-width="1"/>
  </g>
</g>`; }

function symbolPriestess() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Two pillars -->
  <rect x="-70" y="-100" width="12" height="170" rx="3" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1.5"/>
  <text x="-64" y="30" text-anchor="middle" font-size="16" fill="url(#gold)" font-family="serif" opacity="0.8">B</text>
  <rect x="58" y="-100" width="12" height="170" rx="3" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1.5"/>
  <text x="64" y="30" text-anchor="middle" font-size="16" fill="url(#gold)" font-family="serif" opacity="0.8">J</text>
  <!-- Veil between pillars -->
  <path d="M-58,-100 Q0,-80 58,-100 L58,10 Q0,30 -58,10 Z" fill="url(#gold)" opacity="0.08" stroke="url(#gold)" stroke-width="1" stroke-dasharray="4 3"/>
  <!-- Priestess figure -->
  <path d="M-15,-20 L-22,40 L22,40 L15,-20 Z" fill="url(#gold)" opacity="0.75"/>
  <circle cx="0" cy="-35" r="16" fill="url(#gold)" opacity="0.8"/>
  <!-- Crown / headdress -->
  <path d="M-18,-45 L0,-60 L18,-45" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="0" cy="-60" r="4" fill="url(#gold)"/>
  <!-- Moon at feet -->
  <path d="M-20,55 A20,20 0 1,1 20,55 A25,20 0 0,0 -20,55" fill="url(#gold)" opacity="0.5"/>
  <!-- Scroll in lap -->
  <rect x="-20" y="5" width="40" height="3" rx="1" fill="url(#gold)" opacity="0.6"/>
  <rect x="-18" y="12" width="36" height="3" rx="1" fill="url(#gold)" opacity="0.4"/>
  <rect x="-18" y="19" width="36" height="3" rx="1" fill="url(#gold)" opacity="0.4"/>
</g>`; }

function symbolEmpress() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Throne -->
  <rect x="-55" y="-10" width="110" height="80" rx="4" fill="#1a1208" stroke="url(#gold)" stroke-width="2"/>
  <rect x="-45" y="-10" width="90" height="5" fill="url(#gold)" opacity="0.4"/>
  <!-- Empress figure -->
  <path d="M-18,-20 L-24,50 L24,50 L18,-20 Z" fill="url(#gold)" opacity="0.8"/>
  <circle cx="0" cy="-38" r="17" fill="url(#gold)" opacity="0.85"/>
  <!-- Crown with 12 stars -->
  ${Array.from({length:7}, (_,i) => {
    const ax = -30 + i*10;
    const ay = -58 + Math.sin(i*0.8)*4;
    return `<polygon points="${ax},${ay-4} ${ax+1.5},${ay-1} ${ax+4},${ay} ${ax+1.5},${ay+1.5} ${ax},${ay+4} ${ax-1.5},${ay+2} ${ax-4},${ay} ${ax-1.5},${ay-1}"
             fill="url(#gold)" opacity="0.8"/>`;
  }).join('')}
  <!-- Scepter -->
  <line x1="22" y1="-50" x2="35" y2="-100" stroke="url(#gold)" stroke-width="2.5"/>
  <circle cx="35" cy="-100" r="5" fill="url(#gold)"/>
  <!-- Heart shield -->
  <path d="M-10,-10 C-10,-25 10,-25 10,-10 C10,5 -10,20 -10,20 C-10,20 -30,5 -30,-10 C-30,-25 -10,-25 -10,-10 Z"
        fill="none" stroke="url(#gold)" stroke-width="2" transform="translate(0,55) scale(0.7)" opacity="0.6"/>
  <!-- Wheat / nature elements -->
  <path d="M-60,40 Q-50,10 -45,40" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <ellipse cx="-52" cy="20" rx="6" ry="3" fill="url(#gold)" opacity="0.2" transform="rotate(-20,-52,20)"/>
  <path d="M60,40 Q50,10 45,40" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <ellipse cx="52" cy="20" rx="6" ry="3" fill="url(#gold)" opacity="0.2" transform="rotate(20,52,20)"/>
</g>`; }

function symbolEmperor() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Throne -->
  <rect x="-60" y="0" width="120" height="70" rx="5" fill="#1a1208" stroke="url(#gold)" stroke-width="2"/>
  <!-- Ram heads on throne arms -->
  <path d="M-60,15 Q-75,5 -75,-5 Q-75,-15 -65,-15" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
  <path d="M60,15 Q75,5 75,-5 Q75,-15 65,-15" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
  <!-- Emperor figure -->
  <rect x="-18" y="-30" width="36" height="80" rx="6" fill="url(#gold)" opacity="0.8"/>
  <circle cx="0" cy="-45" r="18" fill="url(#gold)" opacity="0.85"/>
  <!-- Crown -->
  <path d="M-18,-55 L0,-70 L18,-55 Z" fill="url(#gold)" opacity="0.9"/>
  <rect x="-18" y="-58" width="36" height="5" fill="url(#gold)" opacity="0.6"/>
  <!-- Scepter -->
  <line x1="20" y1="-50" x2="45" y2="-105" stroke="url(#gold)" stroke-width="3"/>
  <circle cx="45" cy="-105" r="7" fill="url(#gold)"/>
  <!-- Orb -->
  <circle cx="-30" cy="-70" r="12" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <line x1="-30" y1="-82" x2="-30" y2="-58" stroke="url(#gold)" stroke-width="1" opacity="0.6"/>
  <line x1="-42" y1="-70" x2="-18" y2="-70" stroke="url(#gold)" stroke-width="1" opacity="0.6"/>
  <!-- Ankh cross on orb -->
  <path d="M-30,-78 L-30,-65 M-34,-75 L-26,-75" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Mountains behind -->
  <path d="M-80,20 L-40,-30 L-10,10 L30,-20 L60,20" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.25"/>
</g>`; }

function symbolHierophant() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Triple crown / tiara -->
  ${[0,1,2].map(i => `
    <path d="M${-30+i*5},${-85+i*12} Q${-15+i*3},${-105+i*10} ${0+i*2},${-95+i*12} Q${15+i*2},${-105+i*10} ${30+i*5},${-85+i*12}"
          stroke="url(#gold)" stroke-width="${3-i*0.5}" fill="none" opacity="${0.9-i*0.2}"/>
  `).join('')}
  <!-- Two acolytes -->
  <path d="M-55,-20 L-60,30 L-35,30 L-40,-20 Z" fill="url(#gold)" opacity="0.25"/>
  <circle cx="-48" cy="-35" r="10" fill="url(#gold)" opacity="0.35"/>
  <path d="M35,-20 L40,30 L65,30 L60,-20 Z" fill="url(#gold)" opacity="0.25"/>
  <circle cx="48" cy="-35" r="10" fill="url(#gold)" opacity="0.35"/>
  <!-- Hierophant (center) -->
  <rect x="-20" y="-25" width="40" height="85" rx="7" fill="url(#gold)" opacity="0.85"/>
  <circle cx="0" cy="-42" r="19" fill="url(#gold)" opacity="0.9"/>
  <!-- Papal cross staff -->
  <line x1="30" y1="-55" x2="50" y2="-130" stroke="url(#gold)" stroke-width="3"/>
  <line x1="38" y1="-130" x2="62" y2="-130" stroke="url(#gold)" stroke-width="1.5"/>
  <line x1="38" y1="-120" x2="62" y2="-120" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Hand blessing gesture -->
  <circle cx="-25" cy="-55" r="5" fill="url(#gold)" opacity="0.5"/>
  <!-- Keys at feet -->
  <g transform="translate(0,55)" opacity="0.7">
    <circle cx="-10" cy="-5" r="6" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
    <line x1="-10" y1="-5" x2="-10" y2="15" stroke="url(#gold)" stroke-width="1.5"/>
    <line x1="-10" y1="5" x2="-5" y2="8" stroke="url(#gold)" stroke-width="1"/>
    <circle cx="10" cy="-5" r="6" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
    <line x1="10" y1="-5" x2="10" y2="15" stroke="url(#gold)" stroke-width="1.5"/>
    <line x1="10" y1="5" x2="5" y2="8" stroke="url(#gold)" stroke-width="1"/>
  </g>
</g>`; }

function symbolLovers() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Angel / cherub above -->
  <g opacity="0.7">
    <!-- Wings -->
    <path d="M-10,-100 Q-50,-140 -80,-110 Q-50,-105 -30,-95" fill="url(#gold)" opacity="0.3"/>
    <path d="M10,-100 Q50,-140 80,-110 Q50,-105 30,-95" fill="url(#gold)" opacity="0.3"/>
    <!-- Angel body -->
    <circle cx="0" cy="-90" r="12" fill="url(#gold)" opacity="0.6"/>
    <!-- Halo -->
    <circle cx="0" cy="-90" r="18" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
    <!-- Sun rays from angel -->
    <g opacity="0.3">
      ${Array.from({length:8}, (_,i) => {
        const a = (i/8)*Math.PI*2 - Math.PI/2;
        return `<line x1="0" y1="-90" x2="${Math.cos(a)*50}" y2="${-90+Math.sin(a)*50}" stroke="#f5e6a0" stroke-width="1"/>`;
      }).join('')}
    </g>
  </g>
  <!-- Female figure (left) -->
  <path d="M-35,-10 L-40,50 L-15,50 L-15,-10 Z" fill="url(#gold)" opacity="0.6"/>
  <circle cx="-28" cy="-25" r="13" fill="url(#gold)" opacity="0.65"/>
  <!-- Male figure (right) -->
  <path d="M15,-10 L20,50 L45,50 L40,-10 Z" fill="url(#gold)" opacity="0.6"/>
  <circle cx="28" cy="-25" r="13" fill="url(#gold)" opacity="0.65"/>
  <!-- Hands reaching toward each other -->
  <line x1="-18" y1="-35" x2="18" y2="-35" stroke="url(#gold)" stroke-width="1.5" opacity="0.7"/>
  <!-- Mountain / Eden background -->
  <path d="M-90,30 L-40,-30 L0,10 L40,-30 L90,30" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.2"/>
  <!-- Tree of Life -->
  <line x1="0" y1="-40" x2="0" y2="20" stroke="url(#gold)" stroke-width="1.5" opacity="0.4"/>
  <circle cx="0" cy="-30" r="8" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
  <circle cx="0" cy="-10" r="10" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
  <circle cx="0" cy="12" r="12" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
  <!-- Serpent on tree -->
  <path d="M-5,15 Q-15,5 -8,-5 Q0,-15 -5,-25" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.3"/>
</g>`; }

function symbolChariot() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Chariot body -->
  <rect x="-65" y="10" width="130" height="45" rx="5" fill="#1a1208" stroke="url(#gold)" stroke-width="2.5"/>
  <!-- Chariot wheel base -->
  <rect x="-70" y="50" width="140" height="6" fill="url(#gold)" opacity="0.7"/>
  <!-- Two wheels -->
  <circle cx="-45" cy="70" r="18" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <circle cx="-45" cy="70" r="5" fill="url(#gold)" opacity="0.6"/>
  <circle cx="45" cy="70" r="18" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <circle cx="45" cy="70" r="5" fill="url(#gold)" opacity="0.6"/>
  <!-- Canopy / stars above -->
  <path d="M-65,10 Q-65,-20 0,-25 Q65,-20 65,10" fill="url(#gold)" opacity="0.15" stroke="url(#gold)" stroke-width="1.5"/>
  ${starSVG(0, -12, 12, 6, 5, '#daa520', 0.6)}
  <!-- Charioteer -->
  <rect x="-14" y="-25" width="28" height="55" rx="5" fill="url(#gold)" opacity="0.8"/>
  <circle cx="0" cy="-40" r="14" fill="url(#gold)" opacity="0.85"/>
  <!-- Crown -->
  <path d="M-14,-48 L0,-58 L14,-48" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <!-- Reins -->
  <path d="M-10,-35 Q-30,20 -60,50" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M10,-35 Q30,20 60,50" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Sphinx / horses -->
  <path d="M-70,-10 L-85,15 L-65,15 Z" fill="url(#gold)" opacity="0.3"/>
  <path d="M70,-10 L85,15 L65,15 Z" fill="url(#gold)" opacity="0.3"/>
  <!-- Black and white moons on shoulders -->
  <circle cx="-30" cy="-55" r="8" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <circle cx="30" cy="-55" r="8" fill="url(#gold)" opacity="0.3"/>
</g>`; }

function symbolStrength() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Infinity symbol above -->
  <path d="M-25,-110 C-45,-125 -15,-140 0,-120 C15,-140 45,-125 25,-110" stroke="url(#gold)" stroke-width="2.5" fill="none" opacity="0.8"/>
  <!-- Woman figure -->
  <path d="M-15,-15 L-20,50 L20,50 L15,-15 Z" fill="url(#gold)" opacity="0.75"/>
  <circle cx="0" cy="-30" r="15" fill="url(#gold)" opacity="0.8"/>
  <!-- Woman's hair / flowing energy -->
  <path d="M-12,-40 Q-40,-50 -35,-70" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M12,-40 Q40,-50 35,-70" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Lion -->
  <g transform="translate(0, 30)">
    <ellipse cx="0" cy="5" rx="30" ry="18" fill="url(#gold)" opacity="0.55"/>
    <!-- Lion mane -->
    <g opacity="0.4">
      ${Array.from({length:12}, (_,i) => {
        const a = (i/12)*Math.PI*2;
        return `<line x1="${-12+Math.cos(a)*8}" y1="${-10+Math.sin(a)*8}" x2="${-12+Math.cos(a)*18}" y2="${-10+Math.sin(a)*18}" stroke="url(#gold)" stroke-width="1.5"/>`;
      }).join('')}
    </g>
    <circle cx="-12" cy="-8" r="10" fill="url(#gold)" opacity="0.6"/>
    <!-- Lion body -->
    <ellipse cx="20" cy="5" rx="25" ry="12" fill="url(#gold)" opacity="0.35"/>
    <!-- Lion tail -->
    <path d="M45,5 Q55,0 50,-10" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
    <!-- Woman's hands on lion's mouth -->
    <ellipse cx="-8" cy="-22" rx="4" ry="3" fill="url(#gold)" opacity="0.6"/>
    <ellipse cx="-2" cy="-24" rx="4" ry="3" fill="url(#gold)" opacity="0.6"/>
  </g>
  <!-- Flowers / roses at bottom -->
  ${[[-50,80],[-30,85],[30,85],[50,80]].map(([x,y]) =>
    `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="url(#gold)" stroke-width="0.8" opacity="0.3"/>`
  ).join('')}
</g>`; }

function symbolHermit() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Mountain / peak background -->
  <path d="M-90,50 L-50,-40 L-10,10 L30,-40 L90,50" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.2"/>
  <path d="M-90,70 L-30,-10 L20,30 L60,-10 L90,70" stroke="url(#gold)" stroke-width="0.7" fill="none" opacity="0.15"/>
  <!-- Hermit figure (cloaked) -->
  <path d="M-22,-10 L-30,60 L30,60 L22,-10 Z" fill="url(#gold)" opacity="0.7"/>
  <!-- Hood / head -->
  <path d="M-18,-30 Q0,-55 18,-30 Q0,-15 -18,-30 Z" fill="url(#gold)" opacity="0.8"/>
  <!-- Lantern -->
  <circle cx="30" cy="-20" r="12" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.8"/>
  <circle cx="30" cy="-20" r="6" fill="#f5e6a0" opacity="0.5"/>
  <!-- Lantern star inside -->
  ${starSVG(30, -20, 5, 2.5, 6, '#f5e6a0', 0.8)}
  <!-- Lantern glow -->
  <circle cx="30" cy="-20" r="20" fill="#f5e6a0" opacity="0.08"/>
  <circle cx="30" cy="-20" r="30" fill="#f5e6a0" opacity="0.04"/>
  <!-- Staff -->
  <line x1="-22" y1="-20" x2="-40" y2="60" stroke="url(#gold)" stroke-width="2.5"/>
  <!-- Snow / stars -->
  <g opacity="0.3">
    ${Array.from({length:12}, (_,i) => {
      const x = -80 + (i*137)%160;
      const y = -120 + (i*73)%180;
      return `<circle cx="${x}" cy="${y}" r="${1+(i%2)}" fill="#f5e6a0"/>`;
    }).join('')}
  </g>
</g>`; }

function symbolWheel() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Outer wheel ring -->
  <circle cx="0" cy="0" r="85" fill="none" stroke="url(#gold)" stroke-width="4"/>
  <circle cx="0" cy="0" r="78" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <circle cx="0" cy="0" r="92" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
  <!-- Wheel spokes -->
  <g opacity="0.5">
    <line x1="-85" y1="0" x2="85" y2="0" stroke="url(#gold)" stroke-width="2"/>
    <line x1="0" y1="-85" x2="0" y2="85" stroke="url(#gold)" stroke-width="2"/>
    <line x1="-60" y1="-60" x2="60" y2="60" stroke="url(#gold)" stroke-width="1.5"/>
    <line x1="60" y1="-60" x2="-60" y2="60" stroke="url(#gold)" stroke-width="1.5"/>
  </g>
  <!-- Center hub -->
  <circle cx="0" cy="0" r="10" fill="#1a1208" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="0" cy="0" r="4" fill="url(#gold)"/>
  <!-- Four symbolic figures around the wheel -->
  <!-- Angel (top) -->
  <g transform="translate(0,-70)">
    <circle cx="0" cy="-10" r="6" fill="url(#gold)" opacity="0.6"/>
    <path d="M-12,-6 Q0,-20 12,-6" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  </g>
  <!-- Eagle (right) - simplified -->
  <path d="M70,-5 L80,10 L70,3 M78,-2 L88,-8 L78,0" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Lion (bottom) -->
  <circle cx="0" cy="75" r="10" fill="url(#gold)" opacity="0.35"/>
  <circle cx="-5" cy="70" r="6" fill="url(#gold)" opacity="0.3"/>
  <!-- Bull (left) -->
  <path d="M-80,0 L-70,-5 L-80,10" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Hebrew letters / symbols around rim -->
  <g font-family="serif" font-size="10" fill="url(#gold)" opacity="0.4">
    <text x="0" y="-95" text-anchor="middle">♄</text>
    <text x="88" y="3" text-anchor="middle">♃</text>
    <text x="0" y="100" text-anchor="middle">♂</text>
    <text x="-88" y="3" text-anchor="middle">☉</text>
  </g>
  <!-- Alchemical symbols on wheel -->
  <g font-family="serif" font-size="12" fill="url(#gold)" opacity="0.5">
    <text x="0" y="-55" text-anchor="middle">TARO</text>
    <text x="0" y="65" text-anchor="middle">ROTA</text>
  </g>
  <!-- Creatures at corners -->
  <text x="-55" y="-55" font-size="14" fill="url(#gold)" opacity="0.35" font-family="serif" text-anchor="middle">👁</text>
</g>`; }

function symbolJustice() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Scales -->
  <line x1="0" y1="-80" x2="0" y2="-30" stroke="url(#gold)" stroke-width="2.5"/>
  <line x1="-35" y1="-80" x2="35" y2="-80" stroke="url(#gold)" stroke-width="2"/>
  <!-- Scale pans -->
  <path d="M-45,-72 Q-35,-62 -25,-72" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
  <path d="M25,-72 Q35,-62 45,-72" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
  <!-- Weight on right pan (heavier) -->
  <circle cx="35" cy="-65" r="6" fill="url(#gold)" opacity="0.5"/>
  <!-- Feather on left pan (lighter) -->
  <path d="M-35,-70 Q-30,-60 -35,-55" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Justice figure -->
  <rect x="-15" y="-30" width="30" height="70" rx="5" fill="url(#gold)" opacity="0.75"/>
  <circle cx="0" cy="-45" r="16" fill="url(#gold)" opacity="0.8"/>
  <!-- Crown -->
  <path d="M-15,-55 L0,-68 L15,-55" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <!-- Sword (upright in right hand) -->
  <line x1="25" y1="-50" x2="40" y2="-120" stroke="url(#gold)" stroke-width="2.5"/>
  <line x1="27" y1="-120" x2="53" y2="-120" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Sword blade -->
  <path d="M38,-115 L36,-85 L44,-85 L42,-115 Z" fill="url(#gold)" opacity="0.4"/>
  <!-- Throne -->
  <rect x="-30" y="40" width="60" height="15" rx="3" fill="#1a1208" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Pillars on throne -->
  <rect x="-30" y="10" width="4" height="30" fill="url(#gold)" opacity="0.4"/>
  <rect x="26" y="10" width="4" height="30" fill="url(#gold)" opacity="0.4"/>
</g>`; }

function symbolHanged() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- T-shaped gallows / tree -->
  <rect x="-3" y="-100" width="6" height="130" fill="url(#gold)" opacity="0.6"/>
  <rect x="-40" y="-100" width="80" height="6" fill="url(#gold)" opacity="0.6"/>
  <!-- Rope -->
  <line x1="0" y1="-94" x2="0" y2="-60" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Hanged figure (upside down) -->
  <circle cx="0" cy="-60" r="14" fill="url(#gold)" opacity="0.7"/>
  <!-- Arms behind back (forming triangle) -->
  <path d="M-18,-55 L0,-45 L18,-55" stroke="url(#gold)" stroke-width="2" fill="none" opacity="0.6"/>
  <!-- Body -->
  <rect x="-8" y="-40" width="16" height="45" rx="4" fill="url(#gold)" opacity="0.65"/>
  <!-- Crossed legs (figure-4 shape) -->
  <line x1="-8" y1="5" x2="15" y2="-5" stroke="url(#gold)" stroke-width="2.5"/>
  <line x1="8" y1="5" x2="15" y2="-5" stroke="url(#gold)" stroke-width="2.5"/>
  <!-- Halo / glow around head -->
  <circle cx="0" cy="-60" r="22" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <!-- Light rays from head -->
  <g opacity="0.2">
    ${Array.from({length:10}, (_,i) => {
      const a = (i/10)*Math.PI*2;
      return `<line x1="${Math.cos(a)*20}" y1="${-60+Math.sin(a)*20}" x2="${Math.cos(a)*35}" y2="${-60+Math.sin(a)*35}" stroke="#f5e6a0" stroke-width="1"/>`;
    }).join('')}
  </g>
</g>`; }

function symbolDeath() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Skeletal rider on horse -->
  <!-- Horse body -->
  <path d="M-40,10 Q-50,-10 -30,-15 Q0,-25 40,-10 Q45,10 30,15 Q0,20 -40,10 Z"
        fill="url(#gold)" opacity="0.45"/>
  <!-- Horse head -->
  <path d="M-45,-10 L-65,-20 L-50,0 Z" fill="url(#gold)" opacity="0.4"/>
  <!-- Horse legs -->
  <line x1="-25" y1="12" x2="-30" y2="35" stroke="url(#gold)" stroke-width="2" opacity="0.4"/>
  <line x1="10" y1="12" x2="5" y2="35" stroke="url(#gold)" stroke-width="2" opacity="0.4"/>
  <line x1="25" y1="12" x2="30" y2="35" stroke="url(#gold)" stroke-width="2" opacity="0.4"/>
  <!-- Death (skeleton rider) -->
  <rect x="-8" y="-45" width="16" height="40" rx="4" fill="url(#gold)" opacity="0.6"/>
  <circle cx="0" cy="-55" r="14" fill="url(#gold)" opacity="0.55"/>
  <!-- Skull eyes -->
  <circle cx="-5" cy="-57" r="3" fill="#0a0805"/>
  <circle cx="5" cy="-57" r="3" fill="#0a0805"/>
  <!-- Scythe -->
  <line x1="15" y1="-55" x2="45" y2="-100" stroke="url(#gold)" stroke-width="2.5"/>
  <path d="M40,-100 Q50,-95 45,-85 Q40,-90 35,-88 Q38,-95 40,-100" fill="url(#gold)" opacity="0.6"/>
  <!-- Armor details -->
  <path d="M-8,-30 L8,-30 L5,-15 L-5,-15 Z" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <!-- Fallen figures (people of all stations) -->
  <!-- King with crown -->
  <circle cx="-50" cy="45" r="6" fill="url(#gold)" opacity="0.35"/>
  <path d="M-54,42 L-46,42 L-50,35 Z" fill="url(#gold)" opacity="0.2"/>
  <!-- Child -->
  <circle cx="55" cy="48" r="4" fill="url(#gold)" opacity="0.3"/>
  <!-- Bishop -->
  <path d="M-20,42 L-10,42 L-15,32 Z" fill="url(#gold)" opacity="0.25"/>
  <circle cx="-15" cy="30" r="3" fill="url(#gold)" opacity="0.2"/>
  <!-- Woman -->
  <circle cx="30" cy="42" r="5" fill="url(#gold)" opacity="0.3"/>
  <!-- Ground -->
  <path d="M-90,50 Q-45,40 0,48 Q45,38 90,50" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.3"/>
  <!-- Setting sun / tower in background -->
  <circle cx="60" cy="-60" r="15" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.2"/>
  <path d="M50,-60 Q55,-80 60,-70" stroke="url(#gold)" stroke-width="0.8" fill="none" opacity="0.2"/>
  <!-- Rose / rebirth symbol -->
  <circle cx="0" cy="-20" r="12" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  ${starSVG(0, -20, 6, 3, 5, '#daa520', 0.3)}
</g>`; }

function symbolTemperance() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Angel / winged figure -->
  <!-- Wings -->
  <path d="M-20,-40 Q-65,-80 -95,-50 Q-55,-35 -30,-25" fill="url(#gold)" opacity="0.3"/>
  <path d="M20,-40 Q65,-80 95,-50 Q55,-35 30,-25" fill="url(#gold)" opacity="0.3"/>
  <!-- Angel body / robe -->
  <path d="M-18,-10 L-25,50 L25,50 L18,-10 Z" fill="url(#gold)" opacity="0.7"/>
  <circle cx="0" cy="-25" r="15" fill="url(#gold)" opacity="0.75"/>
  <!-- Halo -->
  <circle cx="0" cy="-25" r="20" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <!-- Triangle on chest (alchemical fire/water symbol) -->
  <polygon points="0,-5 -12,12 12,12" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <polygon points="0,15 -8,3 8,3" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3" transform="rotate(180,0,9)"/>
  <!-- Two cups mixing liquid -->
  <!-- Left cup (gold/fire) -->
  <path d="M-55,0 L-55,25 M-65,0 L-45,0" stroke="url(#gold)" stroke-width="2" fill="none"/>
  <path d="M-60,25 L-50,25" stroke="url(#gold)" stroke-width="1.5"/>
  <rect x="-58" y="-5" width="6" height="8" fill="url(#gold)" opacity="0.3"/>
  <!-- Right cup (silver/water) -->
  <path d="M45,0 L45,25 M35,0 L55,0" stroke="url(#goldSubtle)" stroke-width="2" fill="none"/>
  <path d="M40,25 L50,25" stroke="url(#goldSubtle)" stroke-width="1.5"/>
  <rect x="42" y="-5" width="6" height="8" fill="url(#gold)" opacity="0.2"/>
  <!-- Stream of liquid between cups -->
  <path d="M-35,5 Q0,-10 35,5" stroke="url(#gold)" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M-32,10 Q0,0 32,10" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Flowers / iris at feet -->
  <path d="M-30,55 Q-25,45 -20,55" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <circle cx="-25" cy="48" r="4" fill="url(#gold)" opacity="0.25"/>
  <path d="M20,55 Q25,45 30,55" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <circle cx="25" cy="48" r="4" fill="url(#gold)" opacity="0.25"/>
  <!-- Path to mountains -->
  <path d="M0,55 L0,70" stroke="url(#gold)" stroke-width="1" opacity="0.2"/>
  <path d="M-90,85 Q-50,50 -20,70 Q0,60 20,70 Q50,50 90,85" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.2"/>
  <!-- Sun/crown in background -->
  <circle cx="0" cy="-90" r="25" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.2"/>
</g>`; }

function symbolDevil() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Devil figure (Baphomet) -->
  <!-- Wings (bat-like) -->
  <path d="M-25,-40 Q-70,-90 -100,-60 Q-60,-45 -35,-30" fill="url(#gold)" opacity="0.25"/>
  <path d="M25,-40 Q70,-90 100,-60 Q60,-45 35,-30" fill="url(#gold)" opacity="0.25"/>
  <!-- Horns -->
  <path d="M-12,-55 Q-25,-80 -15,-90" stroke="url(#gold)" stroke-width="3" fill="none"/>
  <path d="M12,-55 Q25,-80 15,-90" stroke="url(#gold)" stroke-width="3" fill="none"/>
  <!-- Head (goat-like) -->
  <path d="M-16,-45 Q0,-70 16,-45 Q12,-30 -12,-30 Z" fill="url(#gold)" opacity="0.65"/>
  <!-- Pentagram on forehead -->
  ${starSVG(0, -42, 5, 2.5, 5, '#0a0805', 0.6)}
  <!-- Body -->
  <rect x="-22" y="-30" width="44" height="65" rx="6" fill="url(#gold)" opacity="0.55"/>
  <!-- Goat legs / hairy -->
  <line x1="-15" y1="35" x2="-20" y2="60" stroke="url(#gold)" stroke-width="3" opacity="0.5"/>
  <line x1="15" y1="35" x2="20" y2="60" stroke="url(#gold)" stroke-width="3" opacity="0.5"/>
  <!-- Cloven hooves -->
  <path d="M-23,60 L-17,60 M-20,58 L-20,65" stroke="url(#gold)" stroke-width="1.5" opacity="0.4"/>
  <path d="M17,60 L23,60 M20,58 L20,65" stroke="url(#gold)" stroke-width="1.5" opacity="0.4"/>
  <!-- Torch in right hand -->
  <line x1="22" y1="-40" x2="45" y2="-80" stroke="url(#gold)" stroke-width="2"/>
  <ellipse cx="45" cy="-85" rx="8" ry="12" fill="#f5a623" opacity="0.3"/>
  <ellipse cx="45" cy="-85" rx="5" ry="8" fill="#daa520" opacity="0.4"/>
  <!-- Two chained figures at bottom -->
  <!-- Male figure -->
  <circle cx="-35" cy="50" r="7" fill="url(#gold)" opacity="0.4"/>
  <rect x="-39" y="57" width="8" height="20" rx="2" fill="url(#gold)" opacity="0.3"/>
  <!-- Female figure -->
  <circle cx="35" cy="50" r="7" fill="url(#gold)" opacity="0.4"/>
  <rect x="31" y="57" width="8" height="20" rx="2" fill="url(#gold)" opacity="0.3"/>
  <!-- Chains from pedestal to figures -->
  <circle cx="-10" cy="48" r="5" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <path d="M-10,48 Q-22,48 -28,48" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <circle cx="10" cy="48" r="5" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  <path d="M10,48 Q22,48 28,48" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.4"/>
  <!-- Pedestal -->
  <rect x="-30" y="40" width="60" height="10" fill="#1a1208" stroke="url(#gold)" stroke-width="1.5"/>
  <ellipse cx="0" cy="45" rx="30" ry="8" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
</g>`; }

function symbolTower() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Lightning bolt -->
  <path d="M-15,-120 L5,-80 L-5,-80 L15,-40 L-5,-40 L10,0"
        stroke="#f5e6a0" stroke-width="3" fill="none" opacity="0.9"/>
  <path d="M-15,-120 L5,-80 L-5,-80 L15,-40 L-5,-40 L10,0"
        stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Secondary lightning -->
  <path d="M-35,-100 L-25,-70 L-30,-70 L-20,-40" stroke="#f5e6a0" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Tower body -->
  <rect x="-35" y="10" width="70" height="90" fill="#1a1208" stroke="url(#gold)" stroke-width="2"/>
  <!-- Tower crown (falling off) -->
  <path d="M-40,10 L0,-10 L40,10 Z" fill="#1a1208" stroke="url(#gold)" stroke-width="1.5"/>
  <path d="M-40,10 L0,-10 L40,10 Z" fill="url(#gold)" opacity="0.15"
        transform="translate(15,-15) rotate(25,0,0)"/>
  <!-- Falling crown piece -->
  <path d="M20,-25 L35,-35 L45,-20 Z" fill="#1a1208" stroke="url(#gold)" stroke-width="1" opacity="0.6"/>
  <!-- Tower windows -->
  <rect x="-15" y="25" width="30" height="20" rx="10" fill="#0a0805" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <rect x="-15" y="55" width="30" height="20" rx="10" fill="#0a0805" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <!-- People falling -->
  <circle cx="-50" cy="30" r="5" fill="url(#gold)" opacity="0.3"/>
  <circle cx="55" cy="45" r="4" fill="url(#gold)" opacity="0.25"/>
  <!-- Fire from windows -->
  <ellipse cx="0" cy="25" rx="10" ry="6" fill="#f5a623" opacity="0.2"/>
  <ellipse cx="0" cy="55" rx="12" ry="5" fill="#f5a623" opacity="0.15"/>
  <!-- Debris sparks -->
  <g opacity="0.3">
    ${[[-45,20],[-55,40],[50,25],[60,50],[-40,50],[45,70]].map(([x,y]) =>
      `<circle cx="${x}" cy="${y}" r="${1.5}" fill="#f5a623"/>`
    ).join('')}
  </g>
  <!-- Dark clouds -->
  <path d="M-90,-90 Q-60,-110 -30,-90 Q0,-105 30,-90 Q60,-110 90,-90 Q70,-80 40,-85 Q10,-95 -20,-85 Q-50,-80 -90,-90 Z"
        fill="url(#gold)" opacity="0.08"/>
  <!-- Ground base -->
  <rect x="-50" y="100" width="100" height="8" fill="#1a1208" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
</g>`; }

function symbolStar() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Large central star -->
  ${starSVG(0, -40, 35, 15, 8, '#daa520', 0.85)}
  <!-- Star glow -->
  <circle cx="0" cy="-40" r="45" fill="#daa520" opacity="0.06"/>
  <circle cx="0" cy="-40" r="60" fill="#daa520" opacity="0.04"/>
  <!-- Seven smaller stars -->
  ${[[-55,-95],[-30,-115],[15,-100],[50,-80],[65,-50],[45,-20],[-60,-65]].map(([x,y]) =>
    starSVG(x, y, 6, 3, 5, '#daa520', 0.45)
  ).join('')}
  <!-- Woman figure pouring water -->
  <path d="M-30,20 L-35,70 L10,70 L10,20 Z" fill="url(#gold)" opacity="0.55"/>
  <circle cx="-12" cy="5" r="13" fill="url(#gold)" opacity="0.6"/>
  <!-- Hair flowing -->
  <path d="M-20,0 Q-35,-15 -25,-30" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Kneeling leg -->
  <line x1="-30" y1="60" x2="-10" y2="75" stroke="url(#gold)" stroke-width="2.5" opacity="0.5"/>
  <!-- Two pitchers pouring water -->
  <!-- Left pitcher -->
  <path d="M-35,30 L-40,40 L-25,40 Z" fill="url(#gold)" opacity="0.35"/>
  <!-- Right pitcher -->
  <path d="M15,30 L20,40 L5,40 Z" fill="url(#gold)" opacity="0.35"/>
  <!-- Water streams -->
  <path d="M-35,40 Q-50,55 -55,75" stroke="#6ab0de" stroke-width="2" fill="none" opacity="0.35"/>
  <path d="M15,40 Q30,55 35,75" stroke="#6ab0de" stroke-width="2" fill="none" opacity="0.35"/>
  <!-- Pool / water at bottom -->
  <path d="M-70,75 Q-30,85 0,75 Q30,85 70,75 L70,90 L-70,90 Z" fill="#6ab0de" opacity="0.12"/>
  <path d="M-70,75 Q-30,85 0,75 Q30,85 70,75" stroke="#6ab0de" stroke-width="1" fill="none" opacity="0.3"/>
  <!-- Tree / bird in background -->
  <line x1="-60" y1="0" x2="-60" y2="30" stroke="url(#gold)" stroke-width="1.5" opacity="0.2"/>
  <circle cx="-60" cy="-5" r="10" fill="none" stroke="url(#gold)" stroke-width="0.8" opacity="0.2"/>
  <path d="M-65,-15 L-55,-25 L-65,-20" stroke="url(#gold)" stroke-width="0.8" fill="none" opacity="0.2"/>
</g>`; }

function symbolMoon() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Moon (large, central) -->
  <path d="M-10,-80 A55,55 0 1,1 -10,30 A65,55 0 0,0 -10,-80 Z"
        fill="url(#gold)" opacity="0.7"/>
  <!-- Moon profile face -->
  <circle cx="-25" cy="-40" r="4" fill="#0a0805" opacity="0.3"/>
  <!-- Moon rays -->
  <g opacity="0.15">
    ${Array.from({length:18}, (_,i) => {
      const a = (i/18)*Math.PI*2;
      return `<line x1="-15" y1="-25" x2="${-15+Math.cos(a)*70}" y2="${-25+Math.sin(a)*70}" stroke="#f5e6a0" stroke-width="1"/>`;
    }).join('')}
  </g>
  <!-- Droplets / yods falling from moon -->
  <g opacity="0.4">
    ${Array.from({length:15}, (_,i) => {
      const x = -50 + i*7;
      const y = -10 + i*3;
      return `<circle cx="${x}" cy="${y}" r="1.5" fill="url(#gold)"/>`;
    }).join('')}
  </g>
  <!-- Two towers in background -->
  <rect x="-75" y="20" width="25" height="50" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1.5"/>
  <rect x="-72" y="10" width="6" height="15" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1"/>
  <rect x="50" y="20" width="25" height="50" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1.5"/>
  <rect x="53" y="10" width="6" height="15" fill="#1a1208" stroke="url(#goldSubtle)" stroke-width="1"/>
  <!-- Path between towers -->
  <path d="M-50,70 Q0,60 50,70" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.3"/>
  <!-- Wolf (left) -->
  <g transform="translate(-65,60) scale(0.6)" opacity="0.35">
    <ellipse cx="0" cy="5" rx="12" ry="8" fill="url(#gold)"/>
    <circle cx="-8" cy="-2" r="5" fill="url(#gold)"/>
    <path d="M-12,-5 L-15,-12 M-10,-5 L-12,-12" stroke="url(#gold)" stroke-width="1"/>
  </g>
  <!-- Dog (right) -->
  <g transform="translate(55,60) scale(0.55)" opacity="0.35">
    <ellipse cx="0" cy="5" rx="10" ry="7" fill="url(#gold)"/>
    <circle cx="8" cy="-2" r="4" fill="url(#gold)"/>
    <path d="M12,-3 L15,-8" stroke="url(#gold)" stroke-width="1"/>
  </g>
  <!-- Crayfish / crustacean in pool -->
  <path d="M-10,75 L-20,85 L-10,80 L0,85 Z" stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.3"/>
  <path d="M-20,85 L-30,82" stroke="url(#gold)" stroke-width="0.8" opacity="0.25"/>
  <path d="M0,85 L10,82" stroke="url(#gold)" stroke-width="0.8" opacity="0.25"/>
</g>`; }

function symbolSun() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Large sun -->
  <circle cx="0" cy="-10" r="60" fill="url(#gold)" opacity="0.2"/>
  <circle cx="0" cy="-10" r="45" fill="url(#gold)" opacity="0.35"/>
  <circle cx="0" cy="-10" r="32" fill="url(#gold)" opacity="0.6"/>
  <!-- Sun face -->
  <circle cx="0" cy="-10" r="25" fill="#f5e6a0" opacity="0.8"/>
  <!-- Eyes -->
  <ellipse cx="-8" cy="-18" rx="4" ry="5" fill="#0a0805" opacity="0.5"/>
  <ellipse cx="8" cy="-18" rx="4" ry="5" fill="#0a0805" opacity="0.5"/>
  <!-- Smile -->
  <path d="M-10,-6 Q0,4 10,-6" stroke="#0a0805" stroke-width="2" fill="none" opacity="0.4"/>
  <!-- Sun rays (alternating straight and wavy) -->
  <g opacity="0.4">
    ${Array.from({length:24}, (_,i) => {
      const a = (i/24)*Math.PI*2 - Math.PI/2;
      const inner = 28;
      const outer = i%2===0 ? 55 : 48;
      const wavy = i%3===0;
      if (wavy) {
        const mid = (inner+outer)/2;
        return `<path d="M${Math.cos(a)*inner} ${-10+Math.sin(a)*inner}
                        Q${Math.cos(a+0.1)*mid} ${-10+Math.sin(a+0.1)*mid}
                         ${Math.cos(a)*outer} ${-10+Math.sin(a)*outer}"
                stroke="url(#gold)" stroke-width="1.5" fill="none"/>`;
      }
      return `<line x1="${Math.cos(a)*inner}" y1="${-10+Math.sin(a)*inner}"
                    x2="${Math.cos(a)*outer}" y2="${-10+Math.sin(a)*outer}"
                    stroke="url(#gold)" stroke-width="2"/>`;
    }).join('')}
  </g>
  <!-- Child on white horse -->
  <g transform="translate(0,50)" opacity="0.5">
    <ellipse cx="0" cy="5" rx="25" ry="15" fill="url(#gold)" opacity="0.4"/>
    <rect x="-8" y="-10" width="16" height="15" rx="4" fill="url(#gold)" opacity="0.55"/>
    <circle cx="0" cy="-18" r="8" fill="url(#gold)" opacity="0.6"/>
    <!-- Banner / flag -->
    <line x1="8" y1="-18" x2="25" y2="-35" stroke="url(#gold)" stroke-width="1.5"/>
    <rect x="25" y="-40" width="20" height="12" fill="url(#gold)" opacity="0.4"/>
  </g>
  <!-- Sunflowers at bottom -->
  ${[[-50,85],[-25,88],[25,88],[50,85]].map(([x,y]) =>
    `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.3"/>
     <circle cx="${x}" cy="${y}" r="2" fill="url(#gold)" opacity="0.25"/>`
  ).join('')}
</g>`; }

function symbolJudgement() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Angel Gabriel blowing trumpet -->
  <!-- Wings -->
  <path d="M-15,-90 Q-60,-120 -85,-80 Q-50,-70 -25,-60" fill="url(#gold)" opacity="0.35"/>
  <path d="M15,-90 Q60,-120 85,-80 Q50,-70 25,-60" fill="url(#gold)" opacity="0.35"/>
  <!-- Angel body -->
  <rect x="-12" y="-65" width="24" height="40" rx="4" fill="url(#gold)" opacity="0.7"/>
  <circle cx="0" cy="-78" r="12" fill="url(#gold)" opacity="0.75"/>
  <!-- Halo -->
  <circle cx="0" cy="-78" r="18" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <!-- Trumpet -->
  <line x1="12" y1="-70" x2="35" y2="-95" stroke="url(#gold)" stroke-width="2.5"/>
  <rect x="30" y="-100" width="15" height="8" rx="2" fill="url(#gold)" opacity="0.5" transform="rotate(-15,37,-96)"/>
  <!-- Trumpet flag -->
  <rect x="35" y="-105" width="18" height="10" fill="url(#gold)" opacity="0.3" transform="rotate(-15,44,-100)"/>
  <!-- Sound waves -->
  <g opacity="0.3">
    <path d="M50,-100 Q60,-95 50,-90" stroke="url(#gold)" stroke-width="1" fill="none"/>
    <path d="M55,-105 Q70,-95 55,-85" stroke="url(#gold)" stroke-width="0.8" fill="none"/>
  </g>
  <!-- Clouds -->
  <path d="M-90,-50 Q-60,-60 -30,-45 Q0,-55 30,-45 Q60,-60 90,-50"
        stroke="url(#gold)" stroke-width="1" fill="none" opacity="0.2"/>
  <!-- Rising figures from tombs below -->
  <!-- Tomb / coffins -->
  <rect x="-50" y="75" width="35" height="12" rx="2" fill="#1a1208" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <rect x="15" y="75" width="35" height="12" rx="2" fill="#1a1208" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>
  <!-- Figure 1 rising (man) -->
  <rect x="-42" y="50" width="14" height="26" rx="3" fill="url(#gold)" opacity="0.5"/>
  <circle cx="-35" cy="42" r="7" fill="url(#gold)" opacity="0.55"/>
  <!-- Arms raised -->
  <line x1="-42" y1="48" x2="-52" y2="30" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <line x1="-28" y1="48" x2="-18" y2="30" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <!-- Figure 2 rising (woman) -->
  <rect x="24" y="50" width="14" height="26" rx="3" fill="url(#gold)" opacity="0.5"/>
  <circle cx="31" cy="42" r="7" fill="url(#gold)" opacity="0.55"/>
  <line x1="24" y1="48" x2="14" y2="30" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <line x1="38" y1="48" x2="48" y2="30" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <!-- Child figure -->
  <circle cx="0" cy="60" r="5" fill="url(#gold)" opacity="0.4"/>
  <rect x="-3" y="65" width="6" height="12" rx="2" fill="url(#gold)" opacity="0.35"/>
  <!-- Light rays from angel to figures -->
  <g opacity="0.08">
    <line x1="0" y1="-55" x2="-35" y2="45" stroke="#f5e6a0" stroke-width="2"/>
    <line x1="0" y1="-55" x2="31" y2="45" stroke="#f5e6a0" stroke-width="2"/>
    <line x1="0" y1="-55" x2="0" y2="60" stroke="#f5e6a0" stroke-width="2"/>
  </g>
</g>`; }

function symbolWorld() { return `
<g transform="translate(${W/2},${H/2 - 15})">
  <!-- Laurel wreath (victory crown) - oval -->
  <ellipse cx="0" cy="0" rx="60" ry="80" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <ellipse cx="0" cy="0" rx="63" ry="83" fill="none" stroke="url(#gold)" stroke-width="0.8" opacity="0.4"/>
  <!-- Wreath ribbon ties (infinity-like) at top and bottom -->
  <path d="M-30,-78 Q0,-95 30,-78" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M-30,78 Q0,95 30,78" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Dancing figure in center -->
  <rect x="-10" y="-25" width="20" height="50" rx="5" fill="url(#gold)" opacity="0.65"/>
  <circle cx="0" cy="-38" r="13" fill="url(#gold)" opacity="0.7"/>
  <!-- Flowing scarves / veils -->
  <path d="M-10,-30 Q-30,-20 -40,-5" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M10,-30 Q30,-20 40,-5" stroke="url(#gold)" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Legs in dance pose -->
  <line x1="-5" y1="25" x2="-15" y2="45" stroke="url(#gold)" stroke-width="2.5" opacity="0.55"/>
  <line x1="5" y1="25" x2="15" y2="40" stroke="url(#gold)" stroke-width="2.5" opacity="0.55"/>
  <!-- Two wands (held in hands) -->
  <line x1="-10" y1="-30" x2="-30" y2="-55" stroke="url(#gold)" stroke-width="1.5"/>
  <line x1="10" y1="-30" x2="30" y2="-55" stroke="url(#gold)" stroke-width="1.5"/>
  <!-- Four evangelist symbols in corners -->
  <!-- Angel (top-left) -->
  <g transform="translate(-55,-65)" opacity="0.45">
    <circle cx="0" cy="0" r="8" fill="url(#gold)"/>
    <path d="M-10,2 Q0,-10 10,2" stroke="url(#gold)" stroke-width="1" fill="none"/>
  </g>
  <!-- Eagle (top-right) -->
  <g transform="translate(55,-65)" opacity="0.45">
    <path d="M-8,0 L0,-12 L8,0" stroke="url(#gold)" stroke-width="1.5" fill="none"/>
    <path d="M-5,-3 L8,-8" stroke="url(#gold)" stroke-width="0.8" fill="none"/>
  </g>
  <!-- Lion (bottom-left) -->
  <g transform="translate(-55,65)" opacity="0.45">
    <circle cx="0" cy="0" r="7" fill="url(#gold)"/>
    <circle cx="-4" cy="-3" r="3" fill="url(#gold)"/>
  </g>
  <!-- Bull (bottom-right) -->
  <g transform="translate(55,65)" opacity="0.45">
    <path d="M-7,0 L0,-5 L7,0 L0,8 Z" fill="url(#gold)"/>
    <path d="M-10,-4 L-5,-8" stroke="url(#gold)" stroke-width="1"/>
    <path d="M10,-4 L5,-8" stroke="url(#gold)" stroke-width="1"/>
  </g>
  <!-- Sacred geometry ring patterns -->
  <circle cx="0" cy="0" r="50" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.2"/>
  <circle cx="0" cy="0" r="38" fill="none" stroke="url(#gold)" stroke-width="0.5" opacity="0.15"/>
  <!-- Small stars scattered -->
  <g opacity="0.25">
    ${[[-25,-40],[25,-40],[-20,30],[20,30]].map(([x,y]) =>
      starSVG(x, y, 4, 2, 5, '#daa520', 0.4)
    ).join('')}
  </g>
  <!-- Outer glow -->
  <circle cx="0" cy="0" r="75" fill="#daa520" opacity="0.03"/>
  <circle cx="0" cy="0" r="90" fill="#daa520" opacity="0.02"/>
</g>`; }

// Star helper
function starSVG(cx, cy, outerR, innerR, points, color, opacity) {
  const pts = [];
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + i * step;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${color}" opacity="${opacity}"/>`;
}

// ─── Symbol Map ───────────────────────────────────────────────────────────
const SYMBOLS = {
  fool: symbolFool,
  magician: symbolMagician,
  priestess: symbolPriestess,
  empress: symbolEmpress,
  emperor: symbolEmperor,
  hierophant: symbolHierophant,
  lovers: symbolLovers,
  chariot: symbolChariot,
  strength: symbolStrength,
  hermit: symbolHermit,
  wheel: symbolWheel,
  justice: symbolJustice,
  hanged: symbolHanged,
  death: symbolDeath,
  temperance: symbolTemperance,
  devil: symbolDevil,
  tower: symbolTower,
  star: symbolStar,
  moon: symbolMoon,
  sun: symbolSun,
  judgement: symbolJudgement,
  world: symbolWorld,
};

// ─── Main ─────────────────────────────────────────────────────────────────
function generateCards() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const card of CARDS) {
    const symbolFunc = SYMBOLS[card.symbol];
    if (!symbolFunc) {
      console.error(`No symbol function for: ${card.symbol}`);
      continue;
    }

    const frame = goldenFrame(card.roman, card.name, card.en);
    const symbolArt = symbolFunc();
    const inner = `
      ${frame}
      ${symbolArt}
      <rect x="30" y="30" width="${W-60}" height="${H-60}" rx="12" ry="12"
            fill="url(#innerGlow)" pointer-events="none"/>
    `;

    const svg = svgWrap(inner);
    const filename = `major-${card.n}.svg`;
    const filepath = join(OUT_DIR, filename);
    writeFileSync(filepath, svg, 'utf-8');
    console.log(`✓ Generated: ${filename}`);
  }

  console.log(`\n✨ All ${CARDS.length} Major Arcana tarot cards generated in:\n   ${OUT_DIR}`);
}

generateCards();
