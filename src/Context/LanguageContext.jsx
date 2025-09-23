import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "appLanguage"; // "ar" | "en"

const LanguageContext = createContext({
  language: "ar",
  isRTL: true,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
});

const TRANSLATIONS = {
  ar: {
    appName: "تعلمنا",
    loadingAuth: "جاري التحقق من تسجيل الدخول...",
    nav_home: "الرئيسية",
    nav_subjects: "المواد",
    nav_competitions: "المسابقات",
    nav_challenges: "التحديات",
    nav_profile: "الملف الشخصي",
    nav_logout: "تسجيل الخروج",
    nav_admin: "لوحة التحكم",
    no_question: "لا يوجد سؤال",
    lang_en: "EN",
    lang_ar: "AR",
  },
  en: {
    appName: "Taallemna",
    loadingAuth: "Checking authentication...",
    nav_home: "Home",
    nav_subjects: "Subjects",
    nav_competitions: "Competitions",
    nav_challenges: "Challenges",
    nav_profile: "Profile",
    nav_logout: "Logout",
    nav_admin: "Admin Panel",
    no_question: "No question",
    lang_en: "EN",
    lang_ar: "AR",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "ar");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    const isRTL = language === "ar";
    // document.body.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [language]);

  const value = useMemo(() => {
    const isRTL = language === "ar";
    const t = (key) => TRANSLATIONS[language]?.[key] ?? key;
    const toggleLanguage = () => setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
    return { language, isRTL, setLanguage, toggleLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);


