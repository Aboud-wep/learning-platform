import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
    nav_settings: "اللإعدادات",
    nav_logout: "تسجيل الخروج",
    nav_admin: "لوحة التحكم",
    no_question: "لا يوجد سؤال",
    lang_en: "EN",
    lang_ar: "AR",

    // Settings
    nav_settings: "الإعدادات",
    dark_mode: "الوضع الداكن",
    light_mode: "الوضع الفاتح",
    sound_on: "الصوت مفعل",
    sound_off: "الصوت معطل",

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

    // Hearts Popup
    hearts_counter: "عداد القلوب",
    hearts_next_refill: "ستحصل على قلب جديد خلال:",
    hearts_buy_button: "اشتر قلب",
    hearts_full: "جميع القلوب ممتلئة ❤️",
    hearts_buy_failed: "فشل شراء القلب. تأكد من وجود عملات كافية.",

    // Streak Popup
    streak_days: "يوماً حماسة",
    streak_completed: "مكتمل",
    streak_used_freeze: "تم استخدام التجميد",
    streak_today: "اليوم",
    streak_not_completed: "غير مكتمل",
    lang_code: "ar", // Add language code for conditional rendering

    // Login
    login_identifier_label: "اسم المستخدم أو البريد الإلكتروني",
    login_password_label: "كلمة المرور",
    login_remember_me: "تذكرني",
    login_forgot_password: "هل نسيت كلمة السر؟",
    login_submit: "تسجيل الدخول",
    login_not_member: "لست عضوا حتى الآن؟",
    login_register_now: "سجل الآن",
    login_invalid_credentials:
      "اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    login_validation_identifier_short:
      "اسم المستخدم أو البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف.",
    login_validation_password_short:
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    login_validation_password_upper:
      "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.",
    login_validation_password_lower:
      "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل.",
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
    register_success_message:
      "تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.",
    register_error_generic: "حدث خطأ ما",
    register_error_email_exists: "هذا البريد الإلكتروني مستخدم بالفعل",
    register_error_username_exists: "اسم المستخدم مستخدم بالفعل",
    register_error_fields_invalid:
      "تحقق من الحقول المدخلة، هناك خطأ في بعض البيانات.",

    // ✅ validation messages
    register_validation_username:
      "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_first_name:
      "الاسم الأول يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_last_name:
      "اسم العائلة يجب أن يحتوي على 3 أحرف على الأقل",
    register_validation_passwords_mismatch: "كلمة المرور غير متطابقة",
    register_validation_password_rules:
      "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف كبير وصغير، ورقم، ورمز خاص",

    // Subjects
    subjects_title: "المواد",
    subjects_search_placeholder: "اكتب هنا للبحث",
    subjects_all_subjects: "جميع المواد",
    subjects_view_more: "عرض المزيد",
    subjects_no_matches: "لا توجد مواد أخرى حاليا.",

    // Rewards / Popups / Buttons
    reward_congrats: "مبارك! لقد حصلت على:",
    reward_continue: "أكمل",
    lesson_finished: "أنهيت الدرس!",
    test_finished: "أنهيت الاختبار!",
    great_job: "أحســــــــــنت !",
    freeze_single: "تجميد الحماسة",
    freeze_multiple: (n) => `تجميد الحماسة × ${n}`,
    stage_summary_title: "شرح المرحلة",
    stage_summary_no_title: "العنوان",
    stage_summary_no_desc: "لا يوجد وصف",

    // Profile & Stats
    profile_my_subjects: "موادي",
    profile_subjects_count: "مادة",
    profile_enthusiasm: "الحماسة",
    profile_days: "يوم",
    profile_xp_points: "نقاط الخبرة",
    profile_xp: "xp",
    profile_leaderboard: "قائمة المتقدمين",
    profile_view_more: "عرض المزيد",
    profile_challenges: "التحديات",
    profile_completed: "مكتمل",

    // Profile
    profile_title: "الملف الشخصي",
    profile_edit: "تعديل الملف الشخصي",
    profile_save_changes: "حفظ التغييرات",
    profile_cancel: "إلغاء",
    profile_change_avatar: "تغيير الصورة",
    profile_change_password: "تغيير كلمة المرور",
    profile_hide_password_change: "إخفاء تغيير كلمة المرور",
    profile_old_password: "كلمة المرور القديمة",
    profile_new_password: "كلمة المرور الجديدة",
    profile_confirm_password: "تأكيد كلمة المرور الجديدة",
    profile_password_mismatch: "كلمة السر الجديدة غير مطابقة",
    profile_update_success: "تم التحديث بنجاح",
    profile_password_success: "تم تغيير كلمة المرور بنجاح",
    profile_no_title: "بدون لقب",
    profile_joined_on: "تم الإنضمام في",
    profile_no_date: "بدون تاريخ",

    // Profile Stats
    profile_my_subjects_count: "عدد المواد التي أدرسها",
    profile_total_xp: "إجمالي نقاط XP",
    profile_enthusiasm_days: "أيام الحماسة",
    profile_highest_level: "المستوى الذي وصلت له",

    // Achievements
    profile_achievements: "التحديات",
    profile_view_more: "عرض المزيد",
    profile_claim_reward: "احصل على جائزتك",
    profile_completed: "مكتمل",

    // Friends
    profile_my_friends: "أصدقائي",
    profile_suggested_friends: "الأصدقاء المقترحون",
    profile_search_friends: "ابحث عن أصدقاء",
    profile_view_all_friends: "عرض المزيد ←",

    // Buttons
    profile_admin_panel: "لوحة التحكم",
    profile_settings: "الإعدادات",
    profile_logout: "تسجيل الخروج",

    // Common
    common_loading: "جاري التحميل...",

    // Achievements
    achievements_title: "التحديات",
    achievement_claim_reward: "احصل على جائزتك",
    achievement_completed: "مكتمل",

    // Competition
    competition_leaderboard: "قائمة المتقدمين",
    competition_weekly: "المسابقة الأسبوعية",

    // Common
    common_loading: "جاري التحميل...",
    common_error: "حدث خطأ",
    common_success: "تم بنجاح",
  },
  en: {
    appName: "Taallemna",
    loadingAuth: "Checking authentication...",
    nav_home: "Home",
    nav_subjects: "Subjects",
    nav_competitions: "Competitions",
    nav_challenges: "Achievements",
    nav_profile: "Profile",
    nav_settings: "Settings",
    nav_logout: "Logout",
    nav_admin: "Admin Panel",
    no_question: "No question",
    lang_en: "EN",
    lang_ar: "AR",

    // Settings
    nav_settings: "Settings",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    sound_on: "Sound On",
    sound_off: "Sound Off",

    // Home
    home_title: "Home",
    home_recent: "Recent",
    home_my_subjects: "My Subjects",
    home_other_subjects: "Other Subjects",
    home_view_more: "View more",
    home_no_started_subjects: "You haven't started any subject yet.",
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
    login_validation_identifier_short:
      "Username or email must be at least 3 characters.",
    login_validation_password_short: "Password must be at least 8 characters.",
    login_validation_password_upper:
      "Password must include at least one uppercase letter.",
    login_validation_password_lower:
      "Password must include at least one lowercase letter.",
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
    register_success_message:
      "Account created. Please verify your email before logging in.",
    register_error_generic: "Something went wrong",
    register_error_email_exists: "Email already exists",
    register_error_username_exists: "Username already exists",
    register_error_fields_invalid: "Please check your input fields",
    register_validation_username: "Username must be at least 3 characters",
    register_validation_first_name: "First name must be at least 3 characters",
    register_validation_last_name: "Last name must be at least 3 characters",
    register_validation_passwords_mismatch: "Passwords do not match",
    register_validation_password_rules:
      "Password must have 8+ chars, upper, lower, number, special",

    // Subjects
    subjects_title: "Subjects",
    subjects_search_placeholder: "Type here to search",
    subjects_all_subjects: "All subjects",
    subjects_view_more: "View more",
    subjects_no_matches: "No subjects match your search.",

    // Rewards / Popups / Buttons
    reward_congrats: "Congrats! You earned:",
    reward_continue: "Continue",
    lesson_finished: "You finished the lesson!",
    test_finished: "You finished the test!",
    great_job: "Great job!",
    freeze_single: "Motivation Freeze",
    freeze_multiple: (n) => `Motivation Freezes × ${n}`,
    stage_summary_title: "Stage Summary",
    stage_summary_no_title: "Title",
    stage_summary_no_desc: "No description",

    // Hearts Popup
    hearts_counter: "Hearts Counter",
    hearts_next_refill: "You'll get a new heart in:",
    hearts_buy_button: "Buy Heart",
    hearts_full: "All hearts are full ❤️",
    hearts_buy_failed: "Failed to buy heart. Make sure you have enough coins.",

    // Streak Popup
    streak_days: "Day Streak",
    streak_completed: "Completed",
    streak_used_freeze: "Freeze Used",
    streak_today: "Today",
    streak_not_completed: "Not Completed",
    lang_code: "en", // Add language code for conditional rendering

    // Profile & Stats
    profile_my_subjects: "My Subjects",
    profile_subjects_count: "subject",
    profile_enthusiasm: "Enthusiasm",
    profile_days: "day",
    profile_xp_points: "XP Points",
    profile_xp: "xp",
    profile_leaderboard: "Leaderboard",
    profile_view_more: "View more",
    profile_challenges: "Achievements",
    profile_completed: "Completed",

    // Profile
    profile_title: "Profile",
    profile_edit: "Edit Profile",
    profile_save_changes: "Save Changes",
    profile_cancel: "Cancel",
    profile_change_avatar: "Change Avatar",
    profile_change_password: "Change Password",
    profile_hide_password_change: "Hide Password Change",
    profile_old_password: "Old Password",
    profile_new_password: "New Password",
    profile_confirm_password: "Confirm New Password",
    profile_password_mismatch: "New password doesn't match",
    profile_update_success: "Updated successfully",
    profile_password_success: "Password changed successfully",
    profile_no_title: "No Title",
    profile_joined_on: "Joined on",
    profile_no_date: "No date",

    // Profile Stats
    profile_my_subjects_count: "My Subjects Count",
    profile_total_xp: "Total XP Points",
    profile_enthusiasm_days: "Enthusiasm Days",
    profile_highest_level: "Highest Level Reached",

    // Achievements
    profile_achievements: "Achievements",
    profile_view_more: "View More",
    profile_claim_reward: "Claim Your Reward",
    profile_completed: "Completed",

    // Friends
    profile_my_friends: "My Friends",
    profile_suggested_friends: "Suggested Friends",
    profile_search_friends: "Search for friends",
    profile_view_all_friends: "View More ←",

    // Buttons
    profile_admin_panel: "Admin Panel",
    profile_settings: "Settings",
    profile_logout: "Logout",

    // Common
    common_loading: "Loading...",

    // Achievements
    achievements_title: "Achievements",
    achievement_claim_reward: "Claim your reward",
    achievement_completed: "Completed",

    // Competition
    competition_leaderboard: "Leaderboard",
    competition_weekly: "Weekly Competition",

    // Common
    common_loading: "Loading...",
    common_error: "Error occurred",
    common_success: "Success",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "ar"
  );

  // Save language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  // Always force RTL
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.body.setAttribute("dir", "rtl");
  }, [language]);

  const value = useMemo(() => {
    const isRTL = true; // ALWAYS RTL

    const t = (key) => {
      const translation = TRANSLATIONS[language]?.[key];
      return typeof translation === "function"
        ? translation()
        : translation ?? key;
    };

    const toggleLanguage = () =>
      setLanguage((prev) => (prev === "ar" ? "en" : "ar"));

    return { language, isRTL, setLanguage, toggleLanguage, t };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
