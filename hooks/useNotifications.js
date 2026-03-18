"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { showBrowserNotification } from "@/lib/notification";

export const useNotifications = (onToast) => {
  useEffect(() => {
    const socket = getSocket();

    socket.on("new_booking", (data) => {
      if (document.visibilityState === "visible") {
         console.log("👀 SHOW TOAST",data.message);
        onToast(data.message, data);
      } else {
        showBrowserNotification("New Booking", data.message);
      }
    });

    return () => socket.off("new_booking");
  }, [onToast]);
};



