"use client";

import SettlementHeader from "@/components/vendor_details/SettlementHeader";
import SettlementDetails from "@/components/vendor_details/SettlementDetails";
import AmountBreakdown from "@/components/vendor_details/AmountBreakdown";
import Timeline from "@/components/vendor_details/Timeline";
import GrossSettlementsTable from "@/components/vendor_details/GrossSettlementsTable";

import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

export default function VendorInformation() {
  const [Loading, setLoading] = useState(false);
  const [users, setUser] = useState("");

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
          body: JSON.stringify({ id: id }),
        },
      );

      const data = await res.json();
      setUser(data?.vendors[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8 space-y-6">
          <SettlementHeader
            id={id}
            users={users}
            refreshVendor={fetchData}
            className="mb-1"
          />
          <SettlementDetails
            id={id}
            users={users}
            refreshVendor={fetchData}
            className="mb-1"
          />
          <AmountBreakdown
            id={id}
            users={users}
            refreshVendor={fetchData}
            className="mb-1"
          />
        </div>

        <div className="col-span-4 h-full">
          <Timeline
            id={id}
            users={users}
            refreshVendor={fetchData}
            className="mb-1"
          />
        </div>
        <div className="col-span-12">
          <GrossSettlementsTable
            id={id}
            users={users}
            refreshVendor={fetchData}
            className="mb-1"
          />
        </div>
      </div>
    </div>
  );
}
