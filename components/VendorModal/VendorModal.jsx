"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Layers,
  CreditCard,
  CheckCircle,
} from "lucide-react";

import VendorStep from "./VendorStep";
import ParentVenueStep from "./ParentVenueStep";
import ChildVenueStep from "./ChildVenueStep";
import BillingStep from "./BillingStep";
import SummaryStep from "./SummaryStep";

export default function VendorModal({ open, onClose }) {
  const stepOrder = ["vendor", "parent", "child", "billing", "summary"];
  const [activeStep, setActiveStep] = useState("vendor");

  /* =========================
        STEP REFS
  ========================== */

  const vendorRef = useRef();
  const parentRef = useRef();
  const childRef = useRef();
  const billingRef = useRef();

  /* =========================
        FORM STATES
  ========================== */

  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
    state: "",
    first: "",
    last: "",
    designation: "",
  });

  const [venue, setVenue] = useState({
    name: "",
    city: "",
    address: "",
    lat: "",
    lng: "",
    place_id: "",
  });

  const [plan, setPlan] = useState("");
  const [billingSummary, setBillingSummary] = useState({});

  const [loading, setLoading] = useState(false);

  const [childVenues, setChildVenues] = useState([
    {
      name: "",
      category: "",
      pricingType: "",
      shifts: {
        morning: { enabled: false, fromDate: "", endDate: "", amount: "" },
        afternoon: { enabled: false, fromDate: "", endDate: "", amount: "" },
        evening: { enabled: false, fromDate: "", endDate: "", amount: "" },
      },
      errors: {},
    },
  ]);

  /* =========================
        SIMPLE VALIDATIONS
  ========================== */

  const isVendorValid =
    form.company &&
    form.email &&
    form.phone &&
    form.state &&
    form.first &&
    form.last &&
    form.designation;

  const isParentValid =
    venue.name && venue.city && venue.address && venue.lat && venue.lng;

  const isChildValid =
    childVenues.length > 0 && childVenues.every((v) => v.name && v.category);

  const isBillingValid = plan !== "";

  /* =========================
        STEP CONFIG
  ========================== */

  const steps = [
    { id: "vendor", label: "Vendor Details", icon: Building2 },
    { id: "parent", label: "Parent Venue", icon: MapPin },
    { id: "child", label: "Child Venue", icon: Layers },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "summary", label: "Summary", icon: CheckCircle },
  ];

  /* =========================
        NAVIGATION
  ========================== */

  const goNext = async () => {
    if (loading) return;

    let valid = true;

    /* STEP VALIDATIONS */

    if (activeStep === "vendor") {
      valid = vendorRef.current?.validate?.() ?? isVendorValid;
    }

    if (activeStep === "parent") {
      valid = parentRef.current?.validate?.() ?? isParentValid;
    }

    if (activeStep === "child") {
      valid = childRef.current?.validate?.() ?? isChildValid;
    }

    if (activeStep === "billing") {
      valid = billingRef.current?.validate?.() ?? isBillingValid;
    }

    if (!valid) {
      document
        .querySelector(".text-red-500")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    /* SUBMIT API */

    if (activeStep === "summary") {
      try {
        setLoading(true);

        const res = await fetch("https://websockettest.venuebook.in:5000/admin/create_new_vendors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            form,
            venue,
            childVenues,
            plan,
            billingSummary,
          }),
        });

        const data = await res.json();

        if (data.success) {
          alert("Saved successfully");
          onClose();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

      return;
    }

    const index = stepOrder.indexOf(activeStep);

    if (index < stepOrder.length - 1) {
      setActiveStep(stepOrder[index + 1]);
    }
  };

  const goBack = () => {
    const index = stepOrder.indexOf(activeStep);

    if (index > 0) {
      setActiveStep(stepOrder[index - 1]);
    }
  };

  if (!open) return null;

  /* =========================
        UI
  ========================== */

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[1100px] rounded-xl shadow-xl flex overflow-hidden"
      >

        {/* SIDEBAR */}

        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">

          <h2 className="font-semibold mb-6">Vendor Registration</h2>

          <div className="space-y-2">

            {steps.map((step) => {
              const Icon = step.icon;

              const isLocked =
                (step.id === "parent" && !isVendorValid) ||
                (step.id === "child" && !isParentValid) ||
                (step.id === "billing" && !isChildValid) ||
                (step.id === "summary" && !isBillingValid);

              return (
                <button
                  key={step.id}
                  disabled={isLocked}
                  onClick={() => !isLocked && setActiveStep(step.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg

                  ${
                    activeStep === step.id
                      ? "bg-blue-600 text-white"
                      : isLocked
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon size={18} />
                  {step.label}
                </button>
              );
            })}

          </div>
        </div>

        {/* CONTENT */}

        <div className="flex flex-col flex-1 h-[650px]">

          {/* PROGRESS BAR */}

          <div className="h-1 bg-gray-200">

            <div
              className="h-1 bg-blue-600 transition-all"
              style={{
                width: `${
                  ((stepOrder.indexOf(activeStep) + 1) / stepOrder.length) * 100
                }%`,
              }}
            />

          </div>

          {/* STEP CONTENT */}

          <div className="flex-1 overflow-y-auto p-8">

            {activeStep === "vendor" && (
              <VendorStep
                ref={vendorRef}
                form={form}
                setForm={setForm}
              />
            )}

            {activeStep === "parent" && (
              <ParentVenueStep
                ref={parentRef}
                venue={venue}
                setVenue={setVenue}
              />
            )}

            {activeStep === "child" && (
              <ChildVenueStep
                ref={childRef}
                childVenues={childVenues}
                setChildVenues={setChildVenues}
              />
            )}

            {activeStep === "billing" && (
              <BillingStep
                ref={billingRef}
                plan={plan}
                childVenues={childVenues}
                setPlan={setPlan}
                 setBillingSummary={setBillingSummary}
              />
            )}

            {activeStep === "summary" && (
              <SummaryStep
                form={form}
                venue={venue}
                childVenues={childVenues}
                plan={plan}
                 billing={billingSummary}
              />
            )}

          </div>

          {/* FOOTER */}

          <div className="border-t border-gray-200 px-8 py-4 flex justify-between">

            <button
              onClick={onClose}
              className="bg-gray-200 px-5 py-2 rounded"
            >
              Cancel
            </button>

            <div className="flex gap-3">

              {activeStep !== "vendor" && (
                <button
                  onClick={goBack}
                  className="bg-gray-500 text-white px-5 py-2 rounded"
                >
                  Back
                </button>
              )}

              <button
                onClick={goNext}
                disabled={loading}
                className="px-5 py-2 rounded text-white flex items-center gap-2 bg-blue-600"
              >

                {activeStep === "summary" && loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}

                {activeStep === "summary"
                  ? loading
                    ? "Submitting..."
                    : "Submit"
                  : "Next"}

              </button>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
