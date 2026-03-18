"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";


import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

export default function VenueProfile() {
  const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [parent, setParent] = useState('');
  const venue = {
    name: "Sagar Auditorium",
    address: "Panemangalore Road",
    city: "Munnuru",
    state: "Karnataka",
    latitude: "12.8710",
    longitude: "74.9955",
    about: "Premium wedding and event venue",
    video: "https://youtube.com/watch?v=xxxx",
  };

  const params = useParams();
    const id = params.id;
    
      const fetchData = async () => {
        try {
          setLoading(true);
  
          const res = await fetch(
            "https://websockettest.venuebook.in:5000/admin/getParent",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id:id }),
            },
          );
  
          const data = await res.json();
          setParent(data?.vendor);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  useEffect(() => {
      fetchData();
    }, [id]);

const getEmbedUrl = (url) => {
  if (!url) return "";
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
};


const save = async () =>{
  setLoading(true);
}


  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Venue Profile</h1>
          <p className="text-sm text-gray-500">
            Manage venue information and location
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Pencil size={16} />
          Edit
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-gray-200 shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Venue Name" value={parent.venue_name} />
          <Field label="City" value={parent.venue_city} />

          <Field label="State" value={parent.venue_state} />
          <Field label="Address" value={parent.venue_address} />

          <Field label="Latitude" value={parent.lat} />
          <Field label="Longitude" value={parent.lng} />
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-1">About</p>
          <p className="text-gray-800">{parent.about_venues || 'No about found'}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Video</p>

          
         {getEmbedUrl(parent?.new_youtube) && (
  <iframe
    className="w-full h-56 rounded-xl"
    src={getEmbedUrl(parent?.new_youtube)}
    allowFullScreen
  />
)}
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Video</p>

            <iframe
              className="w-full h-56 rounded-xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="fixed z-50 top-1/2 left-1/2 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-5">Edit Venue</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Venue Name" defaultValue={parent.venue_name} />
                <Input label="City" defaultValue={parent.venue_city} />

                <Input label="State" defaultValue={parent.venue_state} />
                <Input label="Address" defaultValue={parent.venue_address} />

              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-500">About</label>
                <textarea
                  defaultValue={parent.about_venues}
                  className="w-full border rounded-lg p-3 mt-1 text-sm"
                />
              </div>

              <div className="mt-4">
                <Input label="YouTube Video Link" defaultValue={parent.new_youtube} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
 <button
                  onClick={save}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}

                  {loading ? "Saving..." : "Confirm"}
                </button>
                
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function Input({ label, defaultValue }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full border border-gray-200 rounded-lg p-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
