import { Loader } from "@/sections/Loader";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Home } from "./sections/home";
const App = () => {
  const [interactive, setInteractive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  return (
    <div >
      <AnimatePresence onExitComplete={() => setInteractive(true)}>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {
        interactive && <Home />
      }
    </div>
  );
};

export default App;
