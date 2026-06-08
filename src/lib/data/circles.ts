import type { CircleId } from '@/types/game';

/**
 * Simplified circle data for v4 linear board.
 * Each circle: 12 tiles (5 monster-A + 1 event + 5 monster-B + 1 event) + gatekeeper.
 */
export interface CircleInfo {
  id: CircleId;
  name: string;
  nameEn: string;
  sin: string;
  sinEn: string;
  description: string;
  descriptionEn: string;
  color: string;
  tileCount: number;        // always 12
  monsterAId: string;       // monster card ID for tiles 0-4
  monsterBId: string;       // monster card ID for tiles 6-10
}

export const CIRCLES: CircleInfo[] = [
  {
    id: 9, name: '배반', nameEn: 'Treachery',
    sin: '코퀴토스의 얼음 호수 — 배신자의 지옥',
    sinEn: 'The frozen lake of Cocytus — Hell of the traitors',
    description: '루치페르의 날갯짓이 얼음을 더욱 단단히 얼린다. 배신자들은 머리부터 발끝까지 얼어붙어 있다.',
    descriptionEn: "Lucifer's beating wings freeze the ice ever harder. Traitors are entombed head to toe.",
    color: '#7ec8e3', tileCount: 12,
    monsterAId: 'monster-9a', monsterBId: 'monster-9b',
  },
  {
    id: 8, name: '사기', nameEn: 'Fraud',
    sin: '말레볼제의 10개 구렁 — 사기꾼의 지옥',
    sinEn: 'The 10 evil ditches of Malebolge — Hell of the fraudulent',
    description: '10개의 해자로 이루어진 사기꾼의 형벌장. 각 해자마다 다른 종류의 고통이 기다린다.',
    descriptionEn: 'A punishment ground of ten ditches. Each bolgia holds a different torment.',
    color: '#8b5e3c', tileCount: 12,
    monsterAId: 'monster-8a', monsterBId: 'monster-8b',
  },
  {
    id: 7, name: '폭력', nameEn: 'Violence',
    sin: '피의 강과 불모래 사막 — 폭력자의 지옥',
    sinEn: 'The river of blood and burning sand — Hell of the violent',
    description: '끓는 피의 강 플레게톤, 자살의 숲, 불모래 사막에서 폭력자들이 영원한 형벌을 받는다.',
    descriptionEn: 'The river Phlegethon of boiling blood where the violent suffer eternal punishment.',
    color: '#c0392b', tileCount: 12,
    monsterAId: 'monster-7a', monsterBId: 'monster-7b',
  },
  {
    id: 6, name: '이단', nameEn: 'Heresy',
    sin: '불타는 석관의 도시 — 이단자의 지옥',
    sinEn: 'The city of burning sepulchers — Hell of the heretics',
    description: '이단자들의 영혼이 불타는 석관에 갇혀 영원히 타오르는 도시.',
    descriptionEn: "A city where the souls of heretics burn eternally inside flaming sepulchers.",
    color: '#e67e22', tileCount: 12,
    monsterAId: 'monster-6a', monsterBId: 'monster-6b',
  },
  {
    id: 5, name: '분노', nameEn: 'Wrath',
    sin: '스틱스의 검은 늪 — 분노와 나태의 지옥',
    sinEn: 'The black marsh of Styx — Hell of the wrathful and slothful',
    description: '분노한 자들이 서로를 찢고 물어뜯는 스틱스 늪. 게으른 자들은 늪 바닥에 가라앉아 있다.',
    descriptionEn: 'The marsh of Styx where the wrathful tear and bite one another in endless fury.',
    color: '#2c3e50', tileCount: 12,
    monsterAId: 'monster-5a', monsterBId: 'monster-5b',
  },
  {
    id: 4, name: '탐욕', nameEn: 'Greed',
    sin: '황금의 무게 — 탐욕과 낭비의 지옥',
    sinEn: 'The weight of gold — Hell of the avaricious and prodigal',
    description: '탐욕스러운 자들과 낭비벽이 심한 자들이 거대한 돌덩이를 서로 반대 방향으로 굴린다.',
    descriptionEn: 'The avaricious and prodigal roll enormous boulders in opposite directions for eternity.',
    color: '#f1c40f', tileCount: 12,
    monsterAId: 'monster-4a', monsterBId: 'monster-4b',
  },
  {
    id: 3, name: '식탐', nameEn: 'Gluttony',
    sin: '진흙비와 악취 — 식탐가의 지옥',
    sinEn: 'Freezing mud-rain and stench — Hell of the gluttonous',
    description: '식탐가들이 차가운 진흙비와 악취 속에 뒹구는 늪. 삼두견 케르베로스가 이곳을 지킨다.',
    descriptionEn: 'A filthy swamp where gluttons wallow in freezing mud-rain. Cerberus guards this circle.',
    color: '#27ae60', tileCount: 12,
    monsterAId: 'monster-3a', monsterBId: 'monster-3b',
  },
  {
    id: 2, name: '색욕', nameEn: 'Lust',
    sin: '영원한 폭풍 — 정욕의 지옥',
    sinEn: 'The unending hurricane — Hell of the lustful',
    description: '정욕에 빠진 자들이 영원한 폭풍에 휩쓸려 쉬지 못하고 날아다닌다.',
    descriptionEn: 'Dark skies where the lustful are endlessly swept by an eternal hurricane.',
    color: '#9b59b6', tileCount: 12,
    monsterAId: 'monster-2a', monsterBId: 'monster-2b',
  },
  {
    id: 1, name: '미망', nameEn: 'Limbo',
    sin: '세례받지 못한 선한 영혼들의 성',
    sinEn: 'The castle of virtuous unbaptized souls',
    description: '지옥의 가장자리, 일곱 겹 성벽의 고귀한 성. 탈출구가 눈앞에 있다.',
    descriptionEn: 'The edge of Hell — a noble castle with seven walls. Escape lies just ahead.',
    color: '#95a5a6', tileCount: 12,
    monsterAId: 'monster-1a', monsterBId: 'monster-1b',
  },
];

/** Get circle by ID */
export function getCircle(id: number): CircleInfo | undefined {
  return CIRCLES.find((c) => c.id === id);
}
