"use client";

import { useState } from "react";
import Toast from "./Toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useSound } from "./useSound";
import { useRouter } from "next/navigation";

export default function NotificationProvider({ children }) {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { playSound } = useSound();

  useNotifications((msg, data) => {
    // 🔊 play sound
    playSound();

    // 🎨 show toast
    setMessage(msg);

    // auto close
    setTimeout(() => setMessage(""), 4000);

    // optional redirect
    if (data?.url) {
      setTimeout(() => {
        router.push(data.url);
      }, 2000);
    }
  });

  return (
    <>
      {children}
      <Toast message={message} onClose={() => setMessage("")} />
    </>
  );
}