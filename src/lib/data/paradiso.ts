import type { SphereId, LightSpiritCard, ArchangelCard, CelestialRelic } from '@/types/game';

// ============================================================
// Paradiso Spheres — 9 celestial spheres
// ============================================================

export interface SphereInfo {
  id: SphereId;
  name: string; nameEn: string;
  virtue: string; virtueEn: string;
  description: string; descriptionEn: string;
  color: string; tileCount: number;
  spiritAId: string; spiritBId: string;
}

export const SPHERES: SphereInfo[] = [
  { id: 1, name: '달의 천구', nameEn: 'Sphere of the Moon', virtue: '신앙', virtueEn: 'Faith', description: '은빛 안개 낀 평원. 서약을 지킨 영혼들이 부드러운 빛 속에 머문다.', descriptionEn: 'Silver mist across a gentle plain. Souls who kept their vows dwell in soft light.', color: '#c0c0c0', tileCount: 10, spiritAId: 'spirit-1a', spiritBId: 'spirit-1b' },
  { id: 2, name: '수성의 천구', nameEn: 'Sphere of Mercury', virtue: '희망', virtueEn: 'Hope', description: '크리스탈 궁전. 야망을 품고 선을 행한 영혼들이 별빛 속에 빛난다.', descriptionEn: 'A crystal palace. Souls who pursued ambition through good deeds shine in starlight.', color: '#b0b0b0', tileCount: 10, spiritAId: 'spirit-2a', spiritBId: 'spirit-2b' },
  { id: 3, name: '금성의 천구', nameEn: 'Sphere of Venus', virtue: '사랑', virtueEn: 'Love', description: '장미꽃잎 흩날리는 하늘. 순수한 사랑을 실천한 영혼들이 춤춘다.', descriptionEn: 'Rose petals drifting through the sky. Souls who practiced pure love dance among them.', color: '#f9a8d4', tileCount: 10, spiritAId: 'spirit-3a', spiritBId: 'spirit-3b' },
  { id: 4, name: '태양의 천구', nameEn: 'Sphere of the Sun', virtue: '지혜', virtueEn: 'Wisdom', description: '눈부신 빛의 궁전. 현자들의 합창이 울려 퍼지는 지혜의 전당.', descriptionEn: 'A dazzling palace of light. The hall of wisdom where sages sing in chorus.', color: '#fbbf24', tileCount: 10, spiritAId: 'spirit-4a', spiritBId: 'spirit-4b' },
  { id: 5, name: '화성의 천구', nameEn: 'Sphere of Mars', virtue: '용기', virtueEn: 'Courage', description: '빛나는 십자가 성운. 신앙을 위해 싸운 전사들의 영혼이 빛난다.', descriptionEn: 'A radiant cross nebula. Souls of warriors who fought for faith shine eternally.', color: '#ef4444', tileCount: 10, spiritAId: 'spirit-5a', spiritBId: 'spirit-5b' },
  { id: 6, name: '목성의 천구', nameEn: 'Sphere of Jupiter', virtue: '정의', virtueEn: 'Justice', description: '독수리 형상의 빛 구름. 정의를 실현한 영혼들이 모여든다.', descriptionEn: 'Eagle-shaped clouds of light. Souls who upheld justice gather here.', color: '#3b82f6', tileCount: 10, spiritAId: 'spirit-6a', spiritBId: 'spirit-6b' },
  { id: 7, name: '토성의 천구', nameEn: 'Sphere of Saturn', virtue: '명상', virtueEn: 'Contemplation', description: '황금 사다리와 고요한 빛. 명상과 금욕의 영혼들이 오르내린다.', descriptionEn: 'A golden ladder in serene light. Contemplative souls ascend and descend.', color: '#8b5cf6', tileCount: 10, spiritAId: 'spirit-7a', spiritBId: 'spirit-7b' },
  { id: 8, name: '항성의 천구', nameEn: 'Sphere of Fixed Stars', virtue: '희망과 신앙', virtueEn: 'Hope & Faith', description: '무수한 별들의 향연. 성모와 사도들이 빛나는 승리의 장소.', descriptionEn: 'A feast of countless stars. The Virgin and Apostles shine in triumph.', color: '#fafafa', tileCount: 10, spiritAId: 'spirit-8a', spiritBId: 'spirit-8b' },
  { id: 9, name: '원동천', nameEn: 'Primum Mobile', virtue: '천사의 위계', virtueEn: 'Angelic Orders', description: '시간과 공간의 경계. 모든 운동의 근원인 순수한 빛의 소용돌이.', descriptionEn: 'Boundary of time and space. A vortex of pure light — source of all motion.', color: '#e2e8f0', tileCount: 10, spiritAId: 'spirit-9a', spiritBId: 'spirit-9b' },
];

