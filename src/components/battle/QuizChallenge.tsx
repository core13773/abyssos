'use client';

import { useState, useCallback, useMemo } from 'react';

interface QuizQuestion {
  question: string;
  answer: boolean; // true = O, false = X
  explanation: string;
}

// Dante's Inferno lore questions
const QUIZ_POOL: QuizQuestion[] = [
  { question: "Dante's Inferno has 9 circles of Hell.", answer: true, explanation: "The 9 circles correspond to the 9 levels of sin." },
  { question: "Lucifer is trapped in a lake of fire at the center of Hell.", answer: false, explanation: "Lucifer is trapped in a frozen lake (Cocytus), not fire." },
  { question: "Virgil was Dante's guide through Hell.", answer: true, explanation: "The Roman poet Virgil guides Dante through Hell and Purgatory." },
  { question: "The first circle of Hell is for the violent.", answer: false, explanation: "The first circle (Limbo) is for virtuous unbaptized souls, not the violent." },
  { question: "Cerberus guards the third circle (Gluttony).", answer: true, explanation: "The three-headed dog Cerberus guards the gluttonous in the third circle." },
  { question: "The saying 'Abandon all hope, ye who enter here' is inscribed on the gates of Hell.", answer: true, explanation: "'Lasciate ogne speranza, voi ch'intrate' is the famous inscription." },
  { question: "The ninth circle punishes the sin of fraud.", answer: false, explanation: "The ninth circle punishes treachery (betrayal). Fraud is the eighth circle." },
  { question: "Beatrice was Dante's childhood love who appears in Paradise.", answer: true, explanation: "Beatrice Portinari was Dante's muse and appears in Paradiso." },
  { question: "The river Styx is in the fifth circle where the wrathful fight each other.", answer: true, explanation: "The Styx marsh is where the wrathful eternally battle one another." },
  { question: "Dante wrote the Divine Comedy in the 15th century.", answer: false, explanation: "Dante wrote it in the early 14th century (completed 1321)." },
  { question: "In Inferno, heretics are punished in burning tombs.", answer: true, explanation: "Heretics in the 6th circle are trapped in flaming sepulchers." },
  { question: "The Minotaur guards the entrance to the circle of violence.", answer: true, explanation: "The Minotaur guards the seventh circle where the violent are punished." },
];

function pickRandomQuestions(count: number): QuizQuestion[] {
  const shuffled = [...QUIZ_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface Props {
  questionCount: number;    // number of questions (usually 3)
  requiredCorrect: number;  // needed to pass (usually 2)
  showHint: boolean;        // guardian-6 reveals one answer
  onResult: (correct: boolean, score: number) => void;
}

export default function QuizChallenge({ questionCount, requiredCorrect, showHint, onResult }: Props) {
  const [questions] = useState(() => pickRandomQuestions(questionCount));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const handleAnswer = useCallback((playerAnswer: boolean) => {
    const newAnswers = [...answers, playerAnswer === questions[currentQ].answer];
    setAnswers(newAnswers);
    if (currentQ + 1 >= questionCount) {
      setDone(true);
      const correct = newAnswers.filter(Boolean).length;
      setTimeout(() => onResult(correct >= requiredCorrect, correct), 800);
    } else {
      setCurrentQ((c) => c + 1);
    }
  }, [currentQ, answers, questions, questionCount, requiredCorrect, onResult]);

  const useHint = useCallback(() => {
    setHintUsed(true);
  }, []);

  const currentQuestion = questions[currentQ];
  const score = answers.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {!done ? (
        <>
          {/* Progress */}
          <div className="flex gap-1.5">
            {Array.from({ length: questionCount }, (_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${
                i < currentQ ? (answers[i] ? 'bg-emerald-400' : 'bg-red-400') :
                i === currentQ ? 'bg-amber-400 animate-pulse' : 'bg-stone-700'
              }`} />
            ))}
          </div>

          {/* Question */}
          <div className="bg-stone-800/70 rounded-lg p-3 text-center w-full border border-stone-700">
            <p className="text-xs text-stone-400 mb-1">Q{currentQ + 1}/{questionCount}</p>
            <p className="text-sm text-stone-100 font-bold">{currentQuestion.question}</p>
            {showHint && hintUsed && (
              <p className="text-[10px] text-amber-400 mt-1">
                💡 정답: {currentQuestion.answer ? 'O' : 'X'}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-emerald-600/50"
            >
              ⭕ O
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-3 bg-red-800 hover:bg-red-700 text-red-200 font-bold rounded-xl text-lg active:scale-95 transition-transform border border-red-600/50"
            >
              ❌ X
            </button>
          </div>

          {/* Hint button */}
          {showHint && !hintUsed && (
            <button
              onClick={useHint}
              className="text-[10px] text-amber-500 underline"
            >
              💡 Use Lantern (reveal answer)
            </button>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className={`text-2xl font-bold mb-1 ${score >= requiredCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {score >= requiredCorrect ? '✅ Pass!' : '❌ Fail...'}
          </p>
          <p className="text-sm text-stone-400">{score}/{questionCount} correct (need {requiredCorrect})</p>
        </div>
      )}
    </div>
  );
}
