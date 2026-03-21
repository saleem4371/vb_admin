"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Pencil, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function VendorDetails({ users, refreshVendor }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [vendor, setVendor] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
  });

  const [form, setForm] = useState(vendor);
  const [errors, setErrors] = useState({});

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const validate = (name, value) => {
    let error = "";

    if (name === "name" && value.length < 3) {
      error = "Enter valid name";
    }

    if (name === "phone" && !/^[6-9]\d{9}$/.test(value)) {
      error = "Invalid phone number";
    }

    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Invalid email";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const verifySave = () => {
    setConfirm(true);
  };

  const save = async () => {
    setLoading(true);

    try {
      const param = {
        user_id: users.user_id,
        form,
      };

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_vendor_detail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setVendor(form);
refreshVendor();
      toast.success("Vendor details updated successfully");

      setConfirm(false);
      setOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }

    setLoading(false);
  };

  // 🔥 Normalize API data (null -> "")
  useEffect(() => {
    if (users) {
      const safeData = {
        name: users?.name || "",
        address: users?.address || "",
        city: users?.city || "",
        state: users?.state || "",
        country: users?.country || "",
        phone: users?.phone || "",
        email: users?.email || "",
      };

      setVendor(safeData);
      setForm(safeData);
    }
  }, [users]);

  return (
    <>
      {/* CARD */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm mb-2"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="font-semibold">Vendor Details</h3>

          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer flex items-center gap-1 text-blue-600 text-sm"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-4 text-sm">
          <Info label="Name" value={vendor.name} />

          <Info label="Phone" value={vendor.phone} copy={copy} />

          <Info label="Email" value={vendor.email} copy={copy} />

          <Info label="City" value={vendor.city} />

          <Info label="State" value={vendor.state} />

          <Info label="Country" value={vendor.country} />

          <div className="md:col-span-2">
            <p className="text-gray-500">Address</p>
            <p>{vendor.address}</p>
          </div>
        </div>
      </motion.div>

      {/* EDIT MODAL */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg p-6 rounded-xl"
            >
              <h3 className="font-semibold mb-4">Edit Vendor</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />

                <Field
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <Field
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />

                <Field
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                />

                <Field
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />

                <div className="col-span-2">
                  <label className="text-gray-600">Address</label>

                  <textarea
                    name="address"
                    value={form.address || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={verifySave}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM SAVE MODAL */}

      <AnimatePresence>
        {confirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm text-center"
            >
              <CheckCircle className="mx-auto text-blue-600 mb-3" size={32} />

              <h3 className="font-semibold text-lg">Confirm Update</h3>

              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to update vendor details?
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setConfirm(false)}
                  className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}

                  {loading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Info({ label, value, copy }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>

      <div className="flex items-center gap-2">
        {value}

        {copy && (
          <Copy
            size={14}
            className="cursor-pointer text-gray-400 hover:text-black"
            onClick={() => copy(value)}
          />
        )}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="text-gray-600">{label}</label>

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`w-full border border-gray-200 rounded-lg p-2 mt-1 ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
