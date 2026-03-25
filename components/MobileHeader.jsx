"use client";

import { Menu, Bell, User } from "lucide-react";

export default function MobileHeader({ setOpen }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">

      <div className="bg-[#2d3748] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="font-medium">Home</span>
        </div>

        <div className="flex gap-4">
          <Bell size={18} />
          <User size={18} />
        </div>
      </div>

      <div className="bg-[#2d3748] px-4 pb-3">
        <input
          type="text"
          placeholder="Search payment products..."
          className="w-full px-4 py-2 rounded-md bg-gray-200 text-sm text-black"
        />
      </div>

      {/* <div className="bg-yellow-400 text-xs text-center py-1 font-medium">
        ● YOU'RE IN TEST MODE
      </div> */}
    </div>
  );
}