// ============================================================
// Light Spirits — 18 types
// ============================================================

export const LIGHT_SPIRITS: LightSpiritCard[] = [
  { id: 'spirit-1a', sphereId: 1, tier: 'A', name: '달의 시녀', nameEn: 'Lunar Maiden', element: 'lunar', graceGift: 3 },
  { id: 'spirit-1b', sphereId: 1, tier: 'B', name: '신앙의 증인', nameEn: 'Witness of Faith', element: 'lunar', graceGift: 7, bonusGift: '이동력 +1', bonusGiftEn: 'Move +1' },
  { id: 'spirit-2a', sphereId: 2, tier: 'A', name: '희망의 전령', nameEn: 'Herald of Hope', element: 'mercurial', graceGift: 4 },
  { id: 'spirit-2b', sphereId: 2, tier: 'B', name: '영광의 사자', nameEn: 'Messenger of Glory', element: 'mercurial', graceGift: 8, bonusGift: '이동력 +1', bonusGiftEn: 'Move +1' },
  { id: 'spirit-3a', sphereId: 3, tier: 'A', name: '사랑의 입맞춤', nameEn: 'Kiss of Love', element: 'venusian', graceGift: 4 },
  { id: 'spirit-3b', sphereId: 3, tier: 'B', name: '카리타스의 화신', nameEn: 'Charitas Incarnate', element: 'venusian', graceGift: 9 },
  { id: 'spirit-4a', sphereId: 4, tier: 'A', name: '지혜의 등불', nameEn: 'Lamp of Wisdom', element: 'solar', graceGift: 5 },
  { id: 'spirit-4b', sphereId: 4, tier: 'B', name: '솔로몬의 현자', nameEn: 'Sage of Solomon', element: 'solar', graceGift: 10, bonusGift: '퀴즈 힌트', bonusGiftEn: 'Quiz hint' },
  { id: 'spirit-5a', sphereId: 5, tier: 'A', name: '용기의 불꽃', nameEn: 'Flame of Valor', element: 'martial', graceGift: 4 },
  { id: 'spirit-5b', sphereId: 5, tier: 'B', name: '순교자의 빛', nameEn: 'Light of Martyr', element: 'martial', graceGift: 8, bonusGift: '3D4 최소값 +1', bonusGiftEn: '3D4 min +1' },
  { id: 'spirit-6a', sphereId: 6, tier: 'A', name: '정의의 저울', nameEn: 'Scale of Justice', element: 'jovian', graceGift: 5 },
  { id: 'spirit-6b', sphereId: 6, tier: 'B', name: '독수리의 시선', nameEn: 'Gaze of Eagle', element: 'jovian', graceGift: 10, bonusGift: '선택 성공률 +20%', bonusGiftEn: 'Choice success +20%' },
  { id: 'spirit-7a', sphereId: 7, tier: 'A', name: '명상의 구슬', nameEn: 'Orb of Contemplation', element: 'saturnine', graceGift: 6 },
  { id: 'spirit-7b', sphereId: 7, tier: 'B', name: '황금 사다리의 수호자', nameEn: 'Guardian of Ladder', element: 'saturnine', graceGift: 12 },
  { id: 'spirit-8a', sphereId: 8, tier: 'A', name: '별의 무희', nameEn: 'Star Dancer', element: 'stellar', graceGift: 7 },
  { id: 'spirit-8b', sphereId: 8, tier: 'B', name: '성모의 왕관', nameEn: 'Crown of the Virgin', element: 'stellar', graceGift: 14 },
  { id: 'spirit-9a', sphereId: 9, tier: 'A', name: '빛의 소용돌이', nameEn: 'Vortex of Light', element: 'prime', graceGift: 8 },
  { id: 'spirit-9b', sphereId: 9, tier: 'B', name: '세라핌의 날개', nameEn: 'Wings of Seraphim', element: 'prime', graceGift: 16 },
];

// ============================================================
// Archangels — 9 trial guardians
// ============================================================

