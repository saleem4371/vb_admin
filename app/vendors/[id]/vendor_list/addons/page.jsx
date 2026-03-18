"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil } from "lucide-react";
// import AddAddonModal from "./AddAddonModal";
// import EditAddonModal from "./EditAddonModal";

export default function AddonsList() {

  const [openAdd, setOpenAdd] = useState(false);
  const [editAddon, setEditAddon] = useState(null);

  const addons = [
    {
      id: 1,
      name: "Stage Decoration",
      price: 5000,
      category: "Decoration",
      status: "Active",
      details: "Premium flower decoration setup",
      image: "/img/venue.jpg",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Addons
        </h2>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Add Addon
        </button>

      </div>

      {/* EMPTY STATE */}

      {addons.length === 0 ? (
        <div className="bg-white border rounded-xl py-20 text-center">

          <h3 className="text-lg font-semibold text-gray-700">
            No Addons Available
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Add services like decoration, catering etc
          </p>

          <button
            onClick={() => setOpenAdd(true)}
            className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Addon
          </button>

        </div>
      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {addons.map((addon) => (

            <motion.div
              key={addon.id}
              whileHover={{ y: -4 }}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >

              {/* IMAGE */}

              <div className="h-40 w-full relative">

                <img
                  src={addon.image}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => setEditAddon(addon)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                >
                  <Pencil size={16} />
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-4 space-y-3">

                <div className="flex justify-between">

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      {addon.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {addon.category}
                    </p>

                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      addon.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {addon.status}
                  </span>

                </div>

                <div className="text-lg font-semibold">
                  ₹{addon.price}
                </div>

                <p className="text-sm text-gray-500">
                  {addon.details}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      )}

      {openAdd && <AddAddonModal close={() => setOpenAdd(false)} />}

      {editAddon && (
        <EditAddonModal addon={editAddon} close={() => setEditAddon(null)} />
      )}

    </div>
  );
}
