/**
 * Guides content — bilingual (en/ko) article data for the /guides section.
 *
 * Content is original, written specifically for Abyssos, and cross-checked
 * against the real game data (guardians.ts, purgatorio.ts, paradiso.ts,
 * circles.ts, gatekeepers.ts, metaUpgrades.ts, PRODUCT_PLAN.md).
 *
 * Each guide is ~1500–2000 words per language.
 */

export type Locale = 'en' | 'ko';

export interface GuideSection {
  /** Heading text in the section's locale */
  heading: string;
  /** Paragraphs (each array entry is one <p>) */
  paragraphs: string[];
  /** Optional bullet/numbered list (rendered as <ul>) */
  list?: string[];
}

export interface GuideContent {
  /** Window/document title fragment, e.g. "How to Play Abyssos" */
  title: string;
  /** ~150–160 char meta description */
  description: string;
  /** Short kicker shown above the H1 */
  kicker: string;
  /** One-line lead paragraph under the H1 */
  lead: string;
  /** Article body sections */
  sections: GuideSection[];
}

export interface GuideMeta {
  slug: 'how-to-play' | 'guardian-cards' | 'three-modes';
  icon: string;
  /** Card-level labels (used on the guides index) */
  cardTitle: { en: string; ko: string };
  cardExcerpt: { en: string; ko: string };
  accent: string; // tailwind text color class for accents on the index card
  /** Per-locale full content */
  content: { en: GuideContent; ko: GuideContent };
}

