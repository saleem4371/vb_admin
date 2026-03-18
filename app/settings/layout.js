"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tabs = [
  { name: "Account details", path: "/settings/account" },
  { name: "Password details", path: "/settings/password" },
  { name: "Third party API", path: "/settings/third_party_application" },
  { name: "Modules", path: "/settings/modules" },
  { name: "Role & Permission", path: "/settings/permission" },
  { name: "Users", path: "/settings/users" },
  { name: "Charges", path: "/settings/charges" }
];

const tabNames = {
  "/settings/account": "Account details",
  "/settings/password": "Password details",
  "/settings/third_party_application": "Third party API",
  "/settings/modules": "Modules",
  "/settings/permission": "Role & Permission",
  "/settings/Users": "Users",
  "/settings/charges": "Charges",
};

export default function AccountSettings({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = tabNames[pathname] || "Account details";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
        </button>

        <p className="text-sm text-gray-500">
          Account & Settings
          <span className="mx-2">›</span>
          <span className="text-blue-600">{currentTab}</span>
        </p>
      </div>

      {/* Tabs */}
      <div>
        <div className="bg-white border border-gray-200 relative mb-2">
          <div className="flex gap-6 px-4">
            {tabs.map((tab) => {
              const active = pathname === tab.path;

              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  onClick={() => setLoading(true)}
                >
                  <div
                    className={`relative py-3 text-sm font-medium transition
                    ${
                      active
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
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

       
        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-10 bg-white border border-gray-200 mt-2">
            <motion.div
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                ease: "linear",
              }}
            />
          </div>
        )}

        {/* Page Content */}
        {!loading && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-2 space-y-6 bg-white border border-gray-200 mt-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}