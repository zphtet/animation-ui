import { Loader } from "@/sections/Loader";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { Hero } from "./sections/Hero";
import { StageProvider } from "@/stage/StageProvider";
import { IntroContext } from "./motion/intro";
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

          <main className="fixed inset-0 overflow-hidden">
            {
              interactive && <Hero />
            }
            {/* {interactive && <div>hello</div>} */}
          </main>
        </StageProvider>
      </IntroContext>
    </div>
  );
};

export default App;
