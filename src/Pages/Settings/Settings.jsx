import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
const Settings = () => {
   const { setPageTitle } = useOutletContext();
   useEffect(() => {
    setPageTitle("الإعدادات");
  }, [setPageTitle]);
  return (
    <div>Settings</div>
  )
}

export default Settings