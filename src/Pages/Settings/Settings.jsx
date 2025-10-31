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
    <Box sx={{ p: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={handleToggleDarkMode}
            color="primary"
          />
        }
        label={isDarkMode ? "الوضع الداكن" : "الوضع الفاتح"}
      />
    </Box>
  );
};

export default Settings;
