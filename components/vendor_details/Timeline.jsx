"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CalendarCheck, Bookmark, Loader2 } from "lucide-react";

export default function VendorSubscription({ users, refreshVendor, toast }) {
  const [loading, setLoading] = useState(false);
  const [selectedMonthly, setSelectedMonthly] = useState(null);
  const [selectedYearly, setSelectedYearly] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planselected, setPlanselected] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  const loadCalled = useRef(false);

  const bookingTypes = [
    { id: "1", name: "Booking", icon: CalendarCheck, desc: "Direct confirmed booking" },
    { id: "2", name: "Reserve", icon: Bookmark, desc: "Temporarily hold the venue" },
  ];

  useEffect(() => {
    if (!users || loadCalled.current) return;
    loadCalled.current = true;

    const billings =
      typeof users?.activated_billings === "string"
        ? JSON.parse(users.activated_billings)
        : users?.activated_billings;

    if (billings) setSelectedBilling(billings);

    if (users?.plans) {
      const plansArr =
        typeof users.plans === "string"
          ? JSON.parse(users.plans)
          : users.plans;

      setSelectedMonthly(plansArr[0] || null);
      setSelectedYearly(plansArr[1] || null);
    }

    loadPlans(users.user_id);
  }, [users]);

  const loadPlans = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch("https://websockettest.venuebook.in:5000/admin/load_plans_setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      setPlans(data.plans_suggested || []);
      setPlanselected(data.plan_activated || []);
    } catch {
      toast?.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = async () => {
    if (!selectedMonthly || !selectedYearly) {
      toast?.error("Select both plans");
      return;
    }

    setLoading(true);
    try {
      await fetch("https://websockettest.venuebook.in:5000/admin/update_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: users.user_id,
          plans: [selectedMonthly, selectedYearly],
        }),
      });

      toast?.success("Plan updated successfully");
      refreshVendor && refreshVendor();
    } catch {
      toast?.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  const saveBilling = async () => {
    setLoading(true);
    try {
      await fetch("https://websockettest.venuebook.in:5000/admin/update_billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: users.user_id,
          selected: selectedBilling,
        }),
      });

      toast?.success("Booking settings saved");
    } catch {
      toast?.error("Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  const toggleBilling = (id) => {
    setSelectedBilling((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ MAIN FIX: API CONNECTED
  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (confirmType === "cancel") {
        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/cancel_subscription",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: users.user_id }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        toast?.success("Subscription cancelled successfully");

        setPlanselected([]);
        setSelectedMonthly(null);
        setSelectedYearly(null);

        refreshVendor && refreshVendor();
      }

      if (confirmType === "clear") {
        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/clear_booking",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: users.user_id }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setSelectedBilling([]);
        toast?.success("Booking data cleared successfully");
      }
    } catch (err) {
      toast?.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const monthlyPlans = plans.filter((p) => Number(p.plan_title) === 1);
  const yearlyPlans = plans.filter((p) => Number(p.plan_title) === 2);

  const PlanCard = ({ plan, selected, onClick }) => (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-lg border cursor-pointer transition
      ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{plan.plan_name}</p>
          <p className="text-sm text-gray-500">₹{plan.amounts}</p>
        </div>
        {selected && <Check className="text-blue-600" />}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* SUBSCRIPTION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>

        {planselected.length === 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">

              <div className="space-y-3 max-h-[180px] overflow-y-auto">
                <p className="text-xs text-gray-500">MONTHLY</p>
                {monthlyPlans.map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selectedMonthly === p.id}
                    onClick={() => setSelectedMonthly(p.id)}
                  />
                ))}
              </div>

              <div className="space-y-3 max-h-[180px] overflow-y-auto">
                <p className="text-xs text-gray-500">YEARLY</p>
                {yearlyPlans.map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selectedYearly === p.id}
                    onClick={() => setSelectedYearly(p.id)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={selectPlan}
              disabled={loading}
              className="cursor-pointer mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Saving..." : "Save Plan"}
            </button>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200  rounded-lg p-4">
            <p className="font-semibold text-gray-800">
              {planselected[0].subscription_code}
            </p>
            <p className="text-sm text-gray-500">
              Valid till {planselected[0].end_date}
            </p>

            <button
              onClick={() => {
                setConfirmType("cancel");
                setShowModal(true);
              }}
              className="cursor-pointer mt-4 w-full border border-red-500 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* BOOKING */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Booking Settings</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {bookingTypes.map((item) => {
            const Icon = item.icon;
            const active = selectedBilling.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleBilling(item.id)}
                className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer
                ${active ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              >
                <Icon size={18} />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                {active && <Check className="ml-auto text-blue-600" />}
              </div>
            );
          })}
        </div>

        <button
          onClick={saveBilling}
          className="cursor-pointer mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Save Settings
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          This action cannot be undone
        </p>

        <button
          onClick={() => {
            setConfirmType("clear");
            setShowModal(true);
          }}
          className="cursor-pointer bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Reset Booking Data
        </button>
      </div>

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
              className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-2">
                {confirmType === "cancel"
                  ? "Cancel Subscription"
                  : "Reset Booking"}
              </h3>

              <p className="text-sm text-gray-500 mb-5">
                {confirmType === "cancel"
                  ? "You will lose access to your subscription benefits."
                  : "All booking data will be removed permanently."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer flex-1 bg-gray-100 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  className="cursor-pointer flex-1 bg-red-600 text-white py-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}