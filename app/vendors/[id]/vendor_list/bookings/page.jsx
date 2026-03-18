"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Search } from "lucide-react";

export default function BookingsGrid() {

  const bookingsData = [
    {
      id: "BK1001",
      customer: "Rahul Sharma",
      venue: "Swarnagiri Mantap",
      date: "12 Dec 2026",
      guests: 450,
      city: "Hyderabad",
      status: "Confirmed",
    },
    {
      id: "BK1002",
      customer: "Ayesha Khan",
      venue: "Miranda Gardens",
      date: "20 Dec 2026",
      guests: 300,
      city: "Bangalore",
      status: "Pending",
    },
    {
      id: "BK1003",
      customer: "Arjun Reddy",
      venue: "Sagar Auditorium",
      date: "5 Jan 2027",
      guests: 600,
      city: "Chennai",
      status: "Cancelled",
    },
    {
      id: "BK1004",
      customer: "Priya Patel",
      venue: "Royal Palace",
      date: "18 Jan 2027",
      guests: 250,
      city: "Mumbai",
      status: "Confirmed",
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const perPage = 6;

  // Filter
  const filtered = bookingsData.filter((b) => {

    const matchSearch =
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.venue.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" ? true : b.status === statusFilter;

    return matchSearch && matchStatus;

  });

  const totalPages = Math.ceil(filtered.length / perPage);

  const bookings = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-2 space-y-6">

      {/* HEADER */}

      

      {/* FILTER */}

      <div className="flex  justify-between gap-2 flex-wrap">
<div>
        {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (

          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm rounded-lg ${
              statusFilter === status
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>

          

        ))}
        </div>

        <div className="relative w-full md:w-72">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            placeholder="Search customer or venue..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-200
 rounded-lg pl-10 pr-4 py-2"
          />

        </div>

      </div>

      {/* GRID */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">

        {bookings.map((b) => (

          <motion.div
            key={b.id}
            whileHover={{ y: -6 }}
            className="bg-white border border-gray-200
 rounded-xl p-5 shadow-sm hover:shadow-lg transition"
          >

            <div className="flex justify-between items-start mb-3">

              <div>
                <h3 className="font-semibold text-gray-800">
                  {b.customer}
                </h3>

                <p className="text-xs text-gray-500">
                  {b.id}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  b.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {b.status}
              </span>

            </div>

            <p className="text-sm text-gray-600 mb-4">
              {b.venue}
            </p>

            <div className="space-y-2 text-sm text-gray-500">

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {b.date}
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} />
                {b.guests} Guests
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {b.city}
              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* PAGINATION */}

      <div className="flex justify-center gap-2 pt-6">

        {[...Array(totalPages)].map((_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 text-sm rounded-lg ${
              page === i + 1
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>

        ))}

      </div>

    </div>
  );
}
