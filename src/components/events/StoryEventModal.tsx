'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import Button from '@/components/ui/Button';

export default function StoryEventModal() {
  const storyEvent = useGameStore((s) => s.storyEvent);
  const setStoryEvent = useGameStore((s) => s.setStoryEvent);

  if (!storyEvent) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-purple-600/40 rounded-2xl p-4 w-full max-w-xs"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="text-center mb-3">
            <p className="text-3xl mb-1">📜</p>
            <h2 className="text-lg font-bold text-purple-400 font-serif">{storyEvent.title}</h2>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">{storyEvent.body}</p>
          <div className="space-y-2">
            {storyEvent.choices.map((choice, i) => (
              <Button
                key={i}
                variant={i === 0 ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setStoryEvent(null)}
                className="w-full text-xs"
              >
                {choice.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
