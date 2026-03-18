"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function LivePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io("https://websockettest.venuebook.in:5000/");

    socket.on("live_data", (msg) => {
      setData(msg);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Realtime Data</h1>
      <p>{data ? data.time : "Loading..."}</p>
    </div>
  );
}