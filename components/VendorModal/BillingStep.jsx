"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BillingStep({
 
  plan,
  setPlan,
  childVenues = [],
  isAdmin = false,
  setBillingSummary
}) {
const plans = [
  {
    id: 1,
    name: "Monthly",
    price: 160,
    billing_cycle: "Monthly",
    discount: 0,
    visible_to_customer: true,
  },
  {
    id: 2,
    name: "Annual",
    price: 1240,
    billing_cycle: "Yearly",
    discount: 35,
    visible_to_customer: true,
  },
  {
    id: 3,
    name: "Pro",
    price: 320,
    billing_cycle: "Monthly",
    discount: 10,
    visible_to_customer: false,
  },
  {
    id: 4,
    name: "Enterprise",
    price: 999,
    billing_cycle: "Monthly",
    discount: 20,
    visible_to_customer: false,
  }
];

  // Admin sees all plans, customer sees only visible ones
 
useEffect(() => {

  setBillingSummary({
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    planPrice: planPrice,
    venueCount: venueCount,
    subtotal: subtotal,
    discount: discount,
    gst: gst,
    total: totalPayable
  });

}, [plan, childVenues]);

  const selectedPlan =
    plans.find((p) => p.id === plan) || {};

  const venueCount = childVenues?.length || 0;

  const planPrice = Number(selectedPlan.price || 0);

  const subtotal = venueCount * planPrice;

  const discount =
    subtotal * (Number(selectedPlan.discount || 0) / 100);

  const discountedTotal = subtotal - discount;

  const gst = discountedTotal * 0.18;

  const totalPayable = discountedTotal + gst;

  return (
    <div className="space-y-8">

      {/* TITLE */}

      <div>
        <h3 className="text-2xl font-semibold">
          Billing Plan
        </h3>

        <p className="text-gray-500 text-sm">
          Choose your subscription plan
        </p>
      </div>

      {/* PLAN CARDS */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {plans.map((p) => {

          const active = plan === p.id;

          return (

            <motion.div
              key={p.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => setPlan(p.id)}
              className={`cursor-pointer border rounded-xl p-6 transition
              ${
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >

              <h4 className="text-lg font-semibold">
                {p.name}
              </h4>

              <p className="text-3xl font-bold mt-2">
                ₹{p.price}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {p.billing_cycle}
              </p>

              {p.discount > 0 && (
                <p className="text-green-600 text-sm mt-2">
                  {p.discount}% Discount
                </p>
              )}

            </motion.div>

          );

        })}

      </div>

      {/* BILLING SUMMARY */}

      <motion.div
        layout
        className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-full"
      >

        <h4 className="text-lg font-semibold mb-4">
          Billing Summary
        </h4>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Child Venues
            </span>
            <span>{venueCount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Plan Price
            </span>
            <span>₹{planPrice}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">
              GST (18%)
            </span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold text-lg">
            <span>Total Payable</span>
            <span>₹{totalPayable.toFixed(2)}</span>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
