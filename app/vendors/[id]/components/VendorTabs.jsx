"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  Building2,
  MapPin,
  LayoutGrid,
  Package,
  Sparkles,
  CalendarCheck,
  FileText,
  WalletMinimal
} from "lucide-react";

export default function VendorTabs({ vendor_id }) {
  const pathname = usePathname();

 const tabs = [
  { name: "Vendor Information", slug: "vendor-information", icon: Building2 },
  { name: "Parent Venue", slug: "parent-venue", icon: MapPin },
  { name: "Child Venue", slug: "child-venue", icon: LayoutGrid },
  { name: "Addons", slug: "addons", icon: Package },
  { name: "Amenities", slug: "amenities", icon: Sparkles },
  { name: "Bookings", slug: "bookings", icon: CalendarCheck },
  { name: "Terms & Condition", slug: "terms-condition", icon: FileText },
  { name: "Wallet & Security", slug: "wallet-security", icon: WalletMinimal },
];

  return (
    <div className="bg-white border-b border-gray-200 mb-2">
      <div className="flex gap-6 px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `/vendors/${vendor_id}/vendor_list/${tab.slug}`;
          const active = pathname === href;
const Icon = tab.icon;
          return (
            <Link key={tab.slug} href={href} scroll={false}>
              <div
                className={`flex gap-1 relative py-3 text-sm font-medium whitespace-nowrap transition-colors
                ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                 <Icon size={16} />
                {tab.name}

                {active && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
