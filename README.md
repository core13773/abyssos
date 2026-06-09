# 🔥 Abyssos: The Divine Comedy Trilogy

> **"지옥을 통과하고, 연옥에서 정화되며, 천국에 도달하라."**
> *"Pass through Hell, be purified in Purgatory, and reach Paradise."*

A mobile-first action roguelike card battle game through Dante's **Divine Comedy** — all three canticles: Inferno, Purgatorio, and Paradiso.

| Part | Status | Chapters | Theme |
|------|--------|----------|-------|
| 🔥 **Inferno** (지옥) | ✅ Complete | 9 Circles → Escape | Fear & Survival |
| 🌅 **Purgatorio** (연옥) | 🆕 Designed | 7 Terraces → Purification | Hope & Cleansing |
| ✨ **Paradiso** (천국) | 🆕 Designed | 9 Spheres → Union | Wonder & Transcendence |

📖 Full design document: [PRODUCT_PLAN.md](./PRODUCT_PLAN.md)

## 🎮 How to Play

### The Complete Journey
```
INFERNO (9 circles) → PURGATORIO (7 terraces) → PARADISO (9 spheres)
     ↓                       ↓                          ↓
  Escape Hell           Reunite with Beatrice      Reach the Empyrean
```

### Core Loop (Inferno — Current)
1. **🎲 Roll Dice** — Two D6 decide how far you move on the linear board
2. **🎯 Timing Slider** — Fight monsters by tapping at the right moment on the timing bar
3. **🃏 Unique Boss Fights** — Each gatekeeper has a different mini-game (timing, cards, tap, quiz, choice)
4. **✨ Collect Guardians** — Earn permanent guardian cards that give you stacking abilities
5. **🏆 Escape** — Clear all 9 circles, then continue to Purgatory and Paradise

### Game Mechanics

| Action | Mechanic | How |
|--------|----------|-----|
| Movement | Dice (D6 × 2) | Roll and move right on the board |
| Monster Battle | Timing Slider | Tap when indicator is in the green zone |
| Gatekeeper | 9 Unique Mini-games | Timing, Card Match, Rapid Tap, Quiz, Choice, Multi-tap, Final |
| Events | Auto-resolve | Random rest, trap, blessing, curse, treasure, choice |
| Choices | 50/50 Gamble | Risk it all for big rewards |

### Board Tiles (per circle)
```
A - B - Choice - A - B - Rest - Elite - B - Choice - A - B - Treasure → Gatekeeper
```

### Combo System
- **3 streak**: +15% rewards, "ON FIRE!"
- **5 streak**: +30% rewards, "UNSTOPPABLE!"
- **7 streak**: +50% rewards, "GODLIKE!"

### Guardian Cards (Inferno — 9 total)
Defeat each circle's gatekeeper to earn a guardian card with permanent effects:
- ❄️ Ice Heart: Damage reduction
- 🎭 Mask Secret: Skip 1 battle
- 🩸 Blood Blessing: Lifesteal on victory
- 🔥 Inquisitor's Lantern: See enemy abilities
- 💢 Helm of Wrath: Battle D6 +1
- 💰 Golden Wings: Fly 3 tiles
- ☠️ Cerberus Collar: Roll D6 twice
- 🌪 Storm Grace: Min dice +1
- ✨ Staff of Virgil: All effects +50%

### Full Trilogy Cards (25 total)
- 🔥 **Inferno**: 9 Guardian Cards
- 🌅 **Purgatorio**: 7 Purification Cards (designed, coming soon)
- ✨ **Paradiso**: 9 Celestial Relics (designed, coming soon)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Generate Cards
```bash
node scripts/generate-all-cards.mjs
```

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **State**: Zustand
- **i18n**: Korean / English

## 📁 Project Structure
```
src/
├── app/           # Pages (lobby + game)
├── components/
│   ├── board-v4/  # Linear scrolling board
│   ├── battle/    # Timing slider, card match, rapid tap
│   ├── dice/      # Dice panel + faces
│   ├── events/    # Gatekeeper modal
│   ├── guardian/  # Guardian panel + reward modal
│   ├── layout/    # Game layout + tutorial
│   ├── player/    # HP bar + combo display
│   └── ui/        # Button, Modal, ProgressBar
├── lib/
│   ├── data/      # Monsters, gatekeepers, guardians, circles
│   ├── game/      # Engine, board, battle, events, dice
│   ├── i18n/      # Translations (ko/en)
│   ├── store/     # Zustand game store
│   └── utils/     # Seeded RNG
├── types/         # TypeScript interfaces
└── scripts/       # Card SVG generator
```

## 🌍 Language Support
Toggle between Korean and English using the KO/EN button in the top bar.
