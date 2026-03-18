"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OfferModal from "@/components/unreg/page";
import indiaStates from "@/data/json/allcountry.json";
import events from "@/data/json/events.json";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function QRCodesPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [enableFilter, setEnableFilter] = useState(false);

  const [Loading, setLoading] = useState(false);
  const [TransactionData, setTransactionData] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  const unrigistered_venues = async (
    pageNumber = 1,
    searchValue = "",
    state = "",
    district = "",
  ) => {
    try {
      setLoading(true);

      const param = {
        country: "india",
        page: pageNumber,
        limit: itemsPerPage,
        search: searchValue,
        state: state,
        district: district,
      };

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/unrigistered_venues",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        },
      );

      const data = await res.json();

      setTransactionData(data.results || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error loading venues", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      unrigistered_venues(page, search, stateFilter, districtFilter);
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, stateFilter, districtFilter]);

  const clearFilters = () => {
    setSearch("");
    setStateFilter("");
    setDistrictFilter("");
    setPage(1);
  };

  return (
    <div className="bg-white">
      <div className="border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Unregistered Venues</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setEnableFilter(!enableFilter)}
              className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              {enableFilter ? "Close Filter" : "Filter"}
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              + Import
            </button>
          </div>
        </div>

        {/* Filters */}
        {enableFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-6 border-b border-gray-200 bg-gray-50"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search venue..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2"
              />

              {/* State */}
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setDistrictFilter("");
                  setPage(1);
                }}
                className="border border-gray-200 rounded-md px-3 py-2"
              >
                <option value="">All States</option>
                {indiaStates?.[0]?.states.map((state, i) => (
                  <option key={i} value={state.state}>
                    {state.state}
                  </option>
                ))}
              </select>

              {/* District */}
              {/* <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 rounded-md px-3 py-2"
              >
                <option value="">All City</option>
                {indiaStates
                  .find((s) => s.name === stateFilter)
                  ?.districts?.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.name}
                    </option>
                  ))}
              </select> */}

              <button
                onClick={clearFilters}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-200">
                <th className="py-3 px-2">Venue</th>
                <th className="py-3 px-2">City</th>
                <th className="py-3 px-2">State</th>
                <th className="py-3 px-2">District</th>
                <th className="py-3 px-2">Address</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>

            <tbody>
            {Loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="6" className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : Loading && TransactionData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                 No venues found
                </td>
              </tr>
            ) : (
              TransactionData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2 font-medium">{item.name}</td>
                  <td className="py-3 px-2">{item.city}</td>
                  <td className="py-3 px-2">{item.state}</td>
                  <td className="py-3 px-2">{item.district}</td>
                  <td className="py-3 px-2">{item.address}</td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      href={`/import_data/${item.id}`}
                      className="flex items-center justify-end gap-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Details
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-6 gap-3 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border border-gray-200 rounded disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border border-gray-200 rounded disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <OfferModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          states={indiaStates}
          eventData={events}
        />
      )}
    </div>
  );
}
