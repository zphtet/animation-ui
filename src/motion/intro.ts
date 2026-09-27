import { createContext, useContext } from "react";

/** `ready` flips to true when the loader starts leaving; entrance animations key off it. */
export const IntroContext = createContext({ ready: false });

export const useIntro = () => useContext(IntroContext);
