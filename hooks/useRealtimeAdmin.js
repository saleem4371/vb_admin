// import { useEffect, useRef } from "react";
// import { useSocket } from "@/context/SocketContext";

// export default function useRealtimeAdmin({
//   refreshVendor,
//   toast,
//   setNotifications,
//   setOnlineCount,
//   setStats,
// }) {
//   const socket = useSocket();
//   const audioRef = useRef(null);

//   useEffect(() => {
//     if (!socket) return;

//     // preload audio once
//     if (!audioRef.current) {
//       audioRef.current = new Audio("/notification.mp3");
//     }

//     const playSound = () => {
//       audioRef.current
//         ?.play()
//         .catch(() => {}); // avoid crash if autoplay blocked
//     };

//     // 🔥 PLAN UPDATE
//     const handlePlanUpdate = (data) => {
//       refreshVendor?.();
//       playSound();

//       toast?.success(`Plan updated by ${data.updated_by}`);

//       setNotifications?.((prev) => [
//         {
//           type: "plan",
//           message: `${data.updated_by} changed plan`,
//           time: data.time,
//         },
//         ...prev,
//       ]);
//     };

//     // 🔥 BILLING UPDATE
//     const handleBillingUpdate = (data) => {
//       refreshVendor?.();
//       playSound();

//       setNotifications?.((prev) => [
//         {
//           type: "billing",
//           message: `${data.updated_by} updated billing`,
//           time: data.time,
//         },
//         ...prev,
//       ]);
//     };

//     // 📊 STATS
//     const handleStats = (data) => {
//       setStats?.(data);
//     };

//     // 🟢 ONLINE USERS
//     const handleOnlineUsers = (count) => {
//       setOnlineCount?.(count);
//     };

//     // Attach listeners
//     socket.on("planUpdated", handlePlanUpdate);
//     socket.on("billingUpdated", handleBillingUpdate);
//     socket.on("statsUpdated", handleStats);
//     socket.on("onlineUsers", handleOnlineUsers);

//     // Cleanup
//     return () => {
//       socket.off("planUpdated", handlePlanUpdate);
//       socket.off("billingUpdated", handleBillingUpdate);
//       socket.off("statsUpdated", handleStats);
//       socket.off("onlineUsers", handleOnlineUsers);
//     };
//   }, [socket, refreshVendor, toast, setNotifications, setOnlineCount, setStats]);
// }
