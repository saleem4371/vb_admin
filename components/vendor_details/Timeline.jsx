
"use client";

import { useState, useEffect, useRef } from "react";
import { motion , AnimatePresence} from "framer-motion";
import { Check, CalendarCheck, Bookmark ,CheckCircle, XCircle  } from "lucide-react";

export default function VendorSubscription({ users, refreshVendor, toast }) {
  const [loading, setLoading] = useState(false);
  const [selectedMonthly, setSelectedMonthly] = useState(null);
  const [selectedYearly, setSelectedYearly] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planselected, setPlanselected] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const loadCalled = useRef(false);

  const bookingTypes = [
    { id: "1", name: "Booking", icon: CalendarCheck, desc: "Direct confirmed booking" },
    { id: "2", name: "Reserve", icon: Bookmark, desc: "Temporarily hold the venue" },
  ];
// ====================Subscribed Plan =================//
 const plan = {
    name: "Standard Plan",
    price: "₹704",
    validTill: "31 Dec 2026",
  };

  const handleCancel = async () => {
    setLoading(true);

    // 🔥 Call API here
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      alert("Subscription Cancelled");
    }, 1500);
  };

  // ================= LOAD ONCE =================
  useEffect(() => {
    if (!users || loadCalled.current) return;

    loadCalled.current = true;

    // billing
    const billings =
      typeof users?.activated_billings === "string"
        ? JSON.parse(users.activated_billings)
        : users?.activated_billings;

    if (billings) setSelectedBilling(billings);

    // existing plans (if stored like [1,2])
    if (users?.plans) {
      const plansArr =
        typeof users.plans === "string"
          ? JSON.parse(users.plans)
          : users.plans;

      setSelectedMonthly(plansArr[0] || null);
      setSelectedYearly(plansArr[1] || null);
    }

    load_plans_setting(users.user_id);
  }, [users]);

  // ================= LOAD PLANS =================
  const load_plans_setting = async (userId) => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/load_plans_setting",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setPlans(data.plans_suggested || []);
      setPlanselected(data.plan_activated || []);
    } catch (err) {
      console.error(err);
      toast?.error("Failed to load plan settings");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAVE PLANS =================
  const selectPlan = async () => {
    if (!selectedMonthly || !selectedYearly) {
      toast?.error("Select both monthly & yearly plans");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: users.user_id,
            plans: [selectedMonthly, selectedYearly], // ✅ ARRAY
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast?.success("Plans updated successfully");
      refreshVendor && refreshVendor();
    } catch {
      toast?.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= BILLING =================
  const toggleBilling = (id) => {
    setSelectedBilling((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const saveBilling = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_billing",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: users.user_id,
            selected: selectedBilling,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast?.success("Booking settings saved");
      refreshVendor && refreshVendor();
    } catch {
      toast?.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const monthlyPlans = plans.filter((p) => Number(p.plan_title) === 1);
  const yearlyPlans = plans.filter((p) => Number(p.plan_title) === 2);

  // ================= CARD =================
  const PlanCard = ({ plan, isSelected, onSelect }) => (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -3 }}
      className={`relative cursor-pointer rounded-lg border p-3 text-sm transition
      ${
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white hover:shadow-sm"
      }`}
    >
      {plan.recomended == 1 && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
          Most Popular
        </div>
      )}

      <div className="absolute top-2 right-2">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center
          ${
            isSelected
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300"
          }`}
        >
          {isSelected && <Check size={10} className="text-white" />}
        </div>
      </div>

      <h3 className="font-medium mt-2">{plan.plan_name}</h3>
      <p className="text-gray-500 text-xs mt-1">₹{plan.amounts}</p>
    </motion.div>
  );

  // ================= UI =================
  return (
    <div className="space-y-10">
      {/* PLANS */}
      <div>
        {planselected.length <= 0 && (
           <>
        <h2 className="text-xl font-semibold mb-4">
          Subscription Plans
        </h2>

 
    <p className="text-xs text-gray-500 mb-4">
      Select one monthly and one yearly plan
    </p>

    {/* MONTHLY */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">
        Monthly Plans
      </h4>

      <div className="grid md:grid-cols-3 gap-4">
        {monthlyPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedMonthly === plan.id}
            onSelect={() => setSelectedMonthly(plan.id)}
          />
        ))}
      </div>
    </div>

    {/* YEARLY */}
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">
        Yearly Plans
      </h4>

      <div className="grid md:grid-cols-3 gap-4">
        {yearlyPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedYearly === plan.id}
            onSelect={() => setSelectedYearly(plan.id)}
          />
        ))}
      </div>
    </div>

    {/* BUTTON */}
    <button
      disabled={!selectedMonthly || !selectedYearly || loading}
      onClick={selectPlan}
      className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
    >
      Save Plans
    </button>
  </>
)}
 {/* BUTTON */}
{planselected.length > 0 && (
<div>
  <div className="">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className=" border border-gray-200 shadow-lg p-6 bg-white "
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4  border-b border-gray-200">
          <CheckCircle className="text-green-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Subscribed Plan
          </h2>
        </div>

        {/* Plan Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{planselected[0].subscription_code}</h3>
          <p className="text-gray-500">{planselected[0].end_date}</p>
          <p className="text-sm text-gray-400">
            Valid till: <span className="font-medium">{planselected[0].end_date}</span>
          </p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-red-500 text-white cursor-pointer hover:bg-red-400 transition py-2.5 rounded-lg font-medium"
        >
          Cancel Subscription
        </button>
      </motion.div>

      {/* 🔥 Confirm Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="text-red-500" />
                <h3 className="font-semibold text-gray-800">
                  Confirm Cancellation
                </h3>
              </div>

              <p className="text-gray-500 text-sm mb-5">
                Are you sure you want to cancel your subscription? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50"
                >
                  Keep Plan
                </button>

                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  {loading ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
)}
      </div>

      {/* BOOKING */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Booking Settings
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {bookingTypes.map((item) => {
            const Icon = item.icon;
            const active = selectedBilling.includes(item.id);

            return (
              <motion.div
                key={item.id}
                onClick={() => toggleBilling(item.id)}
                whileTap={{ scale: 0.97 }}
                className={`cursor-pointer rounded-xl border p-4 transition
                ${
                  active
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`p-2 rounded-md
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.desc}
                    </p>
                  </div>

                  {active && (
                    <Check className="ml-auto text-blue-600" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={saveBilling}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Save Booking Settings
        </button>
      </div>
    </div>
  );
}
