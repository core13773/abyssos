// ============================================================
// Abyssos v4.0 — Card Generator (Locale-aware, large fonts)
// Generates KO + EN sets: Monster(18×2) + Gatekeeper(9×2) + Guardian(9×2) = 72 SVGs
// Usage: node scripts/generate-all-cards.mjs
// ============================================================

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  ELEMENT_COLORS,
  MONSTER_CARDS,
  GATEKEEPER_CARDS,
  GUARDIAN_CARDS,
} from './card-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_OUT = join(__dirname, '..', 'public', 'images');
const W = 750, H = 1050, M = 30;

// ================================================================
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function svgWrap(body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="gold"><stop offset="0%" stop-color="#f0d060"/><stop offset="25%" stop-color="#daa520"/><stop offset="50%" stop-color="#f5e6a0"/><stop offset="75%" stop-color="#b8860b"/><stop offset="100%" stop-color="#f0d060"/></linearGradient>
    <linearGradient id="goldV"><stop offset="0%" stop-color="#f5e6a0"/><stop offset="30%" stop-color="#daa520"/><stop offset="60%" stop-color="#b8860b"/><stop offset="100%" stop-color="#f0d060"/></linearGradient>
    <linearGradient id="goldSubtle"><stop offset="0%" stop-color="#a08030"/><stop offset="50%" stop-color="#c4a040"/><stop offset="100%" stop-color="#a08030"/></linearGradient>
    <radialGradient id="divineGlow" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#f5e6a0" stop-opacity="0.3"/><stop offset="50%" stop-color="#daa520" stop-opacity="0.1"/><stop offset="100%" stop-color="#1a1208" stop-opacity="0"/></radialGradient>
    ${defs}
  </defs>${body}</svg>`;
}

function corner(cx, cy, dir) {
  const s = 18;
  let p='';
  switch(dir) {
    case 1: p=`M${cx} ${cy+s} Q${cx} ${cy} ${cx+s} ${cy} M${cx} ${cy+s*.7} Q${cx+s*.3} ${cy+s*.3} ${cx+s*.7} ${cy}`; break;
    case 2: p=`M${cx-s} ${cy} Q${cx} ${cy} ${cx} ${cy+s} M${cx-s*.7} ${cy} Q${cx-s*.3} ${cy+s*.3} ${cx} ${cy+s*.7}`; break;
    case 3: p=`M${cx} ${cy-s} Q${cx} ${cy} ${cx+s} ${cy} M${cx} ${cy-s*.7} Q${cx+s*.3} ${cy-s*.3} ${cx+s*.7} ${cy}`; break;
    case 4: p=`M${cx-s} ${cy} Q${cx} ${cy} ${cx} ${cy-s} M${cx-s*.7} ${cy} Q${cx-s*.3} ${cy-s*.3} ${cx} ${cy-s*.7}`; break;
  }
  return `<path d="${p}" stroke="url(#gold)" stroke-width="1.5" fill="none"/>`;
}

function starSVG(cx, cy, outerR, innerR, pts, color) {
  const step = Math.PI / pts;
  const points = [];
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = -Math.PI / 2 + i * step;
    points.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${points.join(' ')}" fill="${color}"/>`;
}

function elemEmoji(el) {
  const m = { ice:'❄️', illusion:'🎭', blood:'🩸', fire:'🔥', mud:'💢', gold:'💰', poison:'☠️', wind:'🌪', holy:'✨' };
  return m[el] || '👾';
}

function wrap(text, cx, y, size, color, maxW) {
  if (!text) return '';
  const lc = Math.floor(maxW / (size * 0.6));
  const lines = [];
  let r = text;
  while (r.length > 0) {
    if (r.length <= lc) { lines.push(r); break; }
    const sp = r.lastIndexOf(' ', lc);
    const cut = sp > lc / 2 ? sp : r.indexOf(' ', lc) > 0 ? r.indexOf(' ', lc) : lc;
    lines.push(r.substring(0, cut).trim());
    r = r.substring(cut).trim();
    if (lines.length >= 2) { lines.push(r.substring(0, lc - 3) + '...'); break; }
  }
  return lines.map((l, i) =>
    `<text x="${cx}" y="${y + i * (size + 5)}" text-anchor="middle" font-family="serif" font-size="${size}" fill="${color}">${esc(l)}</text>`
  ).join('\n');
}

