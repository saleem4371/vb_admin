

"use client";

import SettlementHeader from "@/components/vendor_details/SettlementHeader";
import SettlementDetails from "@/components/vendor_details/SettlementDetails";
import AmountBreakdown from "@/components/vendor_details/AmountBreakdown";
import Timeline from "@/components/vendor_details/Timeline";
import GrossSettlementsTable from "@/components/vendor_details/GrossSettlementsTable";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import { useParams } from "next/navigation";


export default function VendorInformation() {
  const [Loading, setLoading] = useState(false);
  const [users, setUser] = useState("");
  const [subscription, setSubscription] = useState("");

  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/single_vendor_data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      setUser(data?.vendors[0]);
      setSubscription(data?.subscription);

     // setUser(data?.vendors?.[0] || null);
     // setSubscription(Array.isArray(data?.subscription) ? data.subscription : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-4">
          <SettlementHeader id={id} users={users} refreshVendor={fetchData}  toast = { toast }/>
          <SettlementDetails id={id} users={users} refreshVendor={fetchData}  toast = { toast }/>
          <AmountBreakdown id={id} users={users} refreshVendor={fetchData}  toast = { toast }/>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4">
          <Timeline id={id} users={users} refreshVendor={fetchData}   toast = { toast }/>
        </div>

        {/* TABLE FULL WIDTH */}
        <div className="col-span-1 lg:col-span-12">
          <GrossSettlementsTable subscription={subscription} toast = { toast } />
        </div>
      </div>
    </div>
  );
}

