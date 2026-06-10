'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from '@/lib/i18n/localeStore';

interface Props {
  difficulty: 'easy' | 'medium' | 'hard';
  onResult: (success: boolean) => void;
}

function generateProblem(difficulty: 'easy' | 'medium' | 'hard'): { question: string; answer: number } {
  let question: string;
  let answer: number;
  switch (difficulty) {
    case 'easy': {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const ops = ['+', '-'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      answer = op === '+' ? a + b : a - b;
      question = `${a} ${op} ${b}`;
      break;
    }
    case 'medium': {
      let a = Math.floor(Math.random() * 30) + 5;
      let b = Math.floor(Math.random() * 15) + 1;
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') { answer = a * b; a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; question = `${a} ${op} ${b}`; }
      else { answer = op === '+' ? a + b : a - b; question = `${a} ${op} ${b}`; }
      break;
    }
    case 'hard': {
      const a = Math.floor(Math.random() * 12) + 3;
      const b = Math.floor(Math.random() * 12) + 3;
      const c = Math.floor(Math.random() * 5) + 1;
      const patterns: { q: string; a: number }[] = [
        { q: `${a} × ${b} - ${c} = ?`, a: a * b - c },
        { q: `${a} × ${b} + ${c} = ?`, a: a * b + c },
        { q: `${a * b} ÷ ${a} = ?`, a: b },
        { q: `${a} × ${b} = ?`, a: a * b },
      ];
      const p = patterns[Math.floor(Math.random() * patterns.length)];
      answer = p.a;
      question = p.q;
      break;
    }
    default: { question = '10 + 5'; answer = 15; break; }
  }
  return { question, answer };
}

export default function MathPuzzle(props: Props) {
  return <MathPuzzleInner key={props.difficulty} {...props} />;
}

function MathPuzzleInner({ difficulty, onResult }: Props) {
  const locale = useLocale((s) => s.locale);
  const [phase, setPhase] = useState<'show' | 'input' | 'done'>('show');
  const [problem] = useState(() => generateProblem(difficulty));
  const [userInput, setUserInput] = useState('');
  const startTimeRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(() => (difficulty === 'hard' ? 6 : difficulty === 'medium' ? 8 : 10));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const timeLimit = difficulty === 'hard' ? 6 : difficulty === 'medium' ? 8 : 10;

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setPhase('done');
        setTimeout(() => onResultRef.current(false), 500);
      }
    }, 100);

    const showTimer = setTimeout(() => setPhase('input'), 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(showTimer);
    };
  }, [timeLimit]);

  const handleSubmit = useCallback(() => {
    if (phase !== 'input' || !problem) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const parsed = parseInt(userInput, 10);
    const correct = !isNaN(parsed) && parsed === problem.answer;
    setPhase('done');
    setTimeout(() => onResultRef.current(correct), 500);
  }, [phase, problem, userInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  const timePct = (timeLeft / timeLimit) * 100;

  if (!problem) return null;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {phase === 'show' && (
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-400 font-mono animate-pulse">{problem.question}</p>
          <p className="text-xs text-stone-400 mt-1">
            {locale === 'en' ? 'Memorize the problem!' : '문제를 기억하세요!'}
          </p>
        </div>
      )}

      {phase === 'input' && (
        <div className="w-full text-center">
          <p className="text-xl font-bold text-amber-400 font-mono mb-2">{problem.question} = ?</p>
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full ${timePct > 40 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
              style={{ width: `${timePct}%`, transition: 'width 0.1s linear' }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mb-2">{timeLeft.toFixed(1)}s</p>
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-24 text-center text-2xl font-bold font-mono bg-stone-800 border-2 border-amber-600/50 rounded-xl py-2 text-amber-200 outline-none focus:border-amber-400"
            autoFocus
            placeholder="?"
          />
          <button
            onClick={handleSubmit}
            className="block mx-auto mt-2 px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
          >
            {locale === 'en' ? 'Submit' : '확인'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className={`text-lg font-bold ${parseInt(userInput, 10) === problem.answer ? 'text-emerald-400' : 'text-red-400'}`}>
            {parseInt(userInput, 10) === problem.answer
              ? (locale === 'en' ? '✅ Correct!' : '✅ 정답!')
              : (locale === 'en' ? `❌ Wrong! Answer: ${problem.answer}` : `❌ 오답! 정답: ${problem.answer}`)}
          </p>
        </div>
      )}
    </div>
  );
}
