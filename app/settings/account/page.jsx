"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useDataStore from "@/store/useDataStore";

export default function AccountDetails() {

  const storeData = useDataStore((state) => state.data);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    id: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (field, value) => {

    let error = "";

    if (field === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.length < 3) error = "Minimum 3 characters required";
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email required";
      else if (!emailRegex.test(value)) error = "Invalid email";
    }

    if (field === "mobile") {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!value) error = "Phone required";
      else if (!phoneRegex.test(value)) error = "Invalid phone number";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    const newValue =
      name === "mobile" ? value.replace(/\D/g, "") : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validate(name, newValue);
  };

  const handleSave = async () => {

    if (Object.values(errors).some((e) => e)) {
      toast.error("Please fix validation errors");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Account updated successfully");

      setOpen(false);

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (!storeData?.id) return;

    fetchData();

  }, [storeData?.id]);

  const fetchData = async () => {

    try {

      setFetchLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/account_details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: storeData.id }),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      if (result?.vendor) {

        setForm({
          name: result.vendor.name || "",
          email: result.vendor.email || "",
          mobile: result.vendor.mobile || "",
          id: result.vendor.id || "",
        });

      }

    } catch (err) {

      toast.error("Failed to load account details");

    } finally {

      setFetchLoading(false);

    }
  };

  return (
    <div>

      <h2 className="text-lg font-semibold mb-4">Your Account Details</h2>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">

        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Owner's Account Details
          </h3>

          <button
            onClick={() => setOpen(true)}
            className="text-sm bg-black text-white px-4 py-1 rounded"
          >
            Edit
          </button>
        </div>

        {fetchLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
            <div className="h-4 bg-gray-200 rounded w-56"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">

            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{form.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{form.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium">{form.mobile}</p>
            </div>

          </div>
        )}

      </div>

      {/* Modal */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >

            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 w-96 space-y-4 rounded-xl shadow-lg"
            >

              <h3 className="text-lg font-semibold">Edit Account</h3>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border border-gray-200 p-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-200 p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}

              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="Phone"
                className="w-full border border-gray-200 p-2 rounded"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs">{errors.mobile}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
                >

                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}

                  Save

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}