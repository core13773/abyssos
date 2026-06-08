'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';

const STEPS_KO = [
  {
    title: '🔥 Abyssos에 오신 것을 환영합니다',
    body: '당신은 지옥의 가장 깊은 곳에서 깨어났습니다.\n9층의 지옥을 통과해 지상으로 탈출하세요.\n주사위를 굴리고, 몬스터를 물리치고, 수문장을 넘어서세요.',
    icon: '🔥',
  },
  {
    title: '🎲 Step 1: 주사위로 이동하기',
    body: '턴이 시작되면 [주사위 굴리기] 버튼을 누르세요.\nD6 두 개의 합계만큼 보드에서 오른쪽으로 이동합니다.\n1+1(스네이크 아이즈)는 3칸 후퇴!\n6+6(박스카)는 특별한 보너스!',
    icon: '🎲',
  },
  {
    title: '🎯 Step 2: 타이밍 슬라이더로 전투하기',
    body: '몬스터를 만나면 타이밍 슬라이더가 나타납니다.\n바가 좌우로 움직이니, 초록색 구간에서 탭하세요!\n🟢 초록 = 크리티컬 (2배 보상)\n🟡 노랑 = 일반 승리\n🔴 빨강 = 패배',
    icon: '🎯',
  },
  {
    title: '🃏 Step 3: 수문장 돌파하기',
    body: '각 층의 끝에는 수문장이 기다립니다.\n카드 찾기 게임으로 수문장을 물리치세요!\n정답 카드를 기억했다가, 섞인 후에 찾아내면 됩니다.\n승리하면 ✨ 수호카드를 획득합니다.',
    icon: '🃏',
  },
  {
    title: '🤔 Step 4: 선택의 기로',
    body: '보드 위에 🤔 표시가 보이나요?\n이 칸에 도착하면 운명의 선택이 기다립니다.\n50% 확률로 대성공 또는 손해!\n과감하게 도전하세요.',
    icon: '🤔',
  },
  {
    title: '✨ Step 5: 수호카드로 강해지기',
    body: '수문장을 처치할 때마다 수호카드를 얻습니다.\n총 9장의 수호카드가 있으며, 모두 다른 능력을 가집니다.\n받는 피해 감소, 전투 스킵, D6 보너스 등!\n카드는 영구적으로 적용되며 중첩됩니다.',
    icon: '✨',
  },
  {
    title: '🏆 목표: 9층 지옥 탈출!',
    body: '9층부터 시작해 1층까지 올라가세요.\n1층의 수문장 베르길리우스를 물리치면 탈출 성공!\n더 적은 턴 수로, 더 많은 수호카드를 모아\n최고 기록에 도전하세요!',
    icon: '🏆',
  },
];

const STEPS_EN = [
  {
    title: '🔥 Welcome to Abyssos',
    body: 'You awaken in the deepest pit of Hell.\nTraverse 9 circles to escape to the surface.\nRoll dice, defeat monsters, overcome gatekeepers.',
    icon: '🔥',
  },
  {
    title: '🎲 Step 1: Roll the Dice',
    body: 'Press [Roll Dice] to begin your turn.\nThe sum of two D6 determines your movement.\n1+1 (Snake Eyes) = retreat 3 tiles!\n6+6 (Boxcar) = special bonus!',
    icon: '🎲',
  },
  {
    title: '🎯 Step 2: Timing Slider Combat',
    body: 'When you meet a monster, the timing slider appears.\nTap when the indicator is in the GREEN zone!\n🟢 Green = Critical (2x reward)\n🟡 Yellow = Victory\n🔴 Red = Defeat',
    icon: '🎯',
  },
  {
    title: '🃏 Step 3: Gatekeeper Challenge',
    body: 'At the end of each circle, a gatekeeper awaits.\nUse the card matching game to defeat them!\nRemember the correct card, then find it after shuffling.\nVictory earns you a ✨ Guardian Card.',
    icon: '🃏',
  },
  {
    title: '🤔 Step 4: Crossroads of Fate',
    body: 'See 🤔 tiles on the board?\nLanding here triggers a fateful choice.\n50% chance of great success or loss!\nFortune favors the bold.',
    icon: '🤔',
  },
  {
    title: '✨ Step 5: Guardian Card Powers',
    body: 'Each gatekeeper you defeat grants a Guardian Card.\n9 unique cards with different abilities.\nDamage reduction, battle skip, D6 bonus, and more!\nAll effects are permanent and stack.',
    icon: '✨',
  },
  {
    title: '🏆 Goal: Escape All 9 Circles!',
    body: 'Start at Circle 9 and ascend to Circle 1.\nDefeat Virgil, the final gatekeeper, to escape!\nComplete in fewer turns with more guardian cards\nto achieve the highest rank!',
    icon: '🏆',
  },
];

export default function TutorialModal() {
  const locale = useLocale((s) => s.locale);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('abyssos_tutorial');
    if (!seen) setVisible(true);
  }, []);

  const steps = locale === 'en' ? STEPS_EN : STEPS_KO;
  const s = steps[step];
  const isLast = step === steps.length - 1;

  const dismiss = () => {
    localStorage.setItem('abyssos_tutorial', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-5 w-full max-w-sm text-center"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <p className="text-4xl mb-3">{s.icon}</p>
          <h2 className="text-lg font-bold text-amber-300 font-serif mb-2">{s.title}</h2>
          <p className="text-sm text-stone-300 whitespace-pre-line leading-relaxed mb-4">
            {s.body}
          </p>

          {/* Step dots */}
          <div className="flex justify-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-amber-400' : 'bg-stone-700'}`} />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="flex-1">
                ← {locale === 'en' ? 'Back' : '이전'}
              </Button>
            )}
            {!isLast ? (
              <Button variant="primary" size="sm" onClick={() => setStep(step + 1)} className="flex-1">
                {locale === 'en' ? 'Next' : '다음'} →
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={dismiss} className="flex-1">
                {locale === 'en' ? '🔥 Enter Hell!' : '🔥 지옥에 입장!'}
              </Button>
            )}
          </div>

          {!isLast && (
            <button onClick={dismiss} className="text-[10px] text-stone-600 mt-3 underline">
              {locale === 'en' ? 'Skip tutorial' : '튜토리얼 건너뛰기'}
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
