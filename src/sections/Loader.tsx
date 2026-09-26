import { Critter } from "@/art/Critter";
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

const MIN_VISIBLE_MS = 1600;
const MAX_WAIT_MS = 8000;

function readinessTasks(minMs: number): Promise<unknown>[] {
  const windowLoaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
  const fonts = "fonts" in document ? document.fonts.ready : Promise.resolve();
  const minTime = new Promise((resolve) => setTimeout(resolve, minMs));
  return [fonts, windowLoaded, minTime];
}

const WORD = "LOADING";
export const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const target = useMotionValue(0);
  const progress = useSpring(target, { stiffness: 70, damping: 20, restDelta: 0.1 });
  const percent = useTransform(progress, (v) => `${Math.min(100, Math.round(v))}%`);
  const barScale = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    const tasks = readinessTasks(MIN_VISIBLE_MS);
    let settled = 0;
    // A little head start so the counter visibly moves immediately.
    target.set(8);
    tasks.forEach((task) =>
      task.finally(() => {
        settled++;
        target.set(Math.max(target.get(), (settled / tasks.length) * 100));
      }),
    );
    const bailout = setTimeout(() => target.set(100), MAX_WAIT_MS);
    return () => clearTimeout(bailout);
  }, [target]);

  useMotionValueEvent(progress, 'change', (value) => {
    if (value >= 100) {
      onComplete()
    }
  })

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[clamp(96px,14vmin,140px)]"
        >
          <Critter species="cat" accessory="headphones" walking className="w-full" />
        </motion.div>
        <div className="mt-5">
          {Array.from(WORD).map((char, i) => (
            <motion.span
              key={i}
              className="inline-block font-bold tracking-wider"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            >
              {char}
            </motion.span>
          ))}

          {[0, 1].map((i) => (
            <motion.span
              key={`dot-${i}`}
              className="inline-block"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: 0.6 + i * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </div>
        <div className="mt-5 flex w-40 items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-red-400/10">
            <motion.div
              className="h-full origin-left rounded-full bg-navy"
              style={{ scaleX: barScale }}
            />
          </div>
          <motion.span className="w-10 text-right font-display text-sm text-red-400/70 tabular-nums">
            {percent}
          </motion.span>
        </div>
      </div>
    </div>
  );
};
