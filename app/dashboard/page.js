"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCards";
import TopBanner from "@/components/banner";
import DateRangePicker from "@/components/DateRangePicker";

import RevenueChart from "@/components/charts/RevenueChart";
import Aging from "@/components/charts/aging";

import NotificationPanel from "@/components/NotificationPanel";
import OnlineUsers from "@/components/OnlineUsers";
import UnregVerification from "@/components/UnregVerification";
// import useRealtimeAdmin from "@/hooks/useRealtimeAdmin";
import io from "socket.io-client";

export default function Dashboard({ toast }) {
  const [data, setData] = useState(null);

  const [stats, setStats] = useState({
    collected: 0,
    refunds: 0,
    disputes: 0,
  });
  const [Vendors, setVendors] = useState(0);

  useEffect(() => {
    const loadBillingFilter = async () => {
      try {
        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/overview_counts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              duration: "180", // important fix
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "API error");
        const collected =
          data.subscription_amount + data.transaction_amount || 0;
        const collected_vendor = data.vendors_count || 0;
        setStats(collected);
        setVendors(collected_vendor);
        // stats.refunds = data.transaction_amount || 0;
        //stats.disputes = data.subscription_amount || 0;
      } catch (err) {
        toast.error(err.message || "Failed to load overview");
      } finally {
      }
    };
    loadBillingFilter();
  }, ["180"]); // reload when filter changes // important

  const [notifications, setNotifications] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  const refreshVendor = () => {
    console.log("refresh API call");
  };

  useEffect(() => {
    const socket = io("https://websockettest.venuebook.in:5000/");

    socket.on("live_data", (msg) => {
      setData(msg);
    });

    return () => socket.disconnect();
  }, []);

  // useRealtimeAdmin({
  //   refreshVendor,
  //   toast,
  //   setNotifications,
  //   setOnlineCount,
  // });

  return (
    <div className="space-y-6">
      <TopBanner />
      {/* Date Filter Bar */}
      <div className="bg-white border border-gray-200 p-4 flex justify-between items-center text-sm mb-2">
        <div className="flex gap-4">
          <DateRangePicker />
        </div>

        <div className="text-gray-600">Current Balance: ₹0.00</div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-2 mb-2">
        <StatCard title="Payment Volume" value={`₹${stats}`} amount="yes" />
        <StatCard title="Number of Vendors" value={`${Vendors}`} amount="no" />
        <StatCard title="Number of Pay Later" value="0" />
      </div>
      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-2">
        <div className="">
          <RevenueChart />
        </div>{" "}
        {/* Stats */}
        <div className="">
          <Aging />
        </div>{" "}
        {/* Stats */}
      </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-2">
          {/* LEFT SIDEBAR */}
          <div className="w-full">
            <UnregVerification data={data} />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full">{/* Your stats / content here */}</div>
        </div>
    

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 p-6 h-96">
        <p className="text-gray-500 text-sm">Analytics Chart Area</p>
        <OnlineUsers count={onlineCount} />
        <NotificationPanel notifications={notifications} />
      </div>{" "}
      {/* Stats */}
    </div>
  );
}
