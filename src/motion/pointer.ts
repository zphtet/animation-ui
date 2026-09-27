import { motionValue, type MotionValue } from "framer-motion";
// for listening mouse position
let listening = false;
const x = motionValue(0);
const y = motionValue(0);

export function pointer(): { x: MotionValue<number>; y: MotionValue<number> } {
  if (!listening && typeof window !== "undefined") {
    listening = true;
    window.addEventListener(
      "pointermove",
      (event) => {
        x.set((event.clientX / window.innerWidth) * 2 - 1);
        y.set((event.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true },
    );
  }
  return { x, y };
}
