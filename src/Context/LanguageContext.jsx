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

    // Home
    home_title: "الرئيسية",
    home_recent: "مؤخرا",
    home_my_subjects: "موادي",
    home_other_subjects: "مواد أخرى",
    home_view_more: "عرض المزيد",
    home_no_started_subjects: "لم تبدأ أي مادة بعد.",
    home_continue_learning: "أكمل التعلم",
    home_completed: "مكتمل",
    home_in_progress: "قيد التقدم",

    // Login
    login_identifier_label: "اسم المستخدم أو البريد الإلكتروني",
    login_password_label: "كلمة المرور",
    login_remember_me: "تذكرني",
    login_forgot_password: "هل نسيت كلمة السر؟",
    login_submit: "تسجيل الدخول",
    login_not_member: "لست عضوا حتى الآن؟",
    login_register_now: "سجل الآن",
    login_invalid_credentials: "اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    login_validation_identifier_short: "اسم المستخدم أو البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف.",
    login_validation_password_short: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    login_validation_password_upper: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.",
    login_validation_password_lower: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل.",
    login_google_failed: "فشل تسجيل الدخول باستخدام Google",

    // Register
    register_username: "اسم المستخدم",
    register_email: "البريد الإلكتروني",
    register_first_name: "الاسم الأول",
    register_last_name: "اسم العائلة",
    register_password: "كلمة المرور",
    register_confirm_password: "تأكيد كلمة المرور",
    register_submit: "تسجيل",
    register_have_account: "لديك حساب بالفعل؟",
    register_login: "تسجيل الدخول",
    register_google_failed: "فشل التسجيل باستخدام Google",
    register_success_message: "تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.",
    register_error_generic: "حدث خطأ ما",
    register_validation_username: "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_first_name: "الاسم الأول يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_last_name: "اسم العائلة يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_passwords_mismatch: "كلمة المرور غير متطابقة",
    register_validation_password_rules: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف كبير وصغير، ورقم، ورمز خاص",

    // Subjects
    subjects_title: "المواد",
    subjects_search_placeholder: "اكتب هنا للبحث",
    subjects_all_subjects: "جميع المواد",
    subjects_view_more: "عرض المزيد",
    subjects_no_matches: "لا توجد مواد مطابقة لبحثك.",
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

    // Home
    home_title: "Home",
    home_recent: "Recent",
    home_my_subjects: "My Subjects",
    home_other_subjects: "Other Subjects",
    home_view_more: "View more",
    home_no_started_subjects: "You haven’t started any subject yet.",
    home_continue_learning: "Continue learning",
    home_completed: "Completed",
    home_in_progress: "In progress",

    // Login
    login_identifier_label: "Username or Email",
    login_password_label: "Password",
    login_remember_me: "Remember me",
    login_forgot_password: "Forgot password?",
    login_submit: "Login",
    login_not_member: "Not a member yet?",
    login_register_now: "Register now",
    login_invalid_credentials: "Invalid username/email or password.",
    login_validation_identifier_short: "Username or email must be at least 3 characters.",
    login_validation_password_short: "Password must be at least 8 characters.",
    login_validation_password_upper: "Password must include at least one uppercase letter.",
    login_validation_password_lower: "Password must include at least one lowercase letter.",
    login_google_failed: "Google sign-in failed",

    // Register
    register_username: "Username",
    register_email: "Email",
    register_first_name: "First name",
    register_last_name: "Last name",
    register_password: "Password",
    register_confirm_password: "Confirm password",
    register_submit: "Register",
    register_have_account: "Already have an account?",
    register_login: "Login",
    register_google_failed: "Google sign-up failed",
    register_success_message: "Account created. Please verify your email before logging in.",
    register_error_generic: "Something went wrong",
    register_validation_username: "Username must be at least 3 characters",
    register_validation_first_name: "First name must be at least 3 characters",
    register_validation_last_name: "Last name must be at least 3 characters",
    register_validation_passwords_mismatch: "Passwords do not match",
    register_validation_password_rules: "Password must have 8+ chars, upper, lower, number, special",

    // Subjects
    subjects_title: "Subjects",
    subjects_search_placeholder: "Type here to search",
    subjects_all_subjects: "All subjects",
    subjects_view_more: "View more",
    subjects_no_matches: "No subjects match your search.",
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


