// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { getSocket } from "@/lib/socket";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const userId = localStorage.getItem("user_id");

//     if (!userId) {
//       console.log("❌ No userId");
//       return;
//     }

//     const s = getSocket(userId);

//     // ✅ IMPORTANT FIX
//     setSocket(s);

//     // ---------------- EVENTS ----------------
//     s.on("connect", () => {
//       console.log("✅ Connected:", s.id);
//     });

//     s.on("connect_error", (err) => {
//       console.log("❌ Error:", err.message);
//     });

//     s.on("disconnect", () => {
//       console.log("🔴 Disconnected");
//     });

//     // ---------------- CLEANUP ----------------
//     return () => {
//       s.off("connect");
//       s.off("connect_error");
//       s.off("disconnect");
//       s.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);
