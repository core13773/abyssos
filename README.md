# 🔥 Abyssos: 9 Circles of Hell

> **"지옥의 가장 깊은 곳에서 깨어나라. 주사위로 이동하고, 타이밍으로 몬스터를 처치하고, 기억력으로 수문장을 넘어서라."**

A mobile-first action roguelike card battle game through Dante's 9 circles of Hell.

## 🎮 How to Play

### Core Loop
1. **🎲 Roll Dice** — Two D6 decide how far you move on the linear board
2. **🎯 Timing Slider** — Fight monsters by tapping at the right moment on the timing bar
3. **🃏 Card Match** — Defeat gatekeepers by finding the correct card among shuffled cards
4. **✨ Collect Guardians** — Earn permanent guardian cards that give you abilities
5. **🏆 Escape** — Clear all 9 circles to win

### Game Mechanics

| Action | Mechanic | How |
|--------|----------|-----|
| Movement | Dice (D6 × 2) | Roll and move right on the board |
| Monster Battle | Timing Slider | Tap when indicator is in the green zone |
| Gatekeeper | Card Match | Remember and find the correct card |
| Events | Auto-resolve | Random rest, trap, blessing, or curse |
| Choices | 50/50 Gamble | Risk it all for big rewards |

### Board Tiles (per circle)
```
A - B - Choice - A - B - Rest - Elite - B - Choice - A - B - Treasure → Gatekeeper
```

### Combo System
- **3 streak**: +15% rewards, "ON FIRE!"
- **5 streak**: +30% rewards, "UNSTOPPABLE!"
- **7 streak**: +50% rewards, "GODLIKE!"

### Guardian Cards (9 total)
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
