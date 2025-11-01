import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Switch, FormControlLabel, Box } from "@mui/material";

const Settings = () => {
  const { setPageTitle, isDarkMode, setIsDarkMode } = useOutletContext();

  useEffect(() => {
    setPageTitle("الإعدادات");
  }, [setPageTitle]);

  const handleToggleDarkMode = (event) => {
    const newMode = event.target.checked;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode); // persist user preference
  };

  return (
    <Box
      sx={{
        p: 2,
        direction: "rtl",
        display: "flex",
        justifyContent: "flex-end", // align to the right
        alignItems: "center",
        height: "100%", // optional if you want vertical centering
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={handleToggleDarkMode}
            color="primary"
          />
        }
        label={isDarkMode ? "الوضع الداكن" : "الوضع الفاتح"}
        sx={{
          ml: 0,
          mr: 2,
          gap:23,
          "& .MuiFormControlLabel-label": {
            fontSize: "20px", // 👈 change this value as you like (e.g., 0.9rem, 18px)
            fontWeight: 400, // optional
          },
        }}
      />
    </Box>
  );
};

export default Settings;