export const ARCHANGELS: ArchangelCard[] = [
  { id: 'archangel-1', sphereId: 1, name: '가브리엘', nameEn: 'Gabriel', title: '신앙의 수호자', titleEn: 'Guardian of Faith', element: 'lunar', trialType: 'quiz', trialDesc: '신앙의 퀴즈: 신곡 O/X 3문제 중 2문제 정답', trialDescEn: 'Quiz of Faith: 2/3 Dante lore O/X correct', graceBlessing: 10, relicId: 'relic-1', narrative: '가브리엘이 부드러운 미소로 묻는다 — "그대의 믿음은 진실한가?"', narrativeEn: 'Gabriel asks with a gentle smile — "Is your faith true?"' },
  { id: 'archangel-2', sphereId: 2, name: '라파엘', nameEn: 'Raphael', title: '희망의 인도자', titleEn: 'Guide of Hope', element: 'mercurial', trialType: 'quiz', trialDesc: '희망의 퀴즈: 3문제 중 2문제 정답', trialDescEn: 'Quiz of Hope: 2/3 correct', graceBlessing: 12, relicId: 'relic-2', narrative: '라파엘이 수정 궁전에서 손짓한다 — "희망은 가장 밝은 별이다."', narrativeEn: 'Raphael beckons from the crystal palace — "Hope is the brightest star."' },
  { id: 'archangel-3', sphereId: 3, name: '우리엘', nameEn: 'Uriel', title: '사랑의 수호자', titleEn: 'Guardian of Love', element: 'venusian', trialType: 'timing_multi', trialDesc: '사랑의 타이밍: 황금빛 슬라이더 2연속 성공', trialDescEn: 'Timing of Love: 2 consecutive golden slider successes', graceBlessing: 12, relicId: 'relic-3', narrative: '우리엘이 장미꽃잎 속에서 미소 짓는다 — "사랑은 모든 것을 움직인다."', narrativeEn: 'Uriel smiles among rose petals — "Love moves all things."' },
  { id: 'archangel-4', sphereId: 4, name: '미카엘', nameEn: 'Michael', title: '지혜의 전사', titleEn: 'Warrior of Wisdom', element: 'solar', trialType: 'timing_multi', trialDesc: '지혜의 타이밍: 눈부신 슬라이더 2연속', trialDescEn: 'Timing of Wisdom: 2 consecutive blinding sliders', graceBlessing: 15, relicId: 'relic-4', narrative: '미카엘이 빛의 검을 휘두르며 선다 — "진정한 지혜는 용기에서 나온다."', narrativeEn: 'Michael stands with a sword of light — "True wisdom comes from courage."' },
  { id: 'archangel-5', sphereId: 5, name: '사마엘', nameEn: 'Samael', title: '용기의 시험관', titleEn: 'Examiner of Courage', element: 'martial', trialType: 'rapid_sequence', trialDesc: '용기의 연속 탭: 8초 내 25회 탭', trialDescEn: 'Courage Tap: 25 taps in 8 seconds', graceBlessing: 15, relicId: 'relic-5', narrative: '사마엘이 붉은 십자가 앞에서 외친다 — "두려움을 넘어서라!"', narrativeEn: 'Samael cries before the red cross — "Transcend your fear!"' },
  { id: 'archangel-6', sphereId: 6, name: '자드키엘', nameEn: 'Zadkiel', title: '정의의 천칭', titleEn: 'Balance of Justice', element: 'jovian', trialType: 'balance', trialDesc: '정의의 선택: 안전(확정 +10) vs 공정(50% +20 / 50% 0)', trialDescEn: 'Balance of Justice: Safe (guaranteed +10) vs Fair (50% +20 / 50% 0)', graceBlessing: 20, relicId: 'relic-6', narrative: '자드키엘이 천칭을 든다 — "정의는 때로 위험을 감수하는 것이다."', narrativeEn: 'Zadkiel holds the scales — "Justice sometimes requires risk."' },
  { id: 'archangel-7', sphereId: 7, name: '카시엘', nameEn: 'Cassiel', title: '명상의 문지기', titleEn: 'Keeper of Contemplation', element: 'saturnine', trialType: 'quiz', trialDesc: '명상의 퀴즈: 4문제 중 3문제 정답', trialDescEn: 'Quiz of Contemplation: 3/4 correct', graceBlessing: 18, relicId: 'relic-7', narrative: '카시엘이 황금 사다리 아래 앉아 있다 — "고요 속에서 진리를 보라."', narrativeEn: 'Cassiel sits beneath the golden ladder — "See truth in stillness."' },
  { id: 'archangel-8', sphereId: 8, name: '산달폰', nameEn: 'Sandalphon', title: '별의 음유시인', titleEn: 'Bard of the Stars', element: 'stellar', trialType: 'timing_multi', trialDesc: '별의 타이밍: 역방향 슬라이더 2연속', trialDescEn: 'Star Timing: 2 consecutive reverse sliders', graceBlessing: 20, relicId: 'relic-8', narrative: '산달폰이 별빛 하프를 연주한다 — "음악은 천상의 언어."', narrativeEn: 'Sandalphon plays the starlight harp — "Music is the language of heaven."' },
  { id: 'archangel-9', sphereId: 9, name: '메타트론', nameEn: 'Metatron', title: '빛의 목소리', titleEn: 'Voice of Light', element: 'prime', trialType: 'final_ascension', trialDesc: '최종 승천: 퀴즈 1문제 + 타이밍 1회 + 탭 15회 - 모두 성공!', trialDescEn: 'Final Ascension: Quiz + Timing + 15 taps - all must succeed!', graceBlessing: 30, relicId: 'relic-9', narrative: '메타트론의 목소리가 울려 퍼진다 — "모든 여정의 끝에서, 빛이 그대를 맞이하리라."', narrativeEn: 'Metatron\'s voice resonates — "At the end of all journeys, the light welcomes you."' },
];

