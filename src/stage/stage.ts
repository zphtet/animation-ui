import type { MotionValue } from "framer-motion";
import { createContext, useContext } from "react";

// next page , total count , position while going , goTo page
export interface Stage {
  page: number;
  count: number;
  position: MotionValue<number>;
  goTo: (page: number, options?: { instant?: boolean }) => void;
}

export const StageContext = createContext<Stage | null>(null);

export function useStage(): Stage {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("useStage must be used inside <StageProvider>");
  return stage;
}

// check for inside page
export const OnStageContext = createContext(true);

export const useOnStage = () => useContext(OnStageContext);
