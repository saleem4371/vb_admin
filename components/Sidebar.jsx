"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import logoSvg from "@/app/logo.svg";

import {
    Home,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  FolderTree,
  Megaphone,
  MapPin,
  Tags,
  Upload,
  UserPlus,
  FileText,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Info,
  Package,
  ChevronRight
} from "lucide-react";

const sections = [
  {
    items: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      { name: "Billing", path: "/billing", icon: CreditCard },
      { name: "Vendors", path: "/vendors", icon: Users },
      { name: "Plans", path: "/plans", icon: Package },
      { name: "Account & Settings", path: "/settings", icon: Settings },
    ],
  },
  {
    title: "Master and Offers",
    showLimit: 2,
    items: [
      { name: "Category & Sub Category", path: "/category", icon: FolderTree },
      { name: "Advertisement", path: "/advertisement", icon: Megaphone },
      { name: "Venue Promotion", path: "/venue-promotion", icon: MapPin },
      { name: "Tags", path: "/tags", icon: Tags },
    ],
  },
  {
    title: "Venue Related",
    showLimit: 4,
    items: [
      { name: "Import", path: "/import_data", icon: Upload },
      { name: "Leads", path: "/leads", icon: UserPlus },
      // { name: "Import Historical", path: "/historical", icon: Database },
    ],
  },
  {
    title: "Front End",
    showLimit: 2,
    items: [
      { name: "About Page", path: "/about", icon: Info },
      { name: "Policies", path: "/policies", icon: FileText },
    ],
  },
];

export default function Sidebar({
  mobile,
  open,
  setOpen,
  collapsed,
  setCollapsed,
}) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState({});
  const [loadingPath, setLoadingPath] = useState(null);

  const width = collapsed ? 80 : 260;

  useEffect(() => {
    setLoadingPath(null);
  }, [pathname]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const content = (
    <motion.div
      animate={{ width }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-[#1f2937] text-gray-300 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && (
          <Image
            src={logoSvg}
            alt="Venuebook Logo"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        )}

        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sections.map((section, i) => {
          const showLimit = section.showLimit || section.items.length;
          const expanded = expandedSections[i];

          const visibleItems = expanded
            ? section.items
            : section.items.slice(0, showLimit);

          return (
            <div key={i} className="mb-4">
              {section.title && !collapsed && (
                <div className="flex items-center justify-between px-5 mb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {section.title}
                  </p>

                  {section.items.length > showLimit && (
                    <motion.button
                      onClick={() => toggleSection(i)}
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronDown size={14} />
                    </motion.button>
                  )}
                </div>
              )}

              <motion.div layout="position" initial={false}>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const loading = loadingPath === item.path;

                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      prefetch
                      onClick={() => setLoadingPath(item.path)}
                    >
                      <div
                        onClick={() => mobile && setOpen(false)}
                        className={`relative flex items-center gap-3 px-5 py-2 text-sm transition-all cursor-pointer
                        ${
                          active
                            ? "bg-black text-white"
                            : "hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        )}

                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Icon size={18} />
                        )}

                        {!collapsed && <span>{item.name}</span>}
                      </div>
                    </Link>
                  );
                })}
              </motion.div>

              {!collapsed && section.items.length > showLimit && (
                <button
                  onClick={() => toggleSection(i)}
                  className="text-xs text-blue-400 px-5 mt-1 hover:text-blue-300 transition"
                >
                  {expanded
                    ? "SHOW LESS"
                    : `SHOW ALL (${section.items.length})`}
                </button>
              )}

              {i !== sections.length - 1 && (
                <div className="my-4 border-t border-gray-700 mx-4" />
              )}
            </div>
          );
        })}
      </nav>
    </motion.div>
  );

  if (!mobile) return content;

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 z-50 md:hidden"
      >
        {content}
      </motion.div>
    </>
  );
}