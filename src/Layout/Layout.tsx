import React, { createContext, useState, useContext, useEffect } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LangBar from "./LangBar";

interface LangContextType {
  currentLang: string;
  setLang: (lang: string) => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
};

const Layout: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHomePage = location.pathname === "/home";

  const [currentLang, setCurrentLang] = useState("gr");

  useEffect(() => {
    const langFromURL = searchParams.get("lang") || "gr";
    setCurrentLang(langFromURL);

    if (!searchParams.has("lang")) {
      searchParams.set("lang", langFromURL);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
  };

  return (
    <LangContext.Provider value={{ currentLang, setLang: handleLangChange }}>
      <div
        className={`flex flex-col min-h-screen ${
          isHomePage
            ? ""
            : ""
        }`}
      >
        <LangBar currentLang={currentLang} onLangChange={handleLangChange} />
        
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LangContext.Provider>
  );
};

export default Layout;