// ================================================================
// MONSTER — locale-aware, larger fonts
// ================================================================
function monsterCard(card, loc) {
  const clr = ELEMENT_COLORS[card.element];
  const IW = W - M*2, IH = H - M*2;
  const name = loc === 'en' ? card.nameEn : card.name;
  const ability = loc === 'en' ? card.abilityEn : card.ability;
  const tierLabel = card.tier === 'A' ? (loc==='en'?'MINOR':'하급') : (loc==='en'?'GREATER':'상급');
  const tierColor = card.tier === 'A' ? '#22c55e' : '#ef4444';
  const powerLabel = loc === 'en' ? 'POWER' : '전투력';
  const abiLabel = loc === 'en' ? 'ABILITY' : '특수 능력';
  const winLabel = loc === 'en' ? 'WIN: HP +' : '승리: HP +';
  const loseLabel = loc === 'en' ? 'LOSE: HP -' : '패배: HP -';

  const defs = `
  <linearGradient id="ebg-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${clr.bg}"/><stop offset="50%" stop-color="#0a0a10"/><stop offset="100%" stop-color="${clr.bg}"/>
  </linearGradient>
  <linearGradient id="egl-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${clr.primary}"/><stop offset="50%" stop-color="${clr.secondary}"/><stop offset="100%" stop-color="${clr.primary}"/>
  </linearGradient>
  <radialGradient id="eglow-${card.id}" cx="50%" cy="35%" r="40%">
    <stop offset="0%" stop-color="${clr.primary}" stop-opacity="0.2"/><stop offset="100%" stop-color="#0a0a10" stop-opacity="0"/>
  </radialGradient>`;

  const body = `
  <rect width="${W}" height="${H}" fill="url(#ebg-${card.id})"/>
  <rect x="${M}" y="${M}" width="${IW}" height="${IH}" rx="14" fill="none" stroke="url(#egl-${card.id})" stroke-width="5"/>
  <rect x="${M+8}" y="${M+8}" width="${IW-16}" height="${IH-16}" rx="10" fill="none" stroke="${clr.secondary}" stroke-width="2"/>

  ${corner(M+5, M+5, 1)} ${corner(M+IW-5, M+5, 2)}
  ${corner(M+5, M+IH-5, 3)} ${corner(M+IW-5, M+IH-5, 4)}

  <!-- TIER BADGE -->
  <rect x="${W/2 - 55}" y="${M + 14}" width="110" height="42" rx="21" fill="${tierColor}"/>
  <text x="${W/2}" y="${M + 43}" text-anchor="middle" font-family="serif" font-size="22" font-weight="bold" fill="#fff" letter-spacing="3">${tierLabel}</text>

  <line x1="${W/2 - 80}" y1="${M + 72}" x2="${W/2 + 80}" y2="${M + 72}" stroke="url(#egl-${card.id})" stroke-width="1.5"/>
  <circle cx="${W/2}" cy="${M + 72}" r="4" fill="${clr.primary}"/>

  <!-- CARD NAME (large, only one language) -->
  <text x="${W/2}" y="${H - M - 50}" text-anchor="middle" font-family="serif" font-size="34" font-weight="bold" fill="${clr.primary}" letter-spacing="3">${esc(name)}</text>

  <!-- ILLUSTRATION AREA -->
  <g transform="translate(${W/2}, ${H/2 - 25})">
    <circle cx="0" cy="0" r="130" fill="none" stroke="${clr.primary}" stroke-width="2"/>
    <circle cx="0" cy="0" r="110" fill="none" stroke="${clr.primary}" stroke-width="1"/>
    <circle cx="0" cy="0" r="85" fill="url(#eglow-${card.id})"/>

    <!-- POWER NUMBER (large) -->
    <text x="0" y="12" text-anchor="middle" font-family="serif" font-size="90" font-weight="bold" fill="url(#egl-${card.id})">${card.power}</text>
    <text x="0" y="-50" text-anchor="middle" font-family="serif" font-size="18" fill="${clr.accent}" letter-spacing="4">${powerLabel}</text>

    <text x="0" y="-110" text-anchor="middle" font-size="70">${elemEmoji(card.element)}</text>

    <!-- ABILITY BOX -->
    <rect x="-220" y="55" width="440" height="80" rx="10" fill="${clr.bg}" stroke="${clr.primary}" stroke-width="1.5"/>
    <text x="0" y="80" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="${clr.accent}" letter-spacing="2">${abiLabel}</text>
    ${wrap(ability, 0, 102, 16, clr.accent, 400)}

    <!-- REWARD / PENALTY -->
    <rect x="-220" y="148" width="215" height="40" rx="6" fill="#0a2a0a" stroke="#22c55e" stroke-width="1.5"/>
    <text x="-112" y="174" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="#4ade80">${winLabel}${card.rewardHp}</text>

    <rect x="5" y="148" width="215" height="40" rx="6" fill="#2a0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="112" y="174" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="#f87171">${loseLabel}${card.penaltyHp}</text>
  </g>`;

  return svgWrap(body, defs);
}

