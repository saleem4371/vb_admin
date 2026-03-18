"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, MessageCircle, Check, Phone} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderIcons() {
  const [openNotif, setOpenNotif] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New booking received", read: false },
    { id: 2, text: "Venue approved successfully", read: false },
    { id: 3, text: "Payment credited", read: true },
  ]);

  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* Close on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
        setOpenMsg(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="flex items-center gap-6 relative mb-1" ref={notifRef}>
      
      {/* 🔔 NOTIFICATION */}
      <div className="relative">
        <button
          onClick={() => {
            setOpenNotif(!openNotif);
            setOpenMsg(false);
          }}
          className="relative group cursor-pointer"
        >
          <Bell className="w-6 h-6 text-gray-600 group-hover:text-black transition" />

          {unreadCount > 0 && (
            <>
              {/* Animated Ping */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>

              {/* Badge */}
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            </>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {openNotif && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border-b border-gray-200 z-50"
            >
              <div className="p-4 border-b border-gray-200 font-semibold text-gray-700">
                Notifications
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="p-4 text-sm text-gray-400">
                    No notifications
                  </p>
                )}

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition ${
                      !item.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-700">
                      {item.text}
                    </p>

                    {!item.read && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💬 MESSAGE */}
      <div className="relative">
        <button
          onClick={() => {
            setOpenMsg(!openMsg);
            setOpenNotif(false);
          }}
          className="relative group cursor-pointer"
        >
          <Phone className="w-6 h-6 text-gray-600 group-hover:text-black transition" />

          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            5
          </span>
        </button>

        <AnimatePresence>
          {openMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border-b border-gray-200 z-50 p-4"
            >
              <p className="font-semibold text-gray-700 mb-3">
                Support
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  Customer: Is venue available?
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  Admin: Please update gallery.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
