import { Loader } from "@/sections/Loader";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { Hero } from "./sections/Hero";
import { StageProvider } from "@/stage/StageProvider";
import { IntroContext } from "@/motion/intro";
import { FixedItems } from "@/sections/FixedItems";
import { Mascot } from "@/sections/Mascot";
import { Story } from "@/sections/Story";
import { Orbit } from "@/sections/Orbit";
const PAGES = ['Home', 'Story', 'Orbit', 'Collection']
const App = () => {
  const [interactive, setInteractive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const intro = useMemo(() => ({ ready: loaded }), [loaded])
  return (
    <div >
      <IntroContext value={intro}>
        <StageProvider count={PAGES.length} enabled={interactive}>
          <AnimatePresence onExitComplete={() => setInteractive(true)}>
            {!loaded && <Loader onComplete={() => setLoaded(true)} />}
          </AnimatePresence>

          <FixedItems pages={PAGES} />

          <main className="fixed inset-0 overflow-hidden">
            <Hero />
            <Mascot />
            <Orbit />
            <Story />
          </main>
        </StageProvider>
      </IntroContext>
    </div>
  );
};

export default App;