// ================================================================
// GATEKEEPER — locale-aware, larger fonts
// ================================================================
function gatekeeperCard(card, loc) {
  const clr = ELEMENT_COLORS[card.element];
  const IW = W - M*2, IH = H - M*2;
  const name = loc === 'en' ? card.nameEn : card.name;
  const title = loc === 'en' ? card.titleEn : card.title;
  const mechanic = loc === 'en' ? card.mechanicEn : card.mechanic;
  const narrative = loc === 'en' ? card.narrativeEn : card.narrative;
  const targetLabel = loc === 'en' ? 'D6 TARGET' : 'D6 목표';
  const mechLabel = loc === 'en' ? 'UNIQUE MECHANIC' : '고유 기믹';
  const winLabel = loc === 'en' ? 'VICTORY' : '승리';
  const loseLabel = loc === 'en' ? 'DEFEAT' : '패배';

  const dots = Array.from({length:120}, (_,i) => {
    const x = (i*173)%W, y = (i*311)%H;
    return `<circle cx="${x}" cy="${y}" r="${1+(i%3)}" fill="#daa520"/>`;
  }).join('');

  const defs = `
  <radialGradient id="gkbg-${card.id}" cx="50%" cy="40%" r="50%">
    <stop offset="0%" stop-color="${clr.primary}" stop-opacity="0.1"/><stop offset="100%" stop-color="#08060a" stop-opacity="0"/>
  </radialGradient>`;

  const body = `
  <rect width="${W}" height="${H}" fill="#08060a"/>
  <rect width="${W}" height="${H}" fill="url(#gkbg-${card.id})"/>
  <g>${dots}</g>

  <rect x="${M}" y="${M}" width="${IW}" height="${IH}" rx="16" fill="none" stroke="url(#gold)" stroke-width="10"/>
  <rect x="${M+12}" y="${M+12}" width="${IW-24}" height="${IH-24}" rx="12" fill="none" stroke="url(#goldSubtle)" stroke-width="2"/>
  <rect x="${M+18}" y="${M+18}" width="${IW-36}" height="${IH-36}" rx="9" fill="none" stroke="${clr.primary}" stroke-width="2"/>

  ${corner(M+7, M+7,1)} ${corner(M+IW-7, M+7,2)} ${corner(M+7, M+IH-7,3)} ${corner(M+IW-7, M+IH-7,4)}

  <!-- BOSS BADGE -->
  <rect x="${W/2 - 70}" y="${M + 12}" width="140" height="44" rx="22" fill="#7c3aed"/>
  <text x="${W/2}" y="${M + 42}" text-anchor="middle" font-family="serif" font-size="20" font-weight="bold" fill="#f5e6a0" letter-spacing="3">👹 BOSS</text>

  <line x1="${W/2 - 120}" y1="${M + 72}" x2="${W/2 + 120}" y2="${M + 72}" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="${W/2}" cy="${M + 72}" r="5" fill="url(#gold)"/>

  <text x="${W/2}" y="${M + 100}" text-anchor="middle" font-family="serif" font-size="18" font-weight="bold" fill="url(#goldV)" letter-spacing="5">${esc(title)}</text>

  <!-- NAME (large) -->
  <text x="${W/2}" y="${H - M - 60}" text-anchor="middle" font-family="serif" font-size="36" font-weight="bold" fill="url(#gold)" letter-spacing="5">${esc(name)}</text>

  <!-- ILLUSTRATION -->
  <g transform="translate(${W/2}, ${H/2 - 20})">
    <circle cx="0" cy="0" r="145" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="0" cy="0" r="125" fill="none" stroke="${clr.primary}" stroke-width="2"/>
    <circle cx="0" cy="0" r="98" fill="#7c3aed"/>

    <text x="0" y="15" text-anchor="middle" font-family="serif" font-size="96" font-weight="bold" fill="url(#gold)">${card.power}</text>
    <text x="0" y="-55" text-anchor="middle" font-family="serif" font-size="20" fill="url(#goldV)" letter-spacing="5">${targetLabel}</text>

    <text x="0" y="-115" text-anchor="middle" font-size="65">${elemEmoji(card.element)}</text>

    <!-- MECHANIC BOX -->
    <rect x="-245" y="48" width="490" height="95" rx="12" fill="#0a0805" stroke="url(#gold)" stroke-width="2"/>
    <text x="0" y="75" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="url(#goldV)" letter-spacing="3">${mechLabel}</text>
    ${wrap(mechanic, 0, 100, 15, '#f0d060', 460)}

    <!-- VICTORY / DEFEAT -->
    <rect x="-245" y="155" width="238" height="55" rx="8" fill="#0a2a0a" stroke="#22c55e" stroke-width="2"/>
    <text x="-126" y="180" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="#22c55e">${winLabel}</text>
    <text x="-126" y="200" text-anchor="middle" font-family="serif" font-size="15" fill="#4ade80">HP+${card.rewardHp} Move+${card.rewardMove}</text>

    <rect x="7" y="155" width="238" height="55" rx="8" fill="#2a0a0a" stroke="#ef4444" stroke-width="2"/>
    <text x="126" y="180" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="#ef4444">${loseLabel}</text>
    <text x="126" y="200" text-anchor="middle" font-family="serif" font-size="15" fill="#f87171">HP-${card.penaltyHp} Back ${card.pushback}</text>
  </g>`;

  return svgWrap(body, defs);
}

