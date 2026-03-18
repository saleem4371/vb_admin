import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

import CountrySelect from "./country_list";
import HeaderIcons from "./header_notification";
import {
  UserCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Header({ onSelectCountry,data }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);


  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const profileRef = useRef(null);
  const countryRef = useRef(null);

  const suggestions = ["Payments", "Customers", "Invoices", "Settings"];

  const LogOut = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  // close dropdowns
  useEffect(() => {
    const handleClick = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
      if (!countryRef.current?.contains(e.target)) setCountryOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

   const handleSelect = (name) => {
    console.log("Selected:", name);
    setSelected(name);
    alert(name.name)
  };

  //   useEffect(() => {
  //   if (onSelect) onSelect(selected);
  // }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">

        {/* 🔍 SEARCH (always visible) */}
        <div className="relative w-80">
          <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="ml-2 w-full text-sm outline-none"
            />
          </div>

          {/* autocomplete */}
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 cursor-pointer"
              >
                {suggestions
                  .filter((item) =>
                    item.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((item, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* 🌍 Country (moved right) */}
          <div className="relative" ref={countryRef}>
           
            <CountrySelect onSelect={onSelectCountry}/>
          </div>

          {/* Test Mode */}
          {/* <div className="text-sm text-gray-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Test Mode
          </div>
          <button className="text-sm text-gray-600 hover:text-black">
            What's New
          </button> */}
          <HeaderIcons/>

          {/* 👤 Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer"
            >
              {/* <UserCircleIcon className="w-8 h-8 text-gray-700" /> */}
              {/* <Image
                        src={ 'https://apitest.venuebook.in/'+data.logo }
                        alt="bg"
                        fill
                        className="object-cover "
                      /> */}
                      <div className="w-10 h-10 rounded-full overflow-hidden mx-auto">
  <Image
    src="https://apitest.venuebook.in/Upload/Logo/venuebooking.svg"
    alt="profile"
    width={48}
    height={48}
    className="object-cover"
  />
</div>
              
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-lg border  border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Logged in as {data.name}</p>
                    <p className="text-sm font-medium">
                      {data.email}
                    </p>
                  </div>

                  <div className="p-3">
                    <button
                      onClick={LogOut}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}