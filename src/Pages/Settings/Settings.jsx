
import { useLanguage } from "../../Context/LanguageContext";
import { useOutletContext } from "react-router-dom";
import { Box, Switch, FormControlLabel } from "@mui/material";
import React, { useEffect } from "react";
import { useSound } from "../../Context/SoundContext";

const Settings = () => {
  const { setPageTitle, isDarkMode, setIsDarkMode } = useOutletContext();
  const { language, toggleLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();

  useEffect(() => {
    setPageTitle(t("nav_settings"));
  }, [setPageTitle, t]);

  const handleToggleDarkMode = (event) => {
    const newMode = event.target.checked;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleToggleLanguage = () => {
    toggleLanguage();
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "100%",
      }}
    >
      {/* Dark Mode */}
      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={handleToggleDarkMode}
            color="primary"
          />
        }
        label={isDarkMode ? t("dark_mode") : t("light_mode")}
        sx={{
          "& .MuiFormControlLabel-label": { fontSize: "20px", fontWeight: 400 },
        }}
      />

      {/* Language */}
      <FormControlLabel
        control={
          <Switch
            checked={language === "en"}
            onChange={handleToggleLanguage}
            color="primary"
          />
        }
        label={language === "en" ? t("lang_ar") : t("lang_en")}
        sx={{
          "& .MuiFormControlLabel-label": { fontSize: "20px", fontWeight: 400 },
        }}
      />

      {/* 🔊 Sound Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={soundEnabled}
            onChange={handleToggleSound}
            color="primary"
          />
        }
        label={soundEnabled ? t("sound_on") : t("sound_off")}
        sx={{
          "& .MuiFormControlLabel-label": { fontSize: "20px", fontWeight: 400 },
        }}
      />
    </Box>
  );
};

export default Settings;