// ================================================================
// GUARDIAN — locale-aware, larger fonts
// ================================================================
function guardianCard(card, loc) {
  const clr = ELEMENT_COLORS[card.element];
  const IW = W - M*2, IH = H - M*2;
  const name = loc === 'en' ? card.nameEn : card.name;
  const mainEffect = loc === 'en' ? card.mainEffectEn : card.mainEffect;
  const subEffect = loc === 'en' ? card.subEffectEn : card.subEffect;
  const narrative = loc === 'en' ? card.narrativeEn : card.narrative;
  const guardLabel = loc === 'en' ? 'GUARDIAN' : '수호카드';
  const effectType = card.effectType === 'active' ? 'ACTIVE' : card.effectType === 'both' ? 'BOTH' : 'PASSIVE';
  const mainLabel = loc === 'en' ? 'MAIN EFFECT' : '주 효과';
  const subLabel = loc === 'en' ? 'SUB EFFECT' : '부 효과';

  const defs = `
  <radialGradient id="gdbg-${card.id}" cx="50%" cy="40%" r="50%">
    <stop offset="0%" stop-color="${clr.primary}" stop-opacity="0.25"/><stop offset="50%" stop-color="#daa520" stop-opacity="0.08"/><stop offset="100%" stop-color="#121008" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gdgold-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#f0d060"/><stop offset="50%" stop-color="#f5e6a0"/><stop offset="100%" stop-color="#daa520"/>
  </linearGradient>`;

  const body = `
  <rect width="${W}" height="${H}" fill="#121008"/>
  <rect width="${W}" height="${H}" fill="url(#divineGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#gdbg-${card.id})"/>

  <rect x="${M}" y="${M}" width="${IW}" height="${IH}" rx="16" fill="none" stroke="url(#gdgold-${card.id})" stroke-width="8"/>
  <rect x="${M+10}" y="${M+10}" width="${IW-20}" height="${IH-20}" rx="12" fill="none" stroke="url(#goldSubtle)" stroke-width="2"/>
  <rect x="${M+16}" y="${M+16}" width="${IW-32}" height="${IH-32}" rx="9" fill="none" stroke="${clr.primary}" stroke-width="1.5"/>

  ${corner(M+7, M+7,1)} ${corner(M+IW-7, M+7,2)} ${corner(M+7, M+IH-7,3)} ${corner(M+IW-7, M+IH-7,4)}

  <!-- GUARDIAN BADGE -->
  <rect x="${W/2 - 80}" y="${M + 12}" width="160" height="44" rx="22" fill="#f0d060"/>
  <text x="${W/2}" y="${M + 42}" text-anchor="middle" font-family="serif" font-size="20" font-weight="bold" fill="#121008" letter-spacing="3">✨ ${guardLabel}</text>

  <!-- EFFECT TYPE -->
  <rect x="${W/2 - 55}" y="${M + 66}" width="110" height="28" rx="14" fill="${card.effectType==='active'?'#7c3aed':card.effectType==='both'?'#f0d060':'#22c55e'}"/>
  <text x="${W/2}" y="${M + 85}" text-anchor="middle" font-family="serif" font-size="13" font-weight="bold" fill="#fff" letter-spacing="3">${effectType}</text>

  <text x="${W/2}" y="${H - M - 55}" text-anchor="middle" font-family="serif" font-size="34" font-weight="bold" fill="url(#gdgold-${card.id})" letter-spacing="4">${esc(name)}</text>

  <!-- ILLUSTRATION -->
  <g transform="translate(${W/2}, ${H/2 - 30})">
    <!-- Rays -->
    ${Array.from({length:12}, (_,i) => {
      const a = (i/12)*Math.PI*2;
      return `<line x1="${Math.cos(a)*45}" y1="${Math.sin(a)*45}" x2="${Math.cos(a)*170}" y2="${Math.sin(a)*170}" stroke="#f5e6a0" stroke-width="4"/>`;
    }).join('')}

    <circle cx="0" cy="0" r="95" fill="url(#divineGlow)"/>
    <circle cx="0" cy="0" r="72" fill="none" stroke="url(#gdgold-${card.id})" stroke-width="2"/>
    <circle cx="0" cy="0" r="56" fill="none" stroke="${clr.primary}" stroke-width="2"/>

    ${starSVG(0, 0, 38, 17, 8, '#daa520')}
    ${starSVG(0, 0, 25, 11, 8, '#f5e6a0')}

    <text x="0" y="-90" text-anchor="middle" font-size="55">${elemEmoji(card.element)}</text>

    <!-- MAIN EFFECT -->
    <rect x="-245" y="60" width="490" height="80" rx="12" fill="#0a0805" stroke="url(#gdgold-${card.id})" stroke-width="2"/>
    <text x="0" y="88" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="url(#gdgold-${card.id})" letter-spacing="3">${mainLabel}</text>
    ${wrap(mainEffect, 0, 112, 17, '#f0d060', 460)}

    <!-- SUB EFFECT -->
    <rect x="-245" y="150" width="490" height="52" rx="10" fill="#0a0805" stroke="url(#goldSubtle)" stroke-width="1.5"/>
    <text x="0" y="174" text-anchor="middle" font-family="serif" font-size="13" font-weight="bold" fill="url(#goldSubtle)" letter-spacing="2">${subLabel}</text>
    ${wrap(subEffect, 0, 194, 14, '#a08030', 460)}
  </g>`;

  return svgWrap(body, defs);
}

