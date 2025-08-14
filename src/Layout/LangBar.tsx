// import React from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { UserAddOutlined} from "@ant-design/icons";

// interface LangBarProps {
//   currentLang: string;
//   onLangChange: (lang: string) => void;
// }

// const LangBar: React.FC<LangBarProps> = ({ currentLang, onLangChange }) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("accessToken"); // Check for token
  

  

//   const handleLogout = async () => {
//     const refreshToken = localStorage.getItem("refreshToken");

//     if (!refreshToken) {
//       console.error("No refresh token available.");
//       return;
//     }

    

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/users/auth/dashboard/logout",
//         { refresh: refreshToken },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       console.log("Logout successful", response.data);

//       // Clear tokens from localStorage or cookies
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("userRole");

//       navigate("/"); // Navigate to home
//     } catch (error: any) {
//       console.error(
//         "Logout failed",
//         error.response?.data?.meta?.message || error.message
//       );
//     }
//   };

//   const handleLanguageSwitch = (lang: string) => {
//     searchParams.set("lang", lang);
//     setSearchParams(searchParams);
//     onLangChange(lang);
//   };

//   return (
//     <div></div>
//     // <div className="bg-[#011C38] h-[75px] flex items-center justify-between px-6 bg-[url('src/assets/Images/LangBarBG.png')]">
//     //   <div className="text-white text-[26px] space-x-6">
//     //     {["gr", "en", "ru"].map((lang) => (
//     //       <span
//     //         key={lang}
//     //         className={`cursor-pointer ${
//     //           currentLang === lang ? "font-bold underline" : ""
//     //         }`}
//     //         onClick={() => handleLanguageSwitch(lang)}
//     //       >
//     //         {lang.toUpperCase()}
//     //       </span>
//     //     ))}
//     //   </div>
//     //   <div className="flex gap-10">
//     //   {/* Admin Icon */}
//     //   {accessToken && (
//     //     <Link to="/add-admin" className="text-white flex items-center  ">
//     //       <UserAddOutlined className="text-2xl mr-2" />
//     //       <span className="hidden md:block">Add Admin</span>
//     //     </Link>
//     //   )}

//     //   {accessToken && ( // Conditionally render the logout button
//     //     <button
//     //       onClick={handleLogout}
//     //       className="text-white bg-red-500 px-4 py-2 rounded"
//     //     >
//     //       Logout
//     //     </button>
//     //   )}
//     //   </div>
//     // </div>
//   );
// };

// export default LangBar;
