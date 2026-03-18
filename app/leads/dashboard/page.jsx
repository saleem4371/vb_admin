"use client";

import DynamicCalendar from "../components/DynamicCalendar";
import StatsCards from "../components/StatsCards";
import Statistics from "../components/Statistics";

import { Toaster } from "react-hot-toast";

export default function Dashboard() {

  return (
    <div className="min-h-screen bg-slate-100 p-0">

      <Toaster position="top-right"/>

      <div className="grid grid-cols-12 gap-4">

        {/* LEFT SECTION */}

        <div className="col-span-9 space-y-6">

          <DynamicCalendar />

          
<StatsCards />
        </div>

        {/* RIGHT SECTION */}

        <div className="col-span-3">

          <Statistics />

        </div>

      </div>

    </div>
  );
}
