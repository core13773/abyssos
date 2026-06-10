'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { useLocale } from '@/lib/i18n/localeStore';
import Button from '@/components/ui/Button';

export default function ShopModal() {
  const showShop = useGameStore((s) => s.showShop);
  const shopItems = useGameStore((s) => s.shopItems);
  const player = useGameStore((s) => s.player);
  const buyShopItem = useGameStore((s) => s.buyShopItem);
  const closeShop = useGameStore((s) => s.closeShop);
  const locale = useLocale((s) => s.locale);
  const soulStones = player?.soulStones || 0;

  if (!showShop) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-stone-900 border border-amber-600/40 rounded-2xl p-4 w-full max-w-xs"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="text-center mb-3">
            <p className="text-3xl mb-1">🏪</p>
            <h2 className="text-lg font-bold text-amber-400 font-serif">
              {locale === 'en' ? 'Soul Merchant' : '영혼 상인'}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {locale === 'en' ? 'Spend soul stones for powerful items' : '영혼석을 사용하여 강력한 아이템을 얻으세요'}
            </p>
            <p className="text-sm text-purple-400 font-bold mt-1">
              ✨ {soulStones} {locale === 'en' ? 'Soul Stones' : '영혼석'}
            </p>
          </div>

          <div className="space-y-2 mb-3">
            {shopItems.map((item) => {
              const canAfford = soulStones >= item.cost;
              const name = locale === 'en' ? item.nameEn : item.name;
              const effect = locale === 'en' ? item.effectEn : item.effect;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded-lg border ${canAfford ? 'border-stone-600 bg-stone-800' : 'border-stone-700 bg-stone-800/50 opacity-60'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-stone-200">{name}</p>
                      <p className="text-[10px] text-stone-400">{effect}</p>
                    </div>
                  </div>
                  <Button
                    variant={canAfford ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => canAfford && buyShopItem(item.id)}
                    disabled={!canAfford}
                    className="text-[10px] px-2 py-1"
                  >
                    {canAfford ? `✨ ${item.cost}` : `✨ ${item.cost}`}
                  </Button>
                </div>
              );
            })}
          </div>

          <Button variant="ghost" size="sm" onClick={closeShop} className="w-full text-[11px]">
            {locale === 'en' ? 'Leave Shop' : '상인 떠나기'}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
