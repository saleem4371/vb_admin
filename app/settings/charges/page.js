"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    convenienceFee: 0,
    subscriptionAmount: 0,
    bookingPercentage: 0,
    anualDiscount: 0,
  });

  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState(settings);
  const [activeField, setActiveField] = useState(null);
  const [FetchLoading, setFetchLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const openEdit = (field) => {
    setActiveField(field);
    setForm(settings);
    setEditOpen(true);
  };

  const validate = () => {
    const err = {};

    if (activeField === "convenienceFee" && !form.convenienceFee)
      err.convenienceFee = "Required";

    if (activeField === "subscriptionAmount" && !form.subscriptionAmount)
      err.subscriptionAmount = "Required";

    if (activeField === "anualDiscount" && !form.anualDiscount)
      err.anualDiscount = "Required";

    if (activeField === "bookingPercentage") {
      if (!form.bookingPercentage) err.bookingPercentage = "Required";
      else if (form.bookingPercentage > 100)
        err.bookingPercentage = "Cannot exceed 100%";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const openConfirm = () => {
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/saveSettings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Settings updated");
      fetchData();
      setEditOpen(false);
      setConfirmOpen(false);

      //   await new Promise((r) => setTimeout(r, 800));

      //   setSettings(form);

      //   const fieldName = activeField
      //     .replace("Fee", " Fee")
      //     .replace("Amount", " Amount")
      //     .replace("Percentage", " Commission");

      //   setLogs((prev) => [
      //     {
      //       text: `${fieldName} updated`,
      //       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      //     },
      //     ...prev,
      //   ]);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetchLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/charges_details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: 1 }),
        },
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      const charges = result?.charges ?? {};

      setSettings({
        convenienceFee: Number(charges.convenience_fee) || 0,
        subscriptionAmount: Number(charges.subscription_amount) || 0,
        bookingPercentage: Number(charges.booking_percentage) || 0,
        anualDiscount: Number(charges.anualDiscount) || 0,
      });
      setLogs([...result.platform_settings_logs]);
      //platform_settings_logs
      console.log(charges.platform_settings_logs);
    } catch (err) {
      toast.error("Failed to load account details");
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="p-2">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-semibold mb-2">Platform Settings</h1>

      <div className="grid grid-cols-3 gap-3">
        {/* LEFT SETTINGS */}

        <div className="col-span-2 space-y-6">
          <SettingCard
            title="Convenience Fee"
            value={`₹${settings.convenienceFee}`}
            onEdit={() => openEdit("convenienceFee")}
            desc="Fixed fee charged to customers for using the platform services."
          />

          <SettingCard
            title="Monthly Subscription Amount"
            value={`₹${settings.subscriptionAmount}`}
            onEdit={() => openEdit("subscriptionAmount")}
            desc="Monthly fee vendors must pay to list and manage their venues."
          />
          <SettingCard
            title="Subscription Annual Discount (%)"
            value={`${settings.anualDiscount}%`}
            onEdit={() => openEdit("anualDiscount")}
            desc="Percentage discount applied when vendors choose the annual subscription plan instead of monthly billing."
          />

          <SettingCard
            title="Booking Commission"
            value={`${settings.bookingPercentage}%`}
            onEdit={() => openEdit("bookingPercentage")}
            desc="Platform commission deducted from every successful booking."
          />
        </div>

        {/* RIGHT LOGS */}

        <div className="bg-white border border-gray-200 p-5 h-[400px] flex flex-col rounded-lg">
          <h2 className="font-semibold mb-4">Settings Logs</h2>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {logs?.map((log, i) => (
              <div key={i} className="border-b border-gray-200 pb-2 text-sm">
                <p className="font-medium text-gray-800">{log.setting_name}</p>

                <p className="text-gray-500 text-xs">{log.created_at}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}

      {editOpen && (
        <Modal>
          <h2 className="font-semibold mb-2">Edit Setting</h2>

          {activeField === "convenienceFee" && (
            <Input
              label="Convenience Fee"
              value={form.convenienceFee}
              error={errors.convenienceFee}
              onChange={(v) => setForm({ ...form, convenienceFee: v })}
            />
          )}

          {activeField === "subscriptionAmount" && (
            <Input
              label="Subscription Amount"
              value={form.subscriptionAmount}
              error={errors.subscriptionAmount}
              onChange={(v) => setForm({ ...form, subscriptionAmount: v })}
            />
          )}

          {activeField === "bookingPercentage" && (
            <Input
              label="Booking Commission (%)"
              value={form.bookingPercentage}
              error={errors.bookingPercentage}
              onChange={(v) => setForm({ ...form, bookingPercentage: v })}
            />
          )}
          {activeField === "anualDiscount" && (
            <Input
              label="Anual Percenatge (%)"
              value={form.anualDiscount}
              error={errors.anualDiscount}
              onChange={(v) => setForm({ ...form, anualDiscount: v })}
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setEditOpen(false)}
              className="border px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={openConfirm}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* CONFIRM MODAL */}

      {confirmOpen && (
        <Modal>
          <h3 className="font-semibold mb-2">Confirm Update</h3>

          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to update this setting?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="border px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={saveSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SettingCard({ title, value, onEdit, desc }) {
  return (
    <div className="bg-white border border-gray-200  p-3 flex justify-between items-center mb-2">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm">{desc}</p>
      </div>

      <button
        onClick={onEdit}
        className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm cursor-pointer"
      >
        Edit
      </button>
    </div>
  );
}

function Input({ label, value, error, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200  p-2 rounded-lg mt-1"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function Modal({ children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">{children}</div>
    </div>
  );
}