// ================================================================
// MAIN
// ================================================================
function generate(dir, loc) {
  mkdirSync(join(dir, 'monsters'), { recursive: true });
  mkdirSync(join(dir, 'gatekeepers'), { recursive: true });
  mkdirSync(join(dir, 'guardians'), { recursive: true });

  for (const c of MONSTER_CARDS) {
    writeFileSync(join(dir, 'monsters', `${c.id}.svg`), monsterCard(c, loc), 'utf-8');
  }
  for (const c of GATEKEEPER_CARDS) {
    writeFileSync(join(dir, 'gatekeepers', `${c.id}.svg`), gatekeeperCard(c, loc), 'utf-8');
  }
  for (const c of GUARDIAN_CARDS) {
    writeFileSync(join(dir, 'guardians', `${c.id}.svg`), guardianCard(c, loc), 'utf-8');
  }
}

console.log('🔥 Abyssos v4.0 — Card Generator (Locale-aware)\n');

console.log('[1/2] Korean set...');
generate(join(BASE_OUT, 'ko'), 'ko');
console.log(`  ✅ 36 cards → public/images/ko/{monsters,gatekeepers,guardians}/`);

console.log('\n[2/2] English set...');
generate(join(BASE_OUT, 'en'), 'en');
console.log(`  ✅ 36 cards → public/images/en/{monsters,gatekeepers,guardians}/`);

console.log('\n✨ Total 72 cards generated!');
