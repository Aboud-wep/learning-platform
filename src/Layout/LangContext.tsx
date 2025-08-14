// Layout/LangContext.tsx

import { createContext } from "react";

// Define the shape of your context value
interface LangContextType {
  currentLang: string;
  setLang: (lang: string) => void;
}

// Create the context with a default value
const LangContext = createContext<LangContextType>({
  currentLang: "gr",
  setLang: () => {},
});

export default LangContext;
