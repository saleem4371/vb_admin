"use client";

import { useRef } from "react";

export const useSound = () => {
  const audioRef = useRef(null);

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/notification.mp3"); // put file in public/
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  return { playSound };
};

