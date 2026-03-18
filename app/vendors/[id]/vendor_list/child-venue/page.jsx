"use client";

import { useState } from "react";
import { Pencil, MapPin, Users, Sun, Sunset, Moon } from "lucide-react";
import EditChildVenueModal from "@/app/vendors/[id]/components/EditChildVenueModal";

export default function ChildVenueList() {
  const [editVenue, setEditVenue] = useState(null);

  const venues = [
    {
      id: "C6990",
      name: "Swarnagiri Mantap Indoor",
      image: "/img/venue.jpg",
      capacity: 500,
      city: "Hyderabad",
      type: "Indoor",
      shifts: {
        morning: 30000,
        afternoon: 35000,
        evening: 45000,
      },
    },
    {
      id: "C6991",
      name: "Swarnagiri Garden Lawn",
      image: "/img/venue.jpg",
      capacity: 350,
      city: "Hyderabad",
      type: "Outdoor",
      shifts: {
        morning: 20000,
        afternoon: 28000,
        evening: 38000,
      },
    },
  ];

  const Shift = ({ icon: Icon, label, price }) => (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Icon size={15} />
        {label}
      </div>
      <span className="font-semibold text-gray-800 text-sm">₹{price}</span>
    </div>
  );

  return (
    <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
        >
          {/* IMAGE */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* venue type */}
            <span className="absolute top-3 left-3 bg-white/90 text-xs px-3 py-1 rounded-full font-medium">
              {venue.type}
            </span>

            {/* edit button */}
            <button
              onClick={() => setEditVenue(venue)}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow"
            >
              <Pencil size={16} />
            </button>

            {/* title on image */}
            <div className="absolute bottom-3 left-4 text-white">
              <h3 className="font-semibold text-lg leading-tight">
                {venue.name}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-4">

            {/* capacity + city */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users size={16} />
                {venue.capacity} Guests
              </div>

              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {venue.city}
              </div>
            </div>

            {/* shifts */}
            <div className="space-y-2 pt-1">
              <Shift icon={Sun} label="Morning" price={venue.shifts.morning} />
              <Shift icon={Sunset} label="Afternoon" price={venue.shifts.afternoon} />
              <Shift icon={Moon} label="Evening" price={venue.shifts.evening} />
            </div>
          </div>
        </div>
      ))}

      {editVenue && (
        <EditChildVenueModal
          venue={editVenue}
          close={() => setEditVenue(null)}
        />
      )}
    </div>
  );
}
