// Arcade 게임 데이터: Abyssos(로그라이크) 1종 + 캐주얼 7종 = 총 8종
// - arcade 게임은 정적 페이지 /arcade/<id>/ 로 플레이 (id = 엔진 등록 id = localStorage 최고기록 키)
// - abyssos 게임은 /game(로그라이크)로 이동

export type ArcadeGame = {
  id: string;
  abyssos?: boolean;
  icon: string;
  nameEn: string;
  nameKo: string;
  taglineEn: string;
  taglineKo: string;
  descEn: string;
  descKo: string;
  howEn: string;
  howKo: string;
  accent: string; // 카드 보더/글로우 색
};

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'abyssos', abyssos: true, icon: '🔥',
    nameEn: 'Abyssos', nameKo: '어비소스',
    taglineEn: 'The Divine Comedy Trilogy', taglineKo: '신곡 3부작',
    descEn: "A strategic roguelike board game through Dante's Divine Comedy. Traverse the 9 circles of Inferno, the 7 terraces of Purgatory, and the 9 spheres of Paradise. Roll dice, collect cards, and overcome timing-based trials.",
    descKo: '단테의 신곡을 모티브로 한 전략적 로그라이크 보드게임. 9층 지옥, 7개 테라스 연옥, 9개 천구를 통과하세요. 주사위를 굴리고 카드를 모으며 타이밍 배틀을 극복하라.',
    howEn: 'Tap a realm to begin. In-game tutorial guides the rest.', howKo: '세계를 선택해 시작. 인게임 튜토리얼이 나머지를 안내합니다.',
    accent: '#991b1b',
  },
  {
    id: 'stack', icon: '🧱',
    nameEn: 'Stack Tower', nameKo: '스택 타워',
    taglineEn: 'Stack the blocks precisely', taglineKo: '블록을 정밀하게 쌓기',
    descEn: 'A moving block slides back and forth — tap to drop it on the tower. Overhang gets trimmed away, so time your taps to keep the stack wide and climb as high as you can. Perfect alignments grant combo bonuses.',
    descKo: '좌우로 움직이는 블록을 탭해서 탑 위에 떨어뜨리세요. 어긋난 만큼 잘려나가니 타이밍을 맞춰 폭을 유지하며 높이 쌓아올리세요. 정밀 매칭은 콤보 보너스를 줍니다.',
    howEn: 'Tap / click / Space to drop.', howKo: '탭·클릭·Space로 떨어뜨리기.',
    accent: '#b45309',
  },
  {
    id: 'flappy', icon: '🐤',
    nameEn: 'Flappy Dodge', nameKo: '플래피 닷지',
    taglineEn: 'Tap to fly through the gaps', taglineKo: '탭해서 틈새 통과',
    descEn: 'Keep the bird aloft with quick taps and steer it through the gaps between pipes. Gravity always pulls down, so rhythm your flaps to avoid the pipes and the ground. Each pipe cleared scores a point.',
    descKo: '빠른 탭으로 새를 띄우고 파이프 사이 틈새를 통과하세요. 중력이 늘 아래로 당기니 리듬감 있게 날개짓해 파이프와 땅을 피하세요. 파이프를 지날 때마다 점수가 오릅니다.',
    howEn: 'Tap / click / Space to flap.', howKo: '탭·클릭·Space로 날개짓.',
    accent: '#0e7490',
  },
  {
    id: 'lane', icon: '🛣️',
    nameEn: 'Lane Dodge', nameKo: '레인 닷지',
    taglineEn: 'Switch lanes to dodge', taglineKo: '차선을 바꿔 회피',
    descEn: 'Falling blocks rain down three lanes. Tap the left or right half of the screen to slide your orb between lanes and dodge the obstacles. The longer you survive, the faster they fall.',
    descKo: '세 차선으로 장애물이 쏟아집니다. 화면 왼/오른쪽을 탭해 공의 차선을 바꾸고 장애물을 피하세요. 오래 버틸수록 더 빨라집니다.',
    howEn: 'Tap left/right half, or ←/→ keys.', howKo: '화면 왼/오른쪽 탭, 또는 ←/→ 키.',
    accent: '#15803d',
  },
  {
    id: 'suika', icon: '🍉',
    nameEn: 'Merge Fruits', nameKo: '과일 합치기',
    taglineEn: 'Drop & merge same fruits', taglineKo: '같은 과일 합치기',
    descEn: 'Drop fruits into the box. When two of the same fruit touch, they merge into the next bigger one — chain all the way to the watermelon. The game ends if the pile overflows the line, so plan your drops.',
    descKo: '상자에 과일을 떨어뜨리세요. 같은 과일이 닿으면 다음 크기로 합쳐집니다 — 연쇄 합체로 수박까지. 과일이 위험선을 넘치면 게임이 끝나니 배치를 계획하세요.',
    howEn: 'Tap where to drop the fruit.', howKo: '탭한 위치에 과일 낙하.',
    accent: '#7e22ce',
  },
  {
    id: '2048', icon: '🔢',
    nameEn: '2048', nameKo: '2048',
    taglineEn: 'Swipe to merge numbers', taglineKo: '밀어서 숫자 합치기',
    descEn: 'The classic 4×4 number puzzle. Swipe to slide all tiles; when two tiles with the same number collide they merge into one. Keep merging to reach the 2048 tile — and beyond. Think a few moves ahead.',
    descKo: '클래식 4×4 숫자 퍼즐. 밀어서 모든 타일을 움직이세요. 같은 숫자 타일이 부딪히면 하나로 합쳐집니다. 계속 합쳐 2048 타일을 — 그리고 그 너머를 — 만들어보세요.',
    howEn: 'Swipe, or Arrow / WASD keys.', howKo: '스와이프, 또는 방향키 / WASD.',
    accent: '#a16207',
  },
  {
    id: 'knife', icon: '🔪',
    nameEn: 'Knife Hit', nameKo: '칼 던지기',
    taglineEn: 'Throw knives at the log', taglineKo: '통에 칼 던지기',
    descEn: 'A wooden log spins in the center. Tap to throw a knife from the bottom so it sticks into the log. Don’t hit an existing knife. Place all your knives to clear the level; hit apples for bonus points.',
    descKo: '중앙의 나무통이 회전합니다. 탭해 아래에서 칼을 던져 통에 꽂으세요. 이미 꽂힌 칼에 맞으면 안 됩니다. 모든 칼을 꽂아 레벨을 클리어하고, 사과를 맞히면 보너스 점수.',
    howEn: 'Tap / click / Space to throw.', howKo: '탭·클릭·Space로 던지기.',
    accent: '#9f1239',
  },
  {
    id: 'color', icon: '🎨',
    nameEn: 'Color Switch', nameKo: '컬러 스위치',
    taglineEn: 'Tap to match the color', taglineKo: '탭해서 색 맞추기',
    descEn: 'Your orb cycles through four colors each tap. Colored walls rush toward you — pass through only when your color matches the wall. Tap quickly to keep up as the speed increases.',
    descKo: '공은 탭할 때마다 4색을 순환합니다. 색칠된 벽이 다가오는데, 색이 벽과 일치할 때만 통과할 수 있습니다. 속도가 빨라질수록 빠른 탭이 필요합니다.',
    howEn: 'Tap / click / Space to switch color.', howKo: '탭·클릭·Space로 색 변경.',
    accent: '#1d4ed8',
  },
];

export const ARCADE_GAME_IDS: string[] = ARCADE_GAMES.filter((g) => !g.abyssos).map((g) => g.id);

export function getArcadeGame(id: string): ArcadeGame | undefined {
  return ARCADE_GAMES.find((g) => g.id === id);
}
