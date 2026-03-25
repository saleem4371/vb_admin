"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettlementHeader({ id, users, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    if (!users?.user_id) {
      toast?.error("Invalid vendor");
      return;
    }

    try {
      setLoading(true);

      await toast.promise(
        fetch(
          "https://websockettest.venuebook.in:5000/admin/delete_vendor",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: users.user_id }),
          }
        ).then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.message || "Delete failed");
          }
          return data;
        }),
        {
          loading: "Deleting vendor...",
          success: "Vendor deleted successfully",
          error: (err) => err.message || "Something went wrong",
        }
      );

      setShowModal(false);

      // small delay for smooth UX
      setTimeout(() => {
        router.push("/vendors");
      }, 500);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white mb-2 px-6 py-5 flex items-center justify-between shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="text-green-600" size={26} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">{id}</h2>
            <p className="text-sm text-gray-500">
              Created by {users?.createdby} • DOJ {users?.created_at}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Vendor
              </h3>

              <p className="text-sm text-gray-500 mb-5">
                This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  disabled={loading}
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="cursor-pointer flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}