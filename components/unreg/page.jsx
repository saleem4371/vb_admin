"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function OfferModal({ open, onClose, states, eventData }) {
  const [activeState, setActiveState] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeVenue, setActiveVenue] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [searchState, setSearchState] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const filteredStates = useMemo(() => {
    return states?.[0]?.states?.filter((s) =>
      s.state.toLowerCase().includes(searchState.toLowerCase())
    );
  }, [states, searchState]);

  const scrap_data_load = async () => {
    
    try {
      setLoading(true);

      const param = {
        state: activeState?.state,
        city: activeDistrict,
        googleType: activeVenue,
      };

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/upload_unreg_vendors",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      alert("Unregistered data Scrapped successful 🎉");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-xl flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold mb-3">States</h2>

            <input
              type="text"
              placeholder="Search state..."
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredStates?.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveState(item);
                  setActiveDistrict(null);
                  setActiveVenue(null);
                  setExpandedDistrict(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition cursor-pointer
                ${
                  activeState?.state === item.state
                    ? "bg-black text-white"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {item.state} (0)
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {activeState ? activeState.state : "Select a State"}
            </h2>
          </div>

          {/* DISTRICT SEARCH */}
          {activeState && (
            <div className="px-6 pt-4">
              <input
                type="text"
                placeholder="Search district..."
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 rounded-md text-sm"
              />
            </div>
          )}

          {/* DISTRICTS ACCORDION */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {activeState?.districts
              ?.filter((d) =>
                d.name.toLowerCase().includes(searchDistrict.toLowerCase())
              )
              .map((district, i) => {
                const openAccordion = expandedDistrict === district.name;

                return (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* DISTRICT HEADER */}
                    <button
                      onClick={() =>
                        setExpandedDistrict(
                          openAccordion ? null : district.name
                        )
                      }
                      className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
                    >
                      <span className="font-medium">{district.name} (0)</span> 
                      <span className="cursor-pointer">{openAccordion ? "-" : "+"}</span>
                    </button>

                    {/* SUB DISTRICTS */}
                    <AnimatePresence>
                      {openAccordion && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="p-4 flex flex-wrap gap-2"
                        >
                          {district.sub_districts.map((sub, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveDistrict(sub.name)}
                              className={`px-4 py-2 rounded-full text-sm transition border border-gray-200 cursor-pointer
                              ${
                                activeDistrict === sub.name
                                  ? "bg-black text-white border-b border-gray-200"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              {sub.name} (0)
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

          {/* VENUE TYPES */}
          {activeState && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="font-semibold mb-3">Venue Types</h3>

              <div className="flex flex-wrap gap-2">
                {eventData?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveVenue(item.name)}
                    className={`px-4 py-2 rounded-full text-sm transition cursor-pointer
                    ${
                      activeVenue === item.name
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-md cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={scrap_data_load}
              disabled={!activeDistrict || !activeVenue || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t border-gray-200-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Scraping..." : "Scrap data"}
            </button>
          </div>
        </div>
      </div>
       <Toaster position="top-right" />
    </div>
  );
}