// ────────────────────────────────────────────────────────────────────────────
// GUIDE 1 — How to Play
// ────────────────────────────────────────────────────────────────────────────
const HOW_TO_PLAY: GuideMeta = {
  slug: 'how-to-play',
  icon: '📖',
  cardTitle: {
    en: 'How to Play Abyssos: A Beginner’s Guide',
    ko: '어비소스 입문 가이드',
  },
  cardExcerpt: {
    en: 'Learn the core loop — demon duels, board movement, monster battles, gatekeeper bosses — plus seven tips that survive the first run.',
    ko: '악마 도전, 보드 이동, 몬스터 전투, 수문장 보스전까지. 첫 판을 살아남는 7가지 팁까지 정리했습니다.',
  },
  accent: 'text-amber-400',
  content: {
    en: {
      title: 'How to Play Abyssos: A Beginner’s Guide',
      description:
        'A beginner’s guide to Abyssos: what kind of game it is, the core loop of demon duels, board movement, monster battles and gatekeeper bosses, plus seven practical first-run tips.',
      kicker: 'Beginner Guide',
      lead:
        'Abyssos is a strategic roguelike board game inspired by Dante’s Divine Comedy. You roll to move, fight monsters with timing-based skill checks, defeat unique gatekeeper bosses, collect cards, and try to escape the abyss. This guide explains how a run actually plays, from the first tap to the final gate.',
      sections: [
        {
          heading: 'What kind of game is Abyssos?',
          paragraphs: [
            'Abyssos is a single-player, browser-based roguelike board game. Each run is a journey through one of three realms modelled on the Divine Comedy: the 9 Circles of Inferno, the 7 Terraces of Purgatorio, and the 9 Spheres of Paradiso. There is no account, no server save, and no paywall — your progress, card collection, and meta upgrades live in your browser’s local storage. A full run takes roughly 15 to 25 minutes per realm, which makes it well-suited to a commute or a lunch break, and death always sends you back to the start of the realm with whatever soul stones you banked.',
            'The strategy comes from three sources. First, deck-building: across a run you collect 40+ cards (guardians, purifications, relics, curses, consumables) and the combination matters more than any single card. Second, meaningful combat: battles are decided by skill-based mini-games, so “how well you win” changes your rewards. Third, risk versus reward: shortcut tiles, curse cards, and gambling events tempt you to trade safety for power. The game is fully playable with one hand on a phone, supports Korean and English from the top-bar toggle (🇰🇷 / 🇺🇸), and never requires keyboard input. Progress survives a refresh but is wiped if you clear site data.',
          ],
        },
        {
          heading: 'The goal of a run',
          paragraphs: [
            'Each realm has a clear win condition. In Inferno you start at the frozen depths of Circle 9 (Cocytus) and ascend circle by circle — defeating each gatekeeper boss — until you beat the Shadow of Virgil on Circle 1 and escape Hell. In Purgatorio you climb seven terraces themed on the deadly sins, passing each Angel Guardian, to reach Beatrice in the Earthly Paradise. In Paradiso you ascend nine celestial spheres through the archangels’ trials to reach the Empyrean.',
            'Realms unlock progressively: Purgatorio only opens after Inferno, and Paradiso after Purgatorio. This is not just gating — each realm assumes the card literacy and mini-game muscle memory of the one before it. Clearing all three unlocks New Game+ (monsters gain +2 power, rewards scale to 1.5×) and the hidden Corrupted Virgil boss fight, the true endgame challenge.',
          ],
        },
        {
          heading: 'The Inferno board, tile by tile',
          paragraphs: [
            'It helps to know exactly what is on the board before you start tapping. Each of the nine Inferno circles is exactly 12 tiles long, in a fixed pattern: five monster tiles, a midway event tile, five more monster tiles, a second event tile, then the gatekeeper boss fight that closes the circle. Win the boss and you roll into the next circle.',
            'Tile composition matters because it tells you when to push and when to pull back. The five-monster stretches are where most of your HP swings happen, so you want to enter them with enough health to absorb a Fumble or two. The event tiles at positions 6 and 12 are inflection points — a well-timed shop, starlight box, or rest event can reset your run; a bad Wheel of Desire spin can end it. The gatekeeper at the end is always a fixed, known boss for that circle (the Ice Goliath on Circle 9, the Lord of Masks on Circle 8, down to the Shadow of Virgil on Circle 1), so you can plan HP and consumables around the specific mini-game that boss uses. Some tiles are also marked with a crown (👑) to signal an elite monster: elites hit harder but pay triple HP, so the optimal pattern is often to fight monsters until you are healthy, deliberately seek the elite, then heal up again before the gatekeeper.',
          ],
        },
        {
          heading: 'The core loop, turn by turn',
          paragraphs: [
            'A turn breaks down into a small number of repeating steps. Understanding this loop is 90% of learning the game.',
          ],
          list: [
            'Demon Duel (movement): Movement is decided by a rotating skill mini-game, not a plain die. You might whack demons, stop a timing slider in the green zone, or remember a path. Your score converts directly into how many tiles you advance. There are fifteen of these mini-games in rotation, so each turn feels different.',
            'Land on a tile: The board mixes monster tiles, event tiles, and — at the end of each stretch — a gatekeeper boss tile. What you land on decides what happens next.',
            'Resolve the tile: Fight a monster, trigger an event (rest, trap, blessing, curse, treasure, choice, shop, the Wheel of Desire, a cursed altar, or a starlight box), or challenge a gatekeeper.',
            'Collect rewards: Win a fight and you gain HP, soul stones, and sometimes a card. Stack wins for combo bonuses (3-in-a-row +15%, 5-in-a-row +30%, 7-in-a-row +50%) — the combo multiplier is the single biggest reward lever in the game, so protecting a streak matters more than any one fight’s payout.',
            'Repeat until the gatekeeper: Each Inferno circle is 12 tiles long. Reach the end and the gatekeeper boss fight triggers. Win to claim a guardian card and advance to the next circle.',
          ],
        },
        {
          heading: 'A walk-through of one full turn',
          paragraphs: [
            'To make the loop concrete, here is a typical Circle 6 (Heresy) turn. You tap the board and the game launches a Demon Duel — say, a timing-slider movement game. You aim for the green zone, land a “good” score, and the game awards four tiles of movement. Your token lands on a monster tile: a flame-type enemy with power 4.',
            'The combat mini-game launches — for fire that is an arithmetic challenge. You solve enough problems to earn a +2 bonus, the game rolls a D6 (it comes up 4), and your total of 6 beats the enemy’s 4 by a margin of 2. Because you won, you heal HP scaled by the margin, earn a soul stone (two on a “perfect” score), and your combo counter ticks up to 3, triggering the +15% reward bonus on top. A natural 6 instead of the 4 would have been a Critical (double healing); a natural 1 with a loss would have been a Fumble (double damage).',
            'Now suppose the next Demon Duel is weak — you score only 2 and land on the Wheel of Desire. With a healthy HP buffer you might spin for the 15% jackpot or 25% payout, accepting the 30% “nothing” and 30% curse outcomes; with low HP you walk past it. Events do not break streaks (only losses do), so the combo is preserved as you plan the next move toward the elite or the gatekeeper.',
          ],
        },
        {
          heading: 'How combat actually works',
          paragraphs: [
            'Combat is not a flat die roll against a stat block. When you land on a monster tile, the game launches a short skill mini-game matched to that monster’s element — number memory for ice, card-match for illusion, whack-a-mole for blood, arithmetic for fire, reflex catching for poison, and so on. Your performance sets a bonus that is added to a D6 roll, and that total is compared to the enemy’s power. Beat the power and you win; the margin of victory often scales your reward, which is why a “perfect” mini-game score is worth chasing even on enemies you can already beat.',
            'A natural 6 on the die plus a win is a Critical (double healing). A natural 1 plus a loss is a Fumble (double damage). These two outcomes are the main source of swing in the game — a Critical can rescue a bad run, and a Fumble can kill a good one. Elite monsters, marked with a crown, have +2 power and pay triple HP rewards, so they are the highest-value targets on the board when you can beat them. Boss fights (gatekeepers, angels, archangels) each use a unique signature mini-game, so no two bosses test the same skill. The practical consequence is that the D6 matters less than your mini-game bonus: a player who consistently earns +3 can absorb an unlucky 1 or 2 and still beat power-4 enemies. And because element determines the mini-game, your personal skill profile matters — if you are weak at arithmetic, fire enemies on Circle 6 are genuinely more dangerous for you than the stats suggest.',
          ],
        },
        {
          heading: 'Cards, curses, and consumables',
          paragraphs: [
            'Cards are the heart of long-term power. Guardian cards (Inferno), purification cards (Purgatorio), and celestial relics (Paradiso) are permanent for the run and stack with each other. Curse cards are the dark mirror — strong immediate effects with persistent penalties — and they are entirely optional: you only take one from a cursed altar or a bad gamble, so a cautious player can finish a run curse-free. Consumables are one-shot items bought from the Soul Merchant with soul stones or pulled from starlight boxes, usable mid-fight, and they include healing (Roasted Meat, Holy Potion), dice rerolls, and one-time buffs. Do not hoard them: a roasted meat that saves your run on Circle 3 is worth more than a Holy Potion you never use, and the most common beginner mistake is dying with a full inventory.',
            'The shop itself deserves attention. The Soul Merchant stocks consumables, card upgrades (a guardian effect can be boosted +25% for 15 soul stones), and information items like the Crystal of Foreknowledge, which previews the next event. Soul stones are also your meta currency, so every stone you spend in-shop is a stone not spent on a permanent upgrade between runs. Early on, favour permanent upgrades over one-run consumables; once your meta build is mature, the shop becomes more attractive. A good rule of thumb: if you are below 60% HP approaching a gatekeeper, spend the consumable before the fight — entering a gatekeeper fight at full HP is worth more than the consumable you “saved.”',
          ],
        },
        {
          heading: 'The three modes, briefly',
          paragraphs: [
            'Inferno is a survival horror about HP management and raw power. Purgatorio replaces combat pressure with moral choice events (sin projections) and a virtue stat, and introduces grace as a concept. Paradiso is about grace accumulation and multi-stage angelic trials. The full breakdown is in the dedicated Three Modes guide, but the short version: start with Inferno, because Purgatorio and Paradiso build on the cards and habits you learn there. A useful frame — Inferno tests execution under pressure, Purgatorio tests judgement, and Paradiso tests consistency.',
          ],
        },
        {
          heading: 'Controls',
          paragraphs: [
            'Abyssos is designed for one hand on a phone. Almost every interaction is a tap or click. Movement mini-games use tap-to-stop or tap-the-target; monster battles use tap, drag, or type depending on the element. The language toggle lives in the top bar (🇰🇷 / 🇺🇸). There is no keyboard requirement, but some arcade mini-games accept Space and arrow keys.',
            'A few non-obvious UI tips: tapping and holding on a card opens a longer description of its effects; the HP bar turns red and pulses when you enter the crisis zone (HP at or below 25%), which is your cue to consider a defensive consumable; and the combo banner only appears once you hit a 3-streak, so the first two wins of a streak are silent.',
          ],
        },
        {
          heading: 'Seven tips for your first run',
          paragraphs: [
            'These are the habits that separate a first-run death from a first-run clear.',
          ],
          list: [
            'Learn one movement mini-game at a time. There are fifteen, and you will see them in rotation. Focus on consistent “good” scores rather than chasing perfects on games you barely understand — a steady 3 tiles every turn beats alternating between 6 and 0.',
            'Respect the crisis zone. At low HP (25% or below) the screen edges flash red. A clutch win in crisis mode pays +30% rewards, but only take that fight if your mini-game is strong. The crisis bonus is tempting, but it does not offset a Fumble.',
            'Spend consumables before bosses, not after. Heal up so you enter the gatekeeper fight near full HP — boss penalties push you back and chip health on a loss. Entering Virgil on Circle 1 at 70% HP rather than 40% is often the difference between escaping and dying.',
            'Read the guardian card you just earned. Each guardian changes your build. The Helm of Wrath adds D6+1 but cuts healing 30%; the Heart of the Ice Goliath flatly reduces damage taken; the Collar of Cerberus lets you roll the battle die twice. Play to the card, not against it — if you took the Helm, switch to short fights and consumable healing rather than prolonged brawling.',
            'Never gamble your last HP. The Wheel of Desire and choice events can pay huge, but a 30% “nothing” outcome and a 30% curse outcome are both real possibilities. Only gamble with a buffer of at least 30% HP, and treat the cursed altar (strong effect plus persistent penalty) as a calculated choice, not a freebie.',
            'Prioritise elite monsters (👑) when you are healthy. Triple HP rewards accelerate a run more than any shop purchase. The flip side: never fight an elite in the crisis zone unless you are confident in that element’s mini-game — a Fumble against an elite can one-shot you.',
            'Buy meta upgrades between runs. Soul stones carry over via the meta system. The five permanent upgrades are HP Boost (+10 Max HP per level), Dice Stabilizer (raises the minimum die value), Starting Consumable, Starlight Box Quality, and Blessing of Revival (a one-time respawn at 0 HP). HP Boost, Dice Stabilizer, and Blessing of Revival are the highest-value early purchases and make every subsequent run easier.',
          ],
        },
        {
          heading: 'Common beginner mistakes',
          paragraphs: [
            'Beyond the seven tips, a few patterns kill first runs over and over. Treating the Demon Duel as a coin flip is one: movement is a skill mini-game, so players who zone out land on worse tiles and bleed HP all run. Breaking a combo by taking a fight you might lose is another — the combo multiplier (up to +50% at a 7-streak) is worth more than almost any single reward, so once you are streaking, prefer safe fights and use an active ability to skip an elite in your worst element rather than risk the streak. A third is ignoring the gatekeeper’s specific mechanic: each gatekeeper has a known difficulty profile (the Avatar of Wrath speeds up +15% on every miss, the Storm Wraith randomises slider speed by ±40%, Cerberus needs two successes out of three timing attempts), so if you know you are weak at one, save a skip or consumable for that fight. And finally, do not hoard soul stones — the meta upgrades are permanent and compound, so spending 5 stones on the first level of HP Boost now beats sitting on 30 “for later.”',
          ],
        },
        {
          heading: 'What to do next',
          paragraphs: [
            'Play Inferno once without worrying about optimisation — you are learning the fifteen movement mini-games, the fifteen combat mini-games, and the feel of the board. Your goal on run one is not to clear; it is to see every circle at least once and bank enough soul stones for a meta upgrade or two. On your second run, start thinking about card synergies (covered in the Guardian Cards guide) and which meta upgrades fit your playstyle.',
            'A concrete first milestone: by the end of your third Inferno run, own at least two levels of HP Boost and one level of Dice Stabilizer. That combination smooths out the early circles enough that you can focus on the later gatekeepers, which is where most first clears stall. From there, the Blessing of Revival (30 stones) is the purchase that turns a “close call” into a finished run.',
          ],
        },
      ],
    },
    ko: {
      title: '어비소스 입문 가이드',
      description:
        '어비소스 입문 가이드: 어떤 게임인지, 악마 도전·보드 이동·몬스터 전투·수문장 보스전으로 이어지는 핵심 루프, 그리고 첫 판을 살아남는 7가지 실전 팁까지 정리했습니다.',
      kicker: '입문 가이드',
      lead:
        '어비소스는 단테의 신곡에서 영감을 받은 전략적 로그라이크 보드게임입니다. 주사위를 굴려 이동하고, 타이밍 미니게임으로 몬스터와 싸우고, 각 층의 수문장 보스를 쓰러뜨리고, 카드를 모으며 심연에서 탈출하는 것이 목표입니다. 이 가이드는 첫 탭부터 마지막 관문까지 한 판이 어떻게 흘러가는지 설명합니다.',
      sections: [
        {
          heading: '어비소스는 어떤 게임인가요?',
          paragraphs: [
            '어비소스는 브라우저에서 즐기는 1인용 로그라이크 보드게임입니다. 한 판은 신곡을 모티브로 한 세 개의 세계 중 하나를 여행합니다. 지옥의 9층, 연옥의 7개 테라스, 천국의 9개 천구가 그것입니다. 회원가입도, 서버 저장도, 유료 결제도 없습니다. 진행도와 카드 컬렉션, 메타 업그레이드는 모두 브라우저 로컬 저장소에 보관됩니다.',
            '전략의 재미는 세 가지에서 옵니다. 첫째, 덱 빌딩 — 한 판 동안 40장 이상의 카드(수호카드, 정화카드, 성물, 저주카드, 소모품)를 모으게 되는데, 단일 카드보다 조합이 훨씬 중요합니다. 둘째, 의미 있는 전투 — 승부는 스킬 미니게임으로 결정되므로 “얼마나 잘 이기느냐”가 보상을 바꿉니다. 셋째, 리스크와 보상 — 지름길 타일과 저주카드, 도박 이벤트가 끊임없이 안전과 힘을 맞바꾸도록 유혹합니다.',
          ],
        },
        {
          heading: '한 판의 목표',
          paragraphs: [
            '각 세계에는 명확한 클리어 조건이 있습니다. 지옥편에서는 9층 코퀴토스의 얼음에서 시작해 층마다 수문장 보스를 쓰러뜨리며 상승하고, 1층에서 베르길리우스를 이기면 지옥을 탈출합니다. 연옥편에서는 7개의 테라스를 올라 죄를 정화하고 일곱 수호천사의 시험을 통과해 베아트리체가 있는 지상낙원에 닿습니다. 천국편에서는 9개의 천구를 승천하며 대천사의 시험을 통과해 엠피리오의 빛에 도달합니다.',
            '세계는 순차적으로 열립니다. 지옥을 클리어해야 연옥이, 연옥을 클리어해야 천국이 해금됩니다. 세 편을 모두 클리어하면 뉴 게임+(더 강한 몬스터, 더 큰 보상)과 히든 보스 타락한 베르길리우스 도전이 열립니다.',
          ],
        },
        {
          heading: '핵심 루프',
          paragraphs: [
            '한 턴은 몇 안 되는 반복 단계로 이루어집니다. 이 루프를 이해하면 게임의 90%를 배운 것입니다.',
          ],
          list: [
            '악마 도전(이동): 이동은 단순한 주사위가 아니라 회전식 스킬 미니게임으로 결정됩니다. 악마를 잡거나, 타이밍 슬라이더를 초록 존에 멈추거나, 경로를 외우는 식입니다. 점수가 곧 전진하는 칸 수가 됩니다.',
            '타일에 착지: 보드는 몬스터 타일, 이벤트 타일, 그리고 구간 끝의 수문장 보스 타일로 섞여 있습니다. 어디에 떨어지느냐가 다음을 결정합니다.',
            '타일 해결: 몬스터와 싸우거나, 이벤트(휴식·함정·축복·저주·보물·선택·상점·욕망의 바퀴·저주 제단·별빛 상자)를 겪거나, 수문장에 도전합니다.',
            '보상 획득: 전투에서 이기면 HP와 영혼석, 때로는 카드를 얻습니다. 연승하면 콤보 보너스(3연승 +15%, 5연승 +30%, 7연승 +50%)가 쌓입니다.',
            '수문장까지 반복: 지옥 각 층은 12칸입니다. 끝에 도달하면 수문장 보스전이 시작되고, 이기면 수호카드를 얻고 다음 층으로 넘어갑니다.',
          ],
        },
        {
          heading: '전투는 실제로 어떻게 돌아가나',
          paragraphs: [
            '전투는 스탯 블록에 대한 단순 주사위 굴림이 아닙니다. 몬스터 타일에 착지하면 그 몬스터의 원소에 맞는 짧은 스킬 미니게임이 시작됩니다. 얼음은 숫자 암기, 환영은 카드 짝 맞추기, 피는 두더지 잡기, 불은 산수, 독은 낙하 캐치 식입니다. 여기서 낸 점수가 보너스가 되어 D6 굴림에 더해지고, 그 합이 적의 전투력보다 높으면 승리합니다. 여유가 크면 보상 배율도 오르는 경우가 많습니다.',
            '주사위가 6이 나오고 이기면 크리티컬(회복 2배), 1이 나오고 지면 펌블(피해 2배)입니다. 왕관 표시가 있는 엘리트 몬스터는 전투력 +2에 HP 보상 3배를 주어 보드에서 가장 가치 있는 목표입니다. 보스전(수문장·천사·대천사)은 각자 고유의 시그니처 미니게임을 써서 같은 스킬을 두 번 테스트하는 일이 없습니다.',
          ],
        },
        {
          heading: '카드, 저주, 소모품',
          paragraphs: [
            '카드는 장기적인 힘의 핵심입니다. 수호카드(지옥), 정화카드(연옥), 성물(천국)은 한 판 내내 유지되며 서로 겹쳐 효과를 냅니다. 저주카드는 거울처럼 반대입니다 — 강력한 즉시 효과에 지속 패널티가 붙으며, 완전히 선택 사항이라 저주 제단이나 도박 실패로만 들어옵니다. 소모품은 영혼석으로 영혼 상인에게 사거나 별빛 상자에서 얻는 1회용 아이템으로, 전투 도중에도 쓸 수 있습니다.',
            '소모품을 아끼지 마세요. 3층에서 판을 살려주는 구운 고기 한 조각이, 끝까지 쓰지 못한 신성한 물약보다 가치가 큽니다. 초보가 가장 많이 하는 실수가 인벤토리를 가득 채운 채로 죽는 것입니다.',
          ],
        },
        {
          heading: '세 가지 모드, 간략히',
          paragraphs: [
            '지옥은 HP 관리와 순수한 화력의 생존 호러입니다. 연옥은 전투 압박 대신 도덕적 선택 이벤트(죄의 투영)와 덕목 스탯을 들고 오며 은총을 소개합니다. 천국은 은총 축적과 다단계 천사 시험의 세계입니다. 자세한 비교는 ‘3가지 모드’ 가이드에 따로 있지만, 짧게 말해 지옥부터 시작하세요. 연옥과 천국은 거기서 배운 카드와 습관 위에 세워집니다.',
          ],
        },
        {
          heading: '조작법',
          paragraphs: [
            '어비소스는 폰으로 한 손에 즐기도록 설계됐습니다. 거의 모든 상호작용이 탭이나 클릭입니다. 이동 미니게임은 탭해서 멈추거나 탭해서 맞추는 방식이고, 몬스터 전투는 원소에 따라 탭·드래그·타이핑을 섞어 씁니다. 언어 전환은 상단 바(🇰🇷 / 🇺🇸)에 있습니다. 키보드가 필수는 아니지만, 일부 아케이드 미니게임은 Space와 방향키를 지원합니다.',
          ],
        },
        {
          heading: '첫 판을 위한 7가지 팁',
          paragraphs: [
            '첫 판 사망과 첫 판 클리어를 가르는 습관들입니다.',
          ],
          list: [
            '이동 미니게임을 한 종류씩 익히세요. 열다섯 종이 돌아가며 나옵니다. 이해도가 낮은 게임에서 퍼펙트를 노리기보다 안정적으로 “준수한” 점수를 내는 데 집중하세요.',
            '위기 구간을 의식하세요. HP가 낮으면 화면 테두리가 붉게 점멸합니다. 위기 모드에서의 간신히 승리는 보상 +30%를 주지만, 자신 있는 미니게임일 때만 싸우세요.',
            '소모품은 보스 “직전”에 쓰세요, 직후가 아니라. 수문장에 풀 HP로 진입하도록 미리 회복하세요. 보스는 패널티로 밀어내고 체력을 깎습니다.',
            '방금 얻은 수호카드 효과를 읽으세요. 각 카드가 빌드를 바꿉니다. 분노의 투구는 D6+1을 주지만 회복 30%를 깎고, 얼음 거인의 심장은 받는 피해를 고정으로 줄입니다. 카드에 맞춰 플레이하세요.',
            '마지막 HP로 도박하지 마세요. 욕망의 바퀴와 선택 이벤트는 큰 보상을 줄 수 있지만 30% “꽝”도 현실입니다. 여유가 있을 때만 겁니다.',
            '체력이 좋을 때 엘리트 몬스터(👑)를 노리세요. HP 보상 3배가 상점 구매보다 판을 빠르게 앞당깁니다.',
            '판 사이에 메타 업그레이드를 사세요. 영혼석은 메타 시스템으로 이어집니다. 생명력 강화·주사위 안정화·부활의 축복이 초기 가장 가성비가 좋으며 이후 모든 판을 쉽게 만듭니다.',
          ],
        },
        {
          heading: '다음에는',
          paragraphs: [
            '최적화를 신경 쓰지 말고 지옥을 한 판 돌리세요. 열다섯 가지 미니게임과 보드의 감각을 익히는 것이 우선입니다. 두 번째 판부터는 카드 시너지(‘가디언 카드’ 가이드에서 다룹니다)와 자신의 플레이 스타일에 맞는 메타 업그레이드를 고민하기 시작하세요. 지옥을 클리어하면 연옥과 천국은 낯익지만 새로운 습관을 요구하고, 그 부분은 ‘3가지 모드’ 가이드가 차근차근 짚어줍니다.',
          ],
        },
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// GUIDE 2 — Guardian Cards
// ────────────────────────────────────────────────────────────────────────────
const GUARDIAN_CARDS: GuideMeta = {
  slug: 'guardian-cards',
  icon: '🃏',
  cardTitle: {
    en: 'Guardian Cards Explained: Strategy and Synergies',
    ko: '가디언 카드 공략',
  },
  cardExcerpt: {
    en: 'What the nine Inferno guardian cards do, how their effects stack, when to play the active ones, and three example synergy builds that carry a run.',
    ko: '아홉 수호카드의 효과, 효과가 어떻게 겹치는지, 액티브 카드를 언제 쓸지, 그리고 한 판을 가져오는 시너지 빌드 세 가지.',
  },
  accent: 'text-red-400',
  content: {
    en: {
      title: 'Guardian Cards Explained: Strategy and Synergies',
      description:
        'A strategy guide to Abyssos guardian cards: what each of the nine Inferno guardians does, how passive and active effects stack, when to spend one-time actives, and three proven synergy builds.',
      kicker: 'Card Strategy',
      lead:
        'Guardian cards are the backbone of an Inferno run. You earn one from every gatekeeper you defeat, and because you face nine gatekeepers on the way out of Hell, a full set is nine cards. This guide explains what each guardian does, how their effects combine, and how to build a coherent deck instead of a pile of bonuses.',
      sections: [
        {
          heading: 'What guardian cards are',
          paragraphs: [
            'A guardian card is a permanent, run-long buff earned by defeating a circle’s gatekeeper boss. Every guardian has a main effect and a sub-effect, and a few also grant an active ability on a cooldown or as a one-time spend. Once earned, a guardian never leaves your deck for the rest of the run, which is why the order in which you earn them shapes your build. You collect them in a fixed geographic order — Circle 9 first, Circle 1 last — so the early circles dictate the foundation of your deck and the late circles decide how it caps off.',
            'There are three flavours. Passive guardians are always on — the Heart of the Ice Goliath reduces all damage taken by 2 every single fight, with no button to press and no cost to pay. Active guardians give a button you press — the Golden Wings let you fly up to three tiles on a three-turn cooldown, and the Secret of the Mask Caster lets you skip one battle entirely (one-time use). A few guardians are both, and the Staff of Virgil — the final reward for clearing Circle 1 — amplifies every other guardian’s effects by 50%. Because guardians stack and never expire, your total power at the end of a run is mostly a function of which nine you earned and how well they reinforce each other.',
            'It is worth internalising that guardians are earned, not chosen. You cannot reroll a gatekeeper’s reward or skip a circle, so the nine guardians you finish a run with are the nine the map gave you. Skill in Inferno is therefore less about “drafting the perfect deck” and more about reading the hand you are dealt and finding the synergy that is actually present, not the one you planned for before the run started.',
          ],
        },
        {
          heading: 'The nine guardians, at a glance',
          paragraphs: [
            'You earn guardians in reverse circle order: Circle 9 first, Circle 1 last. Here is what each one does, in the order you will typically meet them, with notes on why each matters.',
          ],
          list: [
            'Heart of the Ice Goliath (Circle 9, ice, passive) — All damage taken −2; trap damage −50%. The defensive foundation, and the first guardian most runs see. Because it is flat reduction applied before any multiplier, every point of it effectively counts double against rapid multi-hit attacks. Stack this early and the whole run gets safer.',
            'Secret of the Mask Caster (Circle 8, illusion, active) — Skip one battle, one-time use; 20% chance to negate an enemy ability. The skip is the valuable half. Save it for a fight you would lose — typically a healthy elite in your weakest element, or a second-attempt gatekeeper where a loss would kill you.',
            'Blessing of Blood (Circle 7, blood, passive) — Heal the excess damage when you win a fight; +1 D6 when at 30% HP or below. Turns aggression into sustain, and the low-HP dice bonus stacks with other dice guardians to make crisis-mode fights surprisingly winnable.',
            'Inquisitor’s Lantern (Circle 6, fire, passive) — Reveal the enemy ability before battle; +30% success on quizzes and trials. Pure information, which removes the main source of “unfair” deaths. The trial-success bonus is also extremely strong in Purgatorio, where Angel Guardian trials are quiz- and timing-based.',
            'Helm of Wrath (Circle 5, mud, passive) — Battle D6 +1; healing −30% as a tradeoff. The signature offensive card; respect the healing penalty. The +1 is large on a six-sided die, but the penalty means you must end fights quickly or the math turns against you.',
            'Golden Wings (Circle 4, gold, active) — Fly up to 3 tiles on a 3-turn cooldown; permanent +1 movement. Board control and the best movement card in the game. The renewable fly lets you skip dangerous stretches, dodge elites, and guarantee shop access before a gatekeeper.',
            'Collar of Cerberus (Circle 3, poison, passive) — Roll the battle D6 twice and keep the better result; monster ability trigger chance −25%. Consistency on your most important die. Statistically this raises your average D6 by roughly 1.25, and the monster-ability suppression makes elite fights safer.',
            'Grace of the Storm (Circle 2, wind, passive) — Minimum die value +1 (1s and 2s become 3s); full immunity to forced movement. Removes the worst variance from your dice and completely neuters event tiles that would shove you backwards.',
            'Staff of Virgil (Circle 1, holy, both) — All guardian effects +50%; opens the escape gate on acquisition. The capstone that multiplies everything you built. The run’s biggest power spike, and worth protecting a run to reach.',
          ],
        },
        {
          heading: 'How effects stack',
          paragraphs: [
            'Most guardian bonuses are flat and additive. D6 bonuses stack: the Helm of Wrath (+1) combines with the Collar of Cerberus’ “roll twice, keep better” to produce a die that is both larger and more reliable. Damage reduction stacks multiplicatively in effect — Heart of the Ice Goliath’s flat −2 sits in front of every hit, and the Staff of Virgil then amplifies the guardian portion by 50%. Movement bonuses from the Golden Wings (+1 permanent) and grace-style effects add cleanly.',
            'The key insight is that the Staff of Virgil amplifies guardian effects, not raw stats. If you are planning to reach Circle 1 with a strong set, value guardians whose effects scale visibly when amplified: the Ice Goliath’s −2 becomes effectively −3, the Helm’s +1 becomes effectively +2 on a six-sided die for threshold purposes, and the Blessing of Blood’s excess-healing effect becomes 50% more healing on every win. This makes defensive and dice-based guardians the best targets for the Staff. Conversely, the Collar of Cerberus’ “roll twice, keep better” is a mechanic rather than a number, so the Staff does not double it into “roll three times” — it simply raises the value of the better result you were already keeping.',
            'One non-obvious interaction: the Helm of Wrath’s healing penalty is itself a guardian effect, so the Staff of Virgil amplifies the penalty too (effectively making healing even worse, around −45% instead of −30%). If you are running a Helm-of-Wrath build, this is the cost of the Staff’s upside, and it is usually worth paying because the +1 becomes +2. Just know the Staff is not a strict upgrade for every guardian — it sharpens both edges of tradeoff cards.',
          ],
        },
        {
          heading: 'When to play active guardians',
          paragraphs: [
            'Active guardians are precious because they are scarce. The Golden Wings fly is renewable (3-turn cooldown) — use it freely to skip dangerous tile stretches, to dodge an elite you cannot beat, or to reach a shop tile before a gatekeeper. A good habit is to treat the fly as your default answer to a bad Demon Duel roll: if the movement mini-game puts you on a tile you do not want, the fly lets you correct it on the same turn. Because the cooldown is only three turns, you will usually have it back by the next time you need it.',
            'The Secret of the Mask Caster skip is one-time only, so never spend it on a fight you would win. The correct target is a healthy elite monster whose element is your weakest mini-game, or a second-attempt gatekeeper fight where a loss would kill you. A common mistake is “saving” the Mask skip until it is too late. If you are at 60% HP facing an elite whose mini-game you historically fail, spend it. Dying with the skip unused wastes it completely — the run ends and the skip never mattered.',
            'A subtle point about the Mask’s secondary effect — the 20% chance to negate an enemy ability is passive and always on, so even after you have spent the skip, the card is not dead weight. It quietly protects you from one in five special attacks for the rest of the run. Do not forget this when evaluating whether to take the card seriously after the skip is gone.',
          ],
        },
        {
          heading: 'Three synergy builds',
          paragraphs: [
            'A deck is more than the sum of its cards. These three archetypes cover most successful Inferno runs, and each one names the guardians that make it work.',
          ],
          list: [
            'The Tank (defensive control) — Heart of the Ice Goliath + Blessing of Blood + Staff of Virgil. The Ice Goliath cuts every hit, Blessing of Blood turns winning fights into healing, and the Staff amplifies both. You win by never dying; offence comes from sustained chip damage. Strong into the later circles where boss penalties are brutal, because the −2 (amplified to −3) eats the pushback chip damage that would otherwise kill a frail build.',
            'The Berserker (high-roll offence) — Helm of Wrath + Collar of Cerberus + Grace of the Storm. Roll-twice-keep-better with +1 and a raised floor means your battle D6 is consistently 4–6, which is usually enough to one-shot most non-elite enemies and burst down elites. The healing penalty hurts, so pair with consumable healing and Blessing of Blood if you have it. Melts elites and gatekeepers but is fragile — every fight should be short.',
            'The Navigator (movement and information) — Golden Wings + Inquisitor’s Lantern + Grace of Storm. Fly over tiles, never suffer forced movement, and see every enemy ability in advance. The safest build for a first clear, because information plus board control removes most causes of death. If you can also pick up the Mask Caster, this build becomes nearly untouchable: you fly past what you cannot beat, skip the one fight you cannot avoid, and see everything else coming.',
          ],
        },
        {
          heading: 'Pairing guardians with gatekeepers',
          paragraphs: [
            'Because each guardian is tied to a specific gatekeeper, you can think about pairings in advance. The Ice Goliath’s Heart (Circle 9) trivialises the Avatar of Wrath on Circle 5, whose escalating slider speed is less threatening when every miss costs less HP. The Collar of Cerberus (Circle 3) is a direct answer to the multitap Cerberus fight that grants it — you fight Cerberus to earn the card that would have made the fight easier, which is the game’s dry sense of humour. The Inquisitor’s Lantern (Circle 6) sets up the Flame Inquisitor’s own quiz mechanic; if you are weak at lore quizzes, the Lantern’s reveal + trial bonus makes every subsequent quiz boss, including the Shadow of Virgil’s final-trial question, meaningfully easier.',
            'The practical takeaway is that some guardians are “self-referential” — the gatekeeper that grants them tests the same skill the guardian then helps you with for the rest of the run. This means circles where you struggle often produce guardians that would have helped, which is a forgiving design: the run tends to give you tools that patch the holes you just demonstrated you have.',
          ],
        },
        {
          heading: 'Guardians and the other realms',
          paragraphs: [
            'Guardian cards carry into the crossover systems even though Purgatorio and Paradiso have their own card types. The Inquisitor’s Lantern’s +30% trial success is quietly one of the strongest cards in Purgatorio, where Angel Guardian trials are quiz- and timing-based (the Angel of Humility’s trial, the Angel of Temperance’s 3-of-5 quiz, the Angel of Purity’s multi-stage timing), and its enemy-ability reveal stays useful on any tile that still spawns a fight. The Blessing of Blood’s low-HP D6 bonus remains relevant in Purgatorio’s occasional combat, and the Heart of the Ice Goliath’s flat damage reduction is a permanent survival cushion across all three realms.',
            'When you plan an Inferno run with the trilogy in mind, value guardians whose effects translate across realms — information, consistency, and crisis recovery age better than pure Inferno-only damage. The Helm of Wrath’s D6 +1 is still good in Purgatorio and Paradiso, but its healing penalty matters less there (combat is rarer), so the tradeoff becomes almost free in the later realms. The Golden Wings’ movement is universally useful, because every realm has tiles you would rather skip.',
          ],
        },
        {
          heading: 'Pitfalls to avoid',
          paragraphs: [
            'First, do not build “all nine” — you cannot force which guardians you see, and over-committing to a planned build causes tilt when the circles give you something different. Take what the circles give you and find the synergy in the hand you are dealt. The three builds above are archetypes, not shopping lists; a deck with Ice Goliath, Cerberus, and Grace of the Storm is a perfectly good “consistency tank” even though it matches no named build.',
            'Second, the Helm of Wrath’s healing penalty is real. If you take it, change your playstyle toward short fights and consumable healing, and avoid taking unnecessary elite fights in the crisis zone. The Helm is a power tool, not a free stat stick, and players who treat it as pure upside bleed out in the middle circles.',
            'Third, the Staff of Virgil is worth protecting the run for. Entering Circle 1 with a deep guardian set and then winning the Virgil fight is the single biggest power spike in Inferno — every guardian you earned suddenly does 50% more. If you are near Circle 1 with a strong set, play conservatively, heal to full, and consider spending a consumable or a skip to guarantee the Virgil win. The payoff (an escape and an amplified full deck) is the run’s capstone.',
            'Fourth, do not sleep on the sub-effects. Many players read only the main effect and miss that the Collar of Cerberus also cuts monster ability trigger chance by 25%, or that the Secret of the Mask Caster keeps its 20% ability-negate after the skip is spent. Sub-effects are often what makes a guardian worth taking seriously even when its main effect looks situational.',
          ],
        },
      ],
    },
    ko: {
      title: '가디언 카드 공략',
      description:
        '어비소스 수호카드 공략: 아홉 수호카드의 효과, 패시브와 액티브가 어떻게 겹치는지, 1회용 액티브를 언제 쓸지, 그리고 검증된 시너지 빌드 세 가지를 정리합니다.',
      kicker: '카드 공략',
      lead:
        '수호카드는 지옥 한 판의 뼈대입니다. 수문장을 쓰러뜨릴 때마다 한 장씩 얻고, 지옥을 빠져나가는 길에 수문장 아릅을 만나므로 풀세트는 아홉 장입니다. 이 가이드는 각 카드가 무엇을 하는지, 효과가 어떻게 합쳐지는지, 보너스를 무작위로 쌓는 대신 일관된 덱을 짜는 법을 설명합니다.',
      sections: [
        {
          heading: '수호카드란',
          paragraphs: [
            '수호카드는 층의 수문장 보스를 처치하면 얻는, 한 판 내내 유지되는 버프입니다. 모든 수호카드는 주효과와 보조 효과가 있고, 일부는 쿨다운이나 1회용 액티브 능력도 줍니다. 한 번 얻은 수호카드는 판이 끝날 때까지 덱에서 떠나지 않으므로, 어떤 순서로 모으느냐가 빌드를 정합니다.',
            '세 가지 유형이 있습니다. 패시브 수호카드는 항상 켜져 있습니다 — 얼음 거인의 심장은 매 전투마다 받는 피해를 2 줄입니다. 액티브 수호카드는 누르는 버튼을 줍니다 — 황금의 날개는 3턴 쿨다운으로 최대 3칸을 비행하고, 가면술사의 비밀은 전투를 1회 아예 건너뜁니다(1회용). 일부는 둘 다 있으며, 1층 클리어 보상인 베르길리우스의 지팡이는 다른 모든 수호카드의 효과를 50% 강화합니다.',
          ],
        },
        {
          heading: '아홉 수호카드 한눈에',
          paragraphs: [
            '수호카드는 역순으로 얻습니다. 9층부터, 1층이 마지막입니다. 보통 만나는 순서대로 정리합니다.',
          ],
          list: [
            '얼음 거인의 심장(9층, 얼음, 패시브) — 받는 모든 피해 −2, 함정 피해 −50%. 방어의 기둥입니다. 일찍 쌓으면 판 전체가 안전해집니다.',
            '가면술사의 비밀(8층, 환영, 액티브) — 전투 1회 스킵(1회용), 적 능력 20% 확률 무효. 스킵은 질 싸움을 위해 아끼세요.',
            '피의 축복(7층, 피, 패시브) — 전투 승리 시 초과 피해만큼 HP 회복, HP 30% 이하일 때 D6 +1. 공격을 지속력으로 바꿉니다.',
            '심문관의 등불(6층, 불, 패시브) — 전투 전 적 능력 열람, 퀴즈·시련 성공률 +30%. 정보 카드로 연옥에서 극강입니다.',
            '분노의 투구(5층, 진흙, 패시브) — 전투 D6 +1, 회복량 −30% 트레이드오프. 대표 공격 카드, 패널티를 의식해야 합니다.',
            '황금의 날개(4층, 황금, 액티브) — 3턴 쿨다운으로 3칸 비행, 영구 이동력 +1. 보드 장악과 최고의 이동 카드.',
            '케르베로스의 목줄(3층, 독, 패시브) — D6을 2회 굴려 유리한 쪽 선택, 몬스터 능력 발동 −25%. 가장 중요한 주사위의 안정성.',
            '폭풍의 은총(2층, 바람, 패시브) — 주사위 최소값 +1(1·2가 3으로), 강제 이동 완전 면역. 최악의 운을 없앱니다.',
            '베르길리우스의 지팡이(1층, 신성, 둘 다) — 모든 수호카드 효과 +50%, 획득 시 탈출 게이트 개방. 쌓아온 모든 것을 곱하는 마무리.',
          ],
        },
        {
          heading: '효과가 어떻게 겹치나',
          paragraphs: [
            '대부분의 수호카드 보너스는 고정 덧셈입니다. D6 보너스는 겹칩니다 — 분노의 투구(+1)는 케르베로스의 목줄의 “2회 굴려 큰 쪽”과 만나 더 크고 안정적인 주사위가 됩니다. 피해 감소는 사실상 곱으로 쌓입니다 — 얼음 거인의 심장의 고정 −2가 모든 타격 앞에 서고, 베르길리우스의 지팡이가 수호카드 부분을 50% 더 키웁니다.',
            '핵심은 베르길리우스의 지팡이가 “수호카드 효과”를 키우지 로스텟을 키우는 게 아니라는 점입니다. 1층에 강한 세트로 도달할 계획이라면, 반올림 때 가시적으로 커지는 카드를 높이 치세요. 얼음 거인의 −2는 사실상 −3이 되고, 케르베로스의 “2회 굴림”은 그대로지만 투구의 +1은 효과적으로 +2에 가까워집니다. 그래서 방어와 주사위 기반 카드가 지팡이의 최고 타깃입니다.',
          ],
        },
        {
          heading: '액티브 수호카드를 언제 쓸까',
          paragraphs: [
            '액티브 수호카드는 희소해서 귀합니다. 황금의 날개 비행은 갱신되므로(3턴 쿨다운) 위험한 칸을 건너뛰거나, 이길 수 없는 엘리트를 피하거나, 수문장 전에 상점 타일에 닿기 위해 자유롭게 쓰세요. 가면술사의 비밀 스킵은 1회용이므로 이길 싸움에 쓰면 안 됩니다. 올바른 타깃은 자신이 가장 약한 미니게임 원소를 가진 체력 좋은 엘리트 몬스터, 지면 죽는 2차 수문장전입니다.',
            '흔한 실수는 스킵을 “나중을 위해” 아끼다가 너무 늦는 것입니다. HP 60%로 과거에 자주 실패하던 미니게임의 엘리트를 마주했다면 쓰세요. 스킵을 미사용한 채 죽으면 완전한 낭비입니다.',
          ],
        },
        {
          heading: '세 가지 시너지 빌드',
          paragraphs: [
            '덱은 카드의 단순 합 이상입니다. 이 세 가지 전형이 성공적인 지옥 판의 대부분을 설명합니다.',
          ],
          list: [
            '탱커(방어 컨트롤) — 얼음 거인의 심장 + 피의 축복 + 베르길리우스의 지팡이. 얼음 거인이 모든 타격을 깎고, 피의 축복이 승리를 회복으로 바꾸고, 지팡이가 둘 다 키웁니다. 죽지 않아서 이깁니다. 보스 패널티가 매서운 뒷층에서 강합니다.',
            '버서커(고출력 공격) — 분노의 투구 + 케르베로스의 목줄 + 폭풍의 은총. “2회 굴려 큰 쪽”에 +1과 최소값 상향이면 전투 D6이 안정적으로 4–6입니다. 회복 패널티가 아프니 소모품 회복과 피의 축복(있다면)을 곁들이세요. 엘리트와 수문장을 녹입니다.',
            '네비게이터(이동·정보) — 황금의 날개 + 심문관의 등불 + 폭풍의 은총. 타일을 날아넘고 강제 이동을 안 받고 적 능력을 미리 봅니다. 첫 클리어에 가장 안전한 빌드로, 정보와 보드 장악이 사망 원인의 대부분을 없앱니다.',
          ],
        },
        {
          heading: '수호카드와 다른 세계',
          paragraphs: [
            '수호카드는 연옥과 천국이 자기 카드 종류를 따로 두고 있어도 트릴로지 교차 시스템으로 이어집니다. 심문관의 등불의 시련 성공률 +30%는 천사 시련이 퀴즈·타이밍 기반인 연옥에서 조용히 가장 강한 카드 중 하나이며, 피의 축복의 저HP D6 보너스도 여전히 유효합니다. 3부작을 염두에 두고 지옥 판을 짤 때는 영역을 가리지 않는 효과 — 정보, 안정성, 위기 회복 — 가 지옥 전용 피해보다 더 오래 갑니다.',
          ],
        },
        {
          heading: '피해야 할 함정',
          paragraphs: [
            '첫째, ‘9장 다 맞추기’를 하지 마세요. 어떤 수호카드를 볼지 강제할 수 없고, 계획한 빌드에 과도하게 올인하면 멘탈이 흔들립니다. 층이 주는 대로 받고, 받은 패에서 시너지를 찾으세요. 둘째, 분노의 투구의 회복 패널티는 진짜입니다 — 가져갔다면 짧은 전투와 소모품 회복 쪽으로 플레이 스타일을 바꾸세요. 셋째, 베르길리우스의 지팡이는 판을 지킬 가치가 있습니다 — 수호카드가 깊은 상태로 1층에 들어가 베르길리우스전에서 이기는 것이 지옥의 가장 큰 파워 스파이크입니다.',
          ],
        },
      ],
    },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// GUIDE 3 — Three Modes
// ────────────────────────────────────────────────────────────────────────────
const THREE_MODES: GuideMeta = {
  slug: 'three-modes',
  icon: '🎭',
  cardTitle: {
    en: 'Inferno, Purgatorio, and Paradiso: The Three Modes Explained',
    ko: '지옥·연옥·천국 3가지 모드 설명',
  },
  cardExcerpt: {
    en: 'How the three realms differ mechanically — board structure, dice and grace, difficulty curve, reward cards — and which one you should play first.',
    ko: '세계가 구조적으로 어떻게 다른지 — 보드 구조, 주사위와 은총, 난이도 곡선, 보상 카드 — 그리고 어느 것부터 시작해야 하는지.',
  },
  accent: 'text-purple-400',
  content: {
    en: {
      title: 'Inferno, Purgatorio, and Paradiso: The Three Modes Explained',
      description:
        'A comparison of Abyssos’s three realms — Inferno, Purgatorio, and Paradiso. How board structure, dice and grace, difficulty curve, and reward cards differ, and which mode to play first.',
      kicker: 'Modes Comparison',
      lead:
        'Abyssos is a trilogy. The three realms — Inferno (9 Circles), Purgatorio (7 Terraces), and Paradiso (9 Spheres) — share an engine but play like three different games. This guide compares them on board structure, core stats, difficulty, and rewards, and explains why the recommended order is the order they unlock in.',
      sections: [
        {
          heading: 'The shared engine',
          paragraphs: [
            'All three modes use the same bones: a linear board you traverse, skill-based mini-games for movement and combat, a boss at the end of each stage that rewards a permanent card, and a roguelike structure where death sends you back to the start. Your card collection and meta upgrades (purchased with soul stones) carry across all three. What changes is the theme, the stat you manage, the feel of the events, and the type of challenge the bosses pose.',
            'Concretely, the shared systems include the Demon Duel movement games, the crisis/combo mechanics (3/5/7-streak bonuses and the +30% crisis reward), the Critical/Fumble dice rules (a natural 6 plus a win doubles healing, a natural 1 plus a loss doubles damage), the consumable inventory, the Soul Merchant shop, and the five meta upgrades (HP Boost, Dice Stabilizer, Starting Consumable, Starlight Box Quality, Blessing of Revival). If you learn these once in Inferno, you do not have to relearn them in Purgatorio or Paradiso — you only have to learn what each realm layers on top.',
          ],
        },
        {
          heading: 'Inferno — survival and power',
          paragraphs: [
            'Inferno is the foundation and the recommended starting point. The board is the 9 Circles of Hell, each 12 tiles long (five monster tiles, a midway event, five more monster tiles, a second event, then the gatekeeper), with a gatekeeper boss at the end. You start at the bottom (Circle 9, Cocytus) and ascend to Circle 1, where beating the Shadow of Virgil escapes Hell. The core loop is the Demon Duel — fifteen rotating skill mini-games that decide movement — followed by monster fights, events, and gatekeeper battles.',
            'The stat you manage is HP. Combat is frequent and punishing, elite monsters hit hard, and the crisis zone (HP at or below 25%) is a constant threat. The reward cards are the nine guardian cards, which stack into the builds described in the Guardian Cards guide. The tone is gothic survival horror, and the difficulty curve rewards learning the mini-games. Roughly 15–25 minutes per clear.',
            'Inferno’s identity is pressure. Because every tile can hurt you and the only resource is HP, the mode forces you to make micro-decisions every turn: fight the elite for triple HP, or play safe and route around it? Spin the Wheel of Desire for a possible jackpot, or walk past? Take the cursed-altar card for immediate power, or stay clean? These decisions compound, and a run that makes consistently good micro-decisions will finish far stronger than one that plays on autopilot.',
          ],
        },
        {
          heading: 'Purgatorio — virtue and choice',
          paragraphs: [
            'Purgatorio unlocks after you clear Inferno. The board is the 7 Terraces of Mount Purgatory, each 8 tiles long, each themed on one of the seven deadly sins in order: Pride, Envy, Wrath, Sloth, Greed, Gluttony, and Lust. You climb from Terrace 1 (Pride) to Terrace 7 (Lust), and beating the Angel of Purity on the seventh terrace reunites you with Beatrice in the Earthly Paradise. The direction flips from Inferno: you climb up rather than escape up.',
            'The defining feature is the Sin Projection. Instead of pure combat monsters, Purgatorio tiles present moral-choice dilemmas tied to the terrace’s sin — the Stone Giant asks what your heaviest burden is, the Serpent of Envy tempts you to steal another soul’s light, the Tempest of Rage tests whether you can find stillness, the Gold Worm on the Greed terrace offers wealth that bites if you clench your fist. Each choice has an outcome that affects HP, a new stat called virtue, and movement (some choices grant +3 tiles, others cost −4). The terrace itself adds an environmental effect: on Pride a failed choice lowers your D6, on Wrath a rage gauge escalates with each failure, on Greed rewards are doubled or zeroed, on Lust the choice difficulty is at its maximum.',
            'Bosses are the seven Angel Guardians, each with a signature trial that matches its sin: the Angel of Humility uses an O/X quiz that widens the green zone on correct answers, the Angel of Mercy is a card-match among six cards with two tries, the Angel of Gentleness runs a timing slider with 30% obscured by smoke, the Angel of Zeal demands 30 taps in 8 seconds, the Angel of Poverty offers a safe-versus-gamble choice (80% safe vs 40% for a 4× payout), the Angel of Temperance is a 3-of-5 quiz, and the Angel of Purity is a two-stage timing trial with a reverse slider that gates the Earthly Paradise.',
            'Reward cards are the seven purification cards. Several directly support this mode’s choice system: the Eye of Mercy (from the Angel of Mercy) negates bad choice outcomes 50% of the time and immunises you to trap damage, the Breath of Gentleness (from the Angel of Gentleness) boosts virtue gains by 50% and immunises you to wrath-event damage, the Hand of Poverty (from the Angel of Poverty) gives D6 +2 when you are at half HP and +50% to choice rewards, and the Kiss of Temperance doubles all healing and previews choice outcomes. The Flame of Purity, the final reward, doubles all purification effects. The Inquisitor’s Lantern guardian carried over from Inferno is quietly excellent here because of its trial-success bonus.',
          ],
        },
        {
          heading: 'Paradiso — grace and ascension',
          paragraphs: [
            'Paradiso unlocks after Purgatorio. The board is the 9 Spheres — Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, the Fixed Stars, and the Primum Mobile — each 10 tiles long. You ascend from Sphere 1 to Sphere 9, and reaching the Empyrean completes the trilogy. The aesthetic shifts to light: silver mist, crystal palaces, rose-petal skies, radiant nebulae. Each sphere is also themed on a virtue — Faith, Hope, Love, Wisdom, Courage, Justice, Contemplation, Hope & Faith, and the Angelic Orders.',
            'The stat you manage is grace. Grace is accumulated from light spirits on the tiles (each sphere has a tier-A spirit granting 3–8 grace and a tier-B spirit granting 7–16 grace, with the higher spheres paying more) and from events, and it is the currency that lets you pass the archangel trials and claim relics. Each of the 9 archangels runs a signature trial: Gabriel and Raphael test lore with O/X quizzes (2 of 3 correct), Uriel and Michael demand two consecutive golden-slider timings, Samael requires 25 taps in 8 seconds, Zadkiel offers a justice choice (a safe guaranteed +10 versus a fair 50/50 for +20), Cassiel quizzes on contemplation (3 of 4 correct), Sandalphon uses two consecutive reverse sliders, and Metatron’s final ascension combines a quiz, a timing, and a 15-tap challenge that all must succeed.',
            'Reward cards are the nine celestial relics. They lean toward grace and information: the Lunar Chalice (Sphere 1) grants +1 grace every turn, the Compass of Hope (Sphere 2) lets you adjust your position by ±2 tiles, the Rosary of Love (Sphere 3) raises grace gains by 50%, the Prism of Wisdom (Sphere 4) reveals all trial hints, the Sword of Valor (Sphere 5) raises the 3D4 minimum by 1, the Balance of Justice (Sphere 6) has a 50% chance to negate bad outcomes, the Censer of Meditation (Sphere 7) grants +10 grace when you rest a turn, the Mantle of Stars (Sphere 8) raises the grace cap from 100 to 150, and the Key of Light (Sphere 9) opens the Empyrean gate. Paradiso is the gentlest mode on HP but the strictest on consistency — the multi-stage archangel trials punish a single miss.',
            'Paradiso’s identity is momentum. Because grace compounds (the Rosary and Mantle multiply and raise the cap), a run that accumulates early relics smoothly snowballs, while a run that stalls on an early trial can fall behind the grace curve and struggle to pay for later ones. The mode rewards steady, consistent execution more than bursts of brilliance.',
          ],
        },
        {
          heading: 'Side-by-side comparison',
          paragraphs: [
            'A quick reference for how the three realms line up, with the concrete numbers.',
          ],
          list: [
            'Board size: Inferno — 9 Circles × 12 tiles (108 tiles, ascend to escape). Purgatorio — 7 Terraces × 8 tiles (56 tiles, climb to purify). Paradiso — 9 Spheres × 10 tiles (90 tiles, ascend to unite with the light). Inferno is the longest, Purgatorio the shortest.',
            'Core stat: Inferno manages HP. Purgatorio adds virtue alongside HP. Paradiso manages grace (with a cap of 100, raised to 150 by the Mantle of Stars) while HP stays relevant.',
            'Movement: Inferno uses the fifteen Demon Duel skill mini-games for movement. Purgatorio and Paradiso use dice-based movement modified by terrace effects and relics (e.g. Pride lowers your die on failed choices; relics like the Compass of Hope let you adjust position).',
            'Boss style: Inferno gatekeepers each use a unique skill mini-game (timing, card-match, rapid-tap, quiz, choice, multitap, and a final combined trial). Purgatorio’s seven Angel Guardians use themed trials matched to their sin. Paradiso’s nine archangels run multi-stage trials that demand consistency (Metatron’s final trial is quiz + timing + tap, all must succeed).',
            'Reward cards: 9 guardians (Inferno), 7 purifications (Purgatorio), 9 relics (Paradiso) — 25 collectible cards across the trilogy, plus shared consumables and curses.',
            'Difficulty feel: Inferno is the hardest on resources (HP is the only stat and everything costs it). Purgatorio is the hardest on judgement (most tiles are non-combat dilemmas with multi-axis outcomes). Paradiso is the hardest on execution (multi-stage trials punish any single miss).',
            'Dice rules: Inferno uses a single D6 for combat, modified by the crisis bonus (+30% rewards at low HP) and Critical/Fumble on natural 6/1. Purgatorio keeps the D6 but adds terrace die-modifiers. Paradiso uses a 3D4 for some trials, modified by relics like the Sword of Valor (+1 minimum) and the Light of Martyr spirit (+1 minimum).',
            'Clear time: roughly 15–25 minutes per realm.',
          ],
        },
        {
          heading: 'Which mode to play first',
          paragraphs: [
            'Play them in unlock order: Inferno, then Purgatorio, then Paradiso. This is not just gating — it is the intended learning curve. Inferno teaches the mini-games, the feel of combat, HP discipline, and how guardian cards combine. Purgatorio then builds on those habits by adding moral choices and a new stat, and its purification cards synergise with guardian cards you already understand (the Inquisitor’s Lantern’s trial bonus, for example, is a quiet standout in Purgatorio). Paradiso rewards the full toolkit; going in cold would mean facing multi-stage archangel trials without the card literacy the first two modes teach.',
            'If you are returning after a break and want a gentler session, Paradiso is the most forgiving on HP — combat is rare and grace is generous. If you want to test your judgement, Purgatorio’s sin projections are the most interesting decisions in the game, because every choice trades between HP, virtue, and movement. And if you want the pure roguelike pressure that defined Abyssos at launch, Inferno remains the mode that punishes mistakes the hardest.',
            'A note on crossover planning: because guardian cards carry into the other realms, an Inferno run built with the trilogy in mind is meaningfully stronger than one built in isolation. Value guardians that translate — information (Inquisitor’s Lantern), consistency (Collar of Cerberus, Grace of the Storm), and crisis recovery (Blessing of Blood, Heart of the Ice Goliath) — over Inferno-only damage. Those four guardians will quietly carry weight all the way through Paradiso.',
          ],
        },
        {
          heading: 'After the trilogy',
          paragraphs: [
            'Clearing all three realms unlocks New Game+, where monsters have +2 power and rewards are 1.5×, and the hidden Abyss Challenge against Corrupted Virgil. New Game+ is the mode that rewards everything you have learned: the same boards, but with tighter margins that expose any habit you got away with the first time. The Corrupted Virgil fight at the end is the hardest single encounter in the game and the true skill check.',
            'The meta upgrade system (soul stones spent on HP Boost at 5 stones per level for +10 Max HP, Dice Stabilizer at 10 stones per level for +1 minimum die, Starting Consumable at 8 stones, Starlight Box Quality at 12 stones, and Blessing of Revival at 30 stones for a one-time respawn) is what turns a first clear into a reliable one, so spend between runs rather than hoarding. HP Boost and Blessing of Revival are the two highest-impact purchases for players pushing toward a full trilogy clear, because they directly address the two most common death causes (chip damage and single-Fumble spikes).',
            'The trilogy is designed to be replayed — the card pool, event order, and boss mini-games keep each run meaningfully different, and the meta upgrades compound so that run 20 is noticeably smoother than run 1. Even after a full clear, there is usually a faster, cleaner, higher-combo line of play to find, which is what keeps the loop worth coming back to.',
          ],
        },
      ],
    },
    ko: {
      title: '지옥·연옥·천국 3가지 모드 설명',
      description:
        '어비소스의 세 세계 — 지옥, 연옥, 천국 — 를 비교합니다. 보드 구조, 주사위와 은총, 난이도 곡선, 보상 카드가 어떻게 다른지, 그리고 어느 모드부터 시작해야 하는지를 정리합니다.',
      kicker: '모드 비교',
      lead:
        '어비소스는 3부작입니다. 세 세계 — 지옥(9층), 연옥(7개 테라스), 천국(9개 천구) — 는 같은 엔진을 쓰지만 세 개의 다른 게임처럼 돌아갑니다. 이 가이드는 보드 구조, 핵심 스탯, 난이도, 보상으로 세계를 비교하고, 추천 순서가 곧 해금 순서인 이유를 설명합니다.',
      sections: [
        {
          heading: '공유 엔진',
          paragraphs: [
            '세 모드 모두 같은 뼈대를 씁니다. 횡단하는 선형 보드, 이동과 전투를 결정하는 스킬 미니게임, 각 단계 끝의 보스가 주는 영구 카드, 죽으면 처음으로 돌아가는 로그라이크 구조입니다. 카드 컬렉션과 메타 업그레이드(영혼석으로 구매)는 세 모드를 가로지릅니다. 달라지는 것은 테마, 관리하는 스탯, 이벤트의 느낌, 보스가 던지는 도전의 유형입니다.',
          ],
        },
        {
          heading: '지옥 — 생존과 힘',
          paragraphs: [
            '지옥은 토대이자 추천 시작점입니다. 보드는 9층 지옥으로 각 층은 12칸이고 끝에 수문장 보스가 있습니다. 맨 아래(9층 코퀴토스)에서 시작해 1층까지 올라가 베르길리우스를 이기면 지옥을 탈출합니다. 핵심 루프는 열다섯 가지 회전식 스킬 미니게임으로 이동을 정하는 악마 도전, 그리고 몬스터 전투·이벤트·수문장전입니다.',
            '관리하는 스탯은 HP입니다. 전투가 잦고 매섭고, 엘리트 몬스터의 타격이 크며, 위기 구간(저HP)이 항상 위협입니다. 보상 카드는 아홉 수호카드로, ‘가디언 카드’ 가이드의 빌드로 쌓입니다. 톤은 고딕 생존 호러이고 난이도 곡선은 미니게임 숙달에 보상을 줍니다. 클리어에 약 15–25분.',
          ],
        },
        {
          heading: '연옥 — 덕목과 선택',
          paragraphs: [
            '연옥은 지옥 클리어 후 열립니다. 보드는 연옥산의 7개 테라스로 각 8칸, 일곱 대죄마다 테마가 있습니다. 1층(교만)에서 7층(색욕)까지 올라 7층 수호천사를 이기면 지상낙원에서 베아트리체와 재회합니다. 방향이 지옥과 반대로, ‘탈출 상승’이 아니라 ‘등반’입니다.',
            '결정적 특징은 죄의 투영입니다. 연옥 타일은 순수 전투 몬스터 대신 테라스의 죄에 결부된 도덕적 선택 딜레마를 내세웁니다 — 돌 거인은 가장 무거운 짐이 무엇이냐고 묻고, 질투의 뱀은 다른 영혼의 빛을 훔치라고 유혹하고, 분노의 폭풍은 한가운데서 고요를 찾으라고 시험합니다. 각 선택은 HP와 ‘덕목’이라는 새 스탯, 그리고 이동에 영향을 주는 결과를 낳습니다. 테라스 자체도 환경 효과를 더합니다(교만은 선택 실패 시 D6 −1, 분노 테라스는 분노 게이지로 점점 어려워집니다). 보스는 일곱 수호천사로 각자 고유 시련(퀴즈·카드 짝·타이밍·연속 탭·균형·선택·다단계 정화 시련)을 씁니다.',
            '보상 카드는 일곱 정화카드입니다. 이 모드의 선택 시스템을 직접 지원하는 카드가 많습니다 — 자비의 눈은 나쁜 선택 결과를 50% 확률로 무효화하고, 온유의 숨결은 덕목 획득량을 올리고 분노 이벤트 피해를 면역하며, 청빈의 손은 HP 절반 이하에서 D6 +2를 줍니다. 최종 보상인 순결의 불꽃은 모든 정화카드 효과를 2배로 합니다. 지옥에서 가져온 심문관의 등불 수호카드는 시련 성공 보너스 덕에 여기서 조용히 훌륭합니다.',
          ],
        },
        {
          heading: '천국 — 은총과 승천',
          paragraphs: [
            '천국은 연옥 후에 열립니다. 보드는 9개 천구 — 달·수성·금성·태양·화성·목성·토성·항성·원동천 — 로 각 10칸입니다. 1천에서 9천까지 승천해 엠피리오에 닿으면 3부작이 끝납니다. 미적 감각은 빛으로 옮겨갑니다. 은빛 안개, 수정 궁전, 장미꽃잎 하늘, 빛나는 성운.',
            '관리하는 스탯은 은총입니다. 은총은 타일의 빛의 정령과 이벤트에서 쌓이며, 대천사 시련을 통과하고 성물을 얻는 화폐입니다. 9명의 대천사는 각자 고유 시련을 운영합니다. 가브리엘과 라파엘은 퀴즈로 설정을 시험하고, 우리엘과 미카엘은 연속 황금 슬라이더 타이밍을 요구하고, 사마엘은 8초 안에 25회 탭을, 자드키엘은 정의의 선택(안전한 확정 획득 vs 공정한 50/50)을, 카시엘은 명상 퀴즈를, 산달폰은 역방향 슬라이더를 씁니다. 메타트론의 최종 승천은 퀴즈·타이밍·탭을 모두 성공해야 하는 다단계 시련입니다.',
            '보상 카드는 아홉 성물입니다. 은총과 정보 쪽으로 기웁니다 — 달의 성배는 매 턴 은총 +1, 사랑의 로사리오는 은총 획득량 +50%, 지혜의 프리즘은 모든 시련 힌트를 공개하고, 별의 망토는 은총 최대치를 100에서 150으로 올리며, 빛의 열쇠는 엠피리오 문을 엽니다. 천국은 HP 면에서는 가장 관대하지만 일관성 면에서는 가장 엄격합니다 — 다단계 대천사 시련은 한 번의 실패를 벌합니다.',
          ],
        },
        {
          heading: '나란히 비교',
          paragraphs: [
            '세 세계가 어떻게 정렬되는지 빠른 참고 표.',
          ],
          list: [
            '보드: 지옥 — 9층 × 12칸, 탈출 상승. 연옥 — 7 테라스 × 8칸, 정화 등반. 천국 — 9 천구 × 10칸, 빛과의 합일 승천.',
            '핵심 스탯: 지옥은 HP를 관리합니다. 연옥은 HP와 함께 덕목을 더합니다. 천국은 은총을 관리합니다(HP는 여전히 중요).',
            '이동: 지옥은 열다섯 가지 악마 도전 미니게임을 씁니다. 연옥과 천국은 테라스 효과와 성물로 수정되는 주사위 이동을 씁니다.',
            '보스 스타일: 지옥 수문장은 각자 고유 스킬 미니게임을 씁니다. 연옥 수호천사는 테마 시련을 씁니다. 천국 대천사는 일관성을 요구하는 다단계 시련을 운영합니다.',
            '보상 카드: 9 수호카드(지옥), 7 정화카드(연옥), 9 성물(천국) — 3부작 전체에 25장의 수집 카드.',
            '난이도 감각: 지옥은 자원이 가장 빡빡하고, 연옥은 판단이 가장 어렵고, 천국은 실행이 가장 어렵습니다.',
            '클리어 시간: 세계당 약 15–25분.',
          ],
        },
        {
          heading: '어느 모드부터',
          paragraphs: [
            '해금 순서대로 하세요. 지옥, 그다음 연옥, 그다음 천국입니다. 이건 단순한 해금 제한이 아니라 의도된 학습 곡선입니다. 지옥은 미니게임, 전투 감각, HP 관리, 수호카드 조합을 가르칩니다. 연옥은 그 습관 위에 도덕적 선택과 새 스탯을 더하며, 정화카드는 이미 이해한 수호카드와 시너지를 냅니다. 천국은 전체 도구를 보상합니다. 아무 준비 없이 들어가면 처음 두 모드가 가르쳐주는 카드 문해력 없이 다단계 대천사 시련을 마주하게 됩니다.',
            '한동안 쉬다가 돌아와서 가벼운 판을 원한다면 천국이 HP 면에서 가장 관대합니다. 판단을 시험하고 싶다면 연옥의 죄의 투영이 게임에서 가장 흥미로운 결정입니다. 그리고 출때부터 어비소스를 정의했던 순수 로그라이크 압박을 원한다면, 지옥이 여전히 실수에 가장 차갑습니다.',
          ],
        },
        {
          heading: '3부작 이후',
          paragraphs: [
            '세 세계를 모두 클리어하면 몬스터 +2 전투력·보상 1.5배의 뉴 게임+와, 타락한 베르길리우스를 상대하는 히든 심연 도전이 열립니다. 메타 업그레이드 시스템(영혼석으로 생명력 강화·주사위 안정화·시작 소모품·별빛 상자 품질·부활의 축복을 사는 것)이 첫 클리어를 안정적인 클리어로 바꾸므로, 판 사이에 지출하세요. 3부작은 반복 플레이를 염두에 두고 설계됐습니다 — 카드 풀, 이벤트 순서, 보스 미니게임이 매 판을 의미 있게 다르게 만듭니다.',
          ],
        },
      ],
    },
  },
};

export const GUIDES: GuideMeta[] = [HOW_TO_PLAY, GUARDIAN_CARDS, THREE_MODES];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
