"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Amenities() {

  const sections = [
    {
      title: "Recreation",
      items: ["Spa / Salon", "Gym", "Swimming Pool"],
    },
    {
      title: "Parking & Transportation",
      items: ["Valet Parking", "Airport Pickup", "Free Parking", "Car Rental"],
    },
    {
      title: "AV & Technical Equipment",
      items: [
        "Movable Walls",
        "Backup Power",
        "Loading Dock",
        "Portable Coolers",
        "Projectors & Mics",
        "Onsite AV Staff",
        "Staging Area",
      ],
    },
    {
      title: "Business Services",
      items: ["Wi-Fi", "Business Center", "Event Coordinator", "VIP Services"],
    },
  ];

  const [selected, setSelected] = useState([]);

  const toggleAmenity = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className=" p-0 space-y-8">

      {sections.map((section, index) => (

        <div
          key={index}
          className="bg-white  border border-gray-200 shadow-sm p-6 mb-2"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {section.title}
          </h2>

          <div className="flex flex-wrap gap-3 mb-1">

            {section.items.map((item, i) => {

              const active = selected.includes(item);

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleAmenity(item)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </motion.button>
              );
            })}

          </div>
        </div>

      ))}

    </div>
  );
}
