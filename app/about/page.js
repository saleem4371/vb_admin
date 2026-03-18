"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, BuildingOffice2Icon, KeyIcon } from "@heroicons/react/24/outline";

export default function About() {
  const [activeTab, setActiveTab] = useState("venues");

  return (
    <section className="relative min-h-[85vh] flex items-center">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/hero-bg.jpg')", // put your image in public/img
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-20 py-20">
        <div className="max-w-4xl">

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Your Next Great Story <br />
            Starts with the Right{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Farmstays
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-gray-300 text-lg max-w-2xl">
            Find the perfect, personal space—from unique city hideaways
            to inspiring country escapes.
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setActiveTab("venues")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                activeTab === "venues"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <BuildingOffice2Icon className="w-5 h-5" />
              Venues
            </button>

            <div className="relative">
              <button
                onClick={() => setActiveTab("farmstay")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                  activeTab === "farmstay"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <KeyIcon className="w-5 h-5" />
                Farmstay & Unique Villas
              </button>

              {/* Coming Soon Badge */}
              <span className="absolute -top-3 right-4 text-[10px] px-2 py-1 rounded-full bg-yellow-400 text-black font-semibold">
                COMING SOON
              </span>
            </div>
          </div>

          {/* Search Glass Bar */}
          <div className="mt-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-0 shadow-xl max-w-3xl">

            {/* Location */}
            <div className="flex-1 px-4">
              <p className="text-sm text-gray-300">Location</p>
              <input
                type="text"
                placeholder="Search Locations"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
              />
            </div>

            <div className="hidden md:block w-px h-10 bg-white/20" />

            {/* Date */}
            <div className="flex-1 px-4">
              <p className="text-sm text-gray-300">Date</p>
              <input
                type="date"
                className="bg-transparent outline-none text-white w-full"
              />
            </div>

            <div className="hidden md:block w-px h-10 bg-white/20" />

            {/* Guests */}
            <div className="flex-1 px-4">
              <p className="text-sm text-gray-300">How Many</p>
              <input
                type="number"
                placeholder="Add Guests"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
              />
            </div>

            {/* Search Button */}
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl shadow-lg hover:scale-105 transition">
              <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