// ============================================================
// Celestial Relics — 9 types
// ============================================================

export const CELESTIAL_RELICS: CelestialRelic[] = [
  { id: 'relic-1', sphereId: 1, name: '달의 성배', nameEn: 'Lunar Chalice', element: 'lunar', effect: '매 턴 은총 +1', effectEn: '+1 grace every turn', narrative: '달빛이 담긴 성배. 마실수록 신앙이 깊어진다.', narrativeEn: 'A chalice filled with moonlight. Faith deepens with every sip.' },
  { id: 'relic-2', sphereId: 2, name: '희망의 나침반', nameEn: 'Compass of Hope', element: 'mercurial', effect: '원하는 칸 ±2 조정 가능', effectEn: 'Adjust position by ±2 tiles', narrative: '항상 빛을 향해 바늘을 돌리는 나침반.', narrativeEn: 'A compass whose needle always turns toward the light.' },
  { id: 'relic-3', sphereId: 3, name: '사랑의 로사리오', nameEn: 'Rosary of Love', element: 'venusian', effect: '은총 획득량 +50%', effectEn: 'Grace gains +50%', narrative: '장미 향기가 배어 있는 묵주.', narrativeEn: 'A rosary infused with the scent of roses.' },
  { id: 'relic-4', sphereId: 4, name: '지혜의 프리즘', nameEn: 'Prism of Wisdom', element: 'solar', effect: '모든 시험 힌트 제공', effectEn: 'All trial hints revealed', narrative: '빛을 일곱 빛깔로 나누는 수정.', narrativeEn: 'A crystal that splits light into seven colors.' },
  { id: 'relic-5', sphereId: 5, name: '용기의 검', nameEn: 'Sword of Valor', element: 'martial', effect: '3D4 최소값 +1', effectEn: '3D4 minimum +1', narrative: '두려움을 베어내는 불꽃의 검.', narrativeEn: 'A flaming sword that cuts through fear.' },
  { id: 'relic-6', sphereId: 6, name: '정의의 천칭', nameEn: 'Balance of Justice', element: 'jovian', effect: '나쁜 결과 50% 확률 무효', effectEn: '50% chance to negate bad outcomes', narrative: '진실만을 달아올리는 황금 천칭.', narrativeEn: 'Golden scales that only weigh truth.' },
  { id: 'relic-7', sphereId: 7, name: '명상의 향로', nameEn: 'Censer of Meditation', element: 'saturnine', effect: '한 턴 쉬면 은총 +10', effectEn: 'Rest a turn → +10 grace', narrative: '고요의 향기가 피어오르는 은빛 향로.', narrativeEn: 'A silver censer emitting the fragrance of serenity.' },
  { id: 'relic-8', sphereId: 8, name: '별의 망토', nameEn: 'Mantle of Stars', element: 'stellar', effect: '은총 최대치 100→150', effectEn: 'Max grace 100→150', narrative: '밤하늘을 수놓은 듯한 망토.', narrativeEn: 'A mantle embroidered with the night sky.' },
  { id: 'relic-9', sphereId: 9, name: '빛의 열쇠', nameEn: 'Key of Light', element: 'prime', effect: '엠피리오 문 개방', effectEn: 'Opens the Empyrean gate', narrative: '모든 문을 여는 순수한 빛의 열쇠.', narrativeEn: 'A key of pure light that opens all doors.' },
];

// ============================================================
// Lookup utilities
// ============================================================

export function getSphere(id: number): SphereInfo | undefined { return SPHERES.find((s) => s.id === id); }
export function getLightSpirit(id: string): LightSpiritCard | undefined { return LIGHT_SPIRITS.find((s) => s.id === id); }
export function getArchangel(sphereId: number): ArchangelCard | undefined { return ARCHANGELS.find((a) => a.sphereId === sphereId); }
export function getRelic(id: string): CelestialRelic | undefined { return CELESTIAL_RELICS.find((r) => r.id === id); }
