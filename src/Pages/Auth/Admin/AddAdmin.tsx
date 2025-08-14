// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddAdmin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [accountEnabled, setAccountEnabled] = useState(true); // Default value is true
//   const [responseMessage, setResponseMessage] = useState("");
//   const navigate = useNavigate();
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const baseUrl = "http://localhost:8000";
//     const token = localStorage.getItem("accessToken");

//     try {
//       const response = await axios.post(
//         `${baseUrl}/api/v1/users/auth/dashboard/register`,
//         {
//           email,
//           password,
//           first_name: firstName,
//           last_name: lastName,
//           account_enabled: accountEnabled,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       navigate("/home");
//       setResponseMessage(
//         response.data.meta.message || "Admin added successfully!"
//       );
//     } catch (error: any) {
//       setResponseMessage(
//         error.response?.data?.meta?.message || "An error occurred."
//       );
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-bold">First Name:</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             className="border rounded w-full p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-bold">Last Name:</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             className="border rounded w-full p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-bold">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded w-full p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-bold">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border rounded w-full p-2"
//             required
//           />
//         </div>
//         <div className="flex items-center space-x-2">
//           <label className="block font-bold">Account Enabled:</label>
//           <input
//             type="checkbox"
//             checked={accountEnabled}
//             onChange={(e) => setAccountEnabled(e.target.checked)} // Updates the boolean state
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-[#011C38] text-white px-4 py-2 rounded"
//         >
//           Add Admin
//         </button>
//       </form>
//       {responseMessage && (
//         <p className="mt-4 text-[#011C38] font-bold">{responseMessage}</p>
//       )}
//     </div>
//   );
// };

// export default AddAdmin;
