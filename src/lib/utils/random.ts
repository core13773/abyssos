export function createRNG(seed: number) {
  let s = seed | 0;

  function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    /** Random float in [0, 1) */
    next,
    /** Random integer in [min, max] inclusive */
    nextInt(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    /** Pick a random element from an array */
    pick<T>(arr: T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },
    /** Shuffle an array (Fisher-Yates) */
    shuffle<T>(arr: T[]): T[] {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
}

export type RNG = ReturnType<typeof createRNG>;

/** Create a seed from current time */
export function timeSeed(): number {
  return Date.now() ^ (Math.random() * 0xffffffff);
}
