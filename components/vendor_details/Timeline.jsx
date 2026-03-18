"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CalendarCheck, Bookmark } from "lucide-react";

export default function VendorSubscription({
  users,
  refreshVendor,
  toast,
}) {
  const [loading, setLoading] = useState(false);

  const [activePlanId, setActivePlanId] = useState(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  const [selectedMonthly, setSelectedMonthly] = useState(null);
  const [selectedYearly, setSelectedYearly] = useState(null);

  const [selectedBilling, setSelectedBilling] = useState([]);

const plans = [
  { id: 1, name: "Plan 1", price: "₹999 / month", method: 1 },
  { id: 2, name: "Plan 2", price: "₹1499 / month", method: 1, popular: true },
  { id: 3, name: "Plan 3", price: "₹1999 / month", method: 1 },

  { id: 4, name: "Plan 4", price: "₹2999 / year", method: 2 },
  { id: 5, name: "Plan 5", price: "₹3999 / year", method: 2, popular: true },
  { id: 6, name: "Plan 6", price: "₹5999 / year", method: 2 },
];

  const bookingTypes = [
    {
      id: "1",
      name: "Booking",
      icon: CalendarCheck,
      desc: "Direct confirmed booking",
    },
    {
      id: "2",
      name: "Reserve",
      icon: Bookmark,
      desc: "Temporarily hold the venue",
    },
  ];

  useEffect(() => {
    if (users?.active_plan_id) {
      setActivePlanId(users.active_plan_id);
    }

    const billings =
      typeof users?.activated_billings === "string"
        ? JSON.parse(users.activated_billings)
        : users?.activated_billings;

    if (billings) setSelectedBilling(billings);
  }, [users]);

  const hasActivePlan = !!activePlanId;

  const monthlyPlans = plans.filter((p) => p.method === 1);
  const yearlyPlans = plans.filter((p) => p.method === 2);

  const getVisiblePlans = (planList) => {
    if (hasActivePlan && !showAllPlans) {
      return planList.filter((p) => p.id === activePlanId);
    }
    return planList;
  };

  const selectPlan = async (planId) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: users.user_id,
            plan_id: planId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setActivePlanId(planId);
      setShowAllPlans(false);

      refreshVendor && refreshVendor();
      toast?.success("Plan updated successfully");
    } catch (err) {
      toast?.error("Something went wrong");
    }
    setLoading(false);
  };

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
    }
    setLoading(false);
  };

  // reusable card
  const PlanCard = ({
  plan,
  isActive,
  isSelected,
  onSelect,
}) => (
  <motion.div
    onClick={onSelect}
    whileHover={{ y: -3 }}
    className={`relative cursor-pointer rounded-lg border p-3 text-sm transition
    ${
      isActive
        ? "border-green-500 bg-green-50"
        : isSelected
        ? "border-blue-600 bg-blue-50"
        : "border-gray-200 bg-white hover:shadow-sm"
    }`}
  >
    {/* ⭐ MOST POPULAR */}
    {plan.popular && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
        Most Popular
      </div>
    )}

    {/* RADIO */}
    <div className="absolute top-2 right-2">
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center
        ${
          isSelected
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300"
        }`}
      >
        {isSelected && (
          <Check size={10} className="text-white" />
        )}
      </div>
    </div>

    {/* ACTIVE */}
    {isActive && (
      <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">
        Active
      </span>
    )}

    <h3 className="font-medium mt-2">{plan.name}</h3>

    <p className="text-gray-500 text-xs mt-1">
      {plan.price}
    </p>

    {/* BUTTON */}
    {!isActive && isSelected && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          selectPlan(plan.id);
        }}
        className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-md text-xs hover:bg-blue-700"
      >
        {hasActivePlan ? "Switch" : "Choose"}
      </button>
    )}
  </motion.div>
);


  return (
    <div className="space-y-10">
      {/* ================= PLANS ================= */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Subscription Plans
          </h2>

          {hasActivePlan && !showAllPlans && (
            <button
              onClick={() => setShowAllPlans(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Change Plan
            </button>
          )}
        </div>

        {/* MONTHLY */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            Monthly Plans
          </h4>

          <div className="grid md:grid-cols-3 gap-4">
            {getVisiblePlans(monthlyPlans).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={plan.id === activePlanId}
                isSelected={selectedMonthly === plan.id}
                onSelect={() => setSelectedMonthly(plan.id)}
              />
            ))}
          </div>
        </div>

        {/* YEARLY */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            Yearly Plans (Save more 🎉)
          </h4>

          <div className="grid md:grid-cols-3 gap-4">
            {getVisiblePlans(yearlyPlans).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={plan.id === activePlanId}
                isSelected={selectedYearly === plan.id}
                onSelect={() => setSelectedYearly(plan.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOOKING ================= */}
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
                    <p className="font-medium">
                      {item.name}
                    </p>
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
