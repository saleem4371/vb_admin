"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function TopBanner() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="w-full bg-[#f1f5f9] border-b border-gray-200">
      <div className="flex items-center justify-between h-12 px-4 md:px-0">

        {/* LEFT GREEN ANGLED */}
        <div className="relative flex items-center">
          <div className="bg-green-600 text-white text-sm font-medium px-4 h-12 flex items-center pr-8 clip-rzp">
           Recent Customer Reviews
          </div>
        </div>

        {/* CENTER TEXT */}
        <p className="hidden md:block text-sm text-gray-600 ml-6 flex-1 truncate">
          Sleem Sys: Good 4 Str
        </p>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded">
            View all
          </button>

          <button
            onClick={() => setShow(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}