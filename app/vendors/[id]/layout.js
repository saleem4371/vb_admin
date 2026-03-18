"use client";

import { useParams } from "next/navigation";
import VendorTabs from "./components/VendorTabs";
import BackButton from "@/components/BackButton";

export default function VendorLayout({ children }) {
  const { id: vendorId } = useParams();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <BackButton />

        <h1 className="text-lg font-semibold text-gray-800">
          Vendor : <span className="text-gray-600">{vendorId}</span>
        </h1>
      </div>

      {/* Tabs */}
      <VendorTabs vendor_id={vendorId} />

      {/* Page Content */}
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}
