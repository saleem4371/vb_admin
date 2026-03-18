"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CreditCard, CheckCircle } from "lucide-react";
import GooglePlaceInput from "@/components/GooglePlaceInput";

export default function VendorModal({ open, onClose }) {
  const [activeStep, setActiveStep] = useState("vendor");

  const stepOrder = ["vendor", "parent", "child", "billing", "summary"];

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
    rating: "",
    user_ratings_total: "",
    reviews: "",
  });

  

  const [plan, setPlan] = useState("");

//   const [childVenues, setChildVenues] = useState([
//     { name: "", category: "", pricingType: "" },
//   ]);

  const states = [
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Maharashtra",
    "Telangana",
    "Andhra Pradesh",
  ];

  const designations = [
    "Owner",
    "Manager",
    "Sales Manager",
    "Director",
    "Admin",
  ];

  const steps = [
    { id: "vendor", label: "Vendor Details", icon: Building2 },
    { id: "parent", label: "Parent Venue", icon: CreditCard },
    { id: "child", label: "Child Venue", icon: CreditCard },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "summary", label: "Summary", icon: CheckCircle },
  ];

  /* ---------------- validation ---------------- */

  const emailValid =
    form.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const phoneValid = form.phone === "" || /^[0-9]{10}$/.test(form.phone);

  const isVendorValid =
    form.company &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    /^[0-9]{10}$/.test(form.phone) &&
    form.state &&
    form.first &&
    form.last &&
    form.designation;

  /* ---------------- handlers ---------------- */

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleVenue = (key, value) => {
    setVenue((prev) => ({ ...prev, [key]: value }));
  };

//   const addChildVenue = () => {
//     setChildVenues([
//       ...childVenues,
//       { name: "", category: "", pricingType: "" },
//     ]);
//   };

//   const updateChild = (index, key, value) => {
//     const copy = [...childVenues];
//     copy[index][key] = value;
//     setChildVenues(copy);
//   };

  /* ---------------- step navigation ---------------- */

  const goNext = () => {
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

   const [childVenues, setChildVenues] = useState([
    {
      name: "",
      category: "",
      pricingType: "",
      slots: {
        morning: false,
        afternoon: false,
        evening: false,
      },
       shifts: {
        morning: { enabled: false, fromDate: "", endDate: "", amount: "" },
        afternoon: { enabled: false, fromDate: "", endDate: "", amount: "" },
        evening: { enabled: false, fromDate: "", endDate: "", amount: "" }
      },
      errors: {}
    }
  ]);

  const updateChild = (index, field, value) => {
    const updated = [...childVenues];
    updated[index][field] = value;

    // Live amount validation
    if (field === "amount") {
      if (!value || isNaN(value)) {
        updated[index].errors.amount = "Enter valid amount";
      } else {
        updated[index].errors.amount = "";
      }
    }

    setChildVenues(updated);
  };

  const updateSlot = (index, slot) => {
    const updated = [...childVenues];
    updated[index].slots[slot] = !updated[index].slots[slot];
    setChildVenues(updated);
  };

  const handleDateChange = (index, date) => {
    const updated = [...childVenues];
    updated[index].fromDate = date;

    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 19); // 1.6 years ≈ 19 months
      updated[index].endDate = end.toISOString().split("T")[0];
    }

    setChildVenues(updated);
  };

  const addChildVenue = () => {
    setChildVenues([
      ...childVenues,
      {
        name: "",
        category: "",
        pricingType: "",
        slots: { morning: false, afternoon: false, evening: false },
        fromDate: "",
        endDate: "",
        amount: "",
        errors: {}
      }
    ]);
  };

  const today = new Date().toISOString().split("T")[0];


  const updateShift = (index, shift, field, value) => {
    const updated = [...childVenues];

    updated[index].shifts[shift][field] = value;

    // auto end date
    if (field === "fromDate" && value) {
      const start = new Date(value);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 19);

      updated[index].shifts[shift].endDate =
        end.toISOString().split("T")[0];
    }

    // amount validation
    if (field === "amount") {
      if (!value || isNaN(value) || value <= 0) {
        updated[index].errors[shift + "_amount"] =
          "Enter valid amount";
      } else {
        updated[index].errors[shift + "_amount"] = "";
      }
    }

    setChildVenues(updated);
  };

  const toggleShift = (index, shift) => {
    const updated = [...childVenues];
    updated[index].shifts[shift].enabled =
      !updated[index].shifts[shift].enabled;
    setChildVenues(updated);
  };

  /* ================================================= */

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[1100px] rounded-xl shadow-xl flex overflow-hidden"
      >
        {/* SIDEBAR */}

        <div className="w-64 bg-gray-50 border-r  border-gray-200 p-6">
          <h2 className="font-semibold mb-6">Vendor Registration</h2>

          <div className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg

${
  activeStep === step.id
    ? "bg-blue-600 text-white"
    : "hover:bg-gray-100 text-gray-600"
}

`}
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
          {/* progress */}

          <div className="h-1 bg-gray-200">
            <div
              className="h-1 bg-blue-600 transition-all"
              style={{
                width: `${((stepOrder.indexOf(activeStep) + 1) / stepOrder.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {/* ================= vendor ================= */}

            {activeStep === "vendor" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Vendor Details</h3>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={form.company}
                    maxLength={120}
                    onChange={(v) => handleChange("company", v)}
                  />
 label, value, onChange ,maxLength ,error , placeholder
                  <Input
                    label="Company Email"
                    value={form.email}
                    onChange={(v) => handleChange("email", v)}
                    error={!emailValid}
                    errorText="Invalid email"
                    maxLength={120}
                  />

                  <Input
                    label="Company Phone"
                    value={form.phone}
                    maxLength={10}
                    onChange={(v) =>
                      handleChange("phone", v.replace(/\D/g, ""))
                    }
                    error={!phoneValid}
                    errorText="Phone must be 10 digits"
                  />

                  <Select
                    label="State"
                    value={form.state}
                    options={states}
                    onChange={(v) => handleChange("state", v)}
                  />

                  <Input
                    label="First Name"
                    value={form.first}
                    maxLength={50}
                    onChange={(v) => handleChange("first", v)}
                  />

                  <Input
                    label="Last Name"
                    value={form.last}
                    maxLength={50}
                    onChange={(v) => handleChange("last", v)}
                  />

                  <Select
                    label="Designation"
                    value={form.designation}
                    options={designations}
                    onChange={(v) => handleChange("designation", v)}
                  />
                </div>
              </div>
            )}

            {/* ================= parent venue ================= */}

            {activeStep === "parent" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Parent Venue</h3>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Venue Name"
                    value={venue.name}
                    maxLength={120}
                    onChange={(v) => handleVenue("name", v)}
                  />

                  <div className="col-span-2">
                    <GooglePlaceInput setVenue={(data) => setVenue(data)} />
                  </div>

                  <Input
                    label="City"
                    value={venue.city}
                    onChange={(v) => handleVenue("city", v)}
                    maxLength={60}
                  />

                  <Input
                    label="Address"
                    value={venue.address}
                    onChange={(v) => handleVenue("address", v)}
                    maxLength={200}
                  />
                </div>
              </div>
            )}

            {/* ================= child venue ================= */}

            {activeStep === "child" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Child Venues</h3>

                {childVenues.map((child, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm space-y-6"
        >

          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Child Venue Name</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
                value={child.name}
                maxLength={100}
                onChange={(e) =>
                  updateChild(index, "name", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
                value={child.category}
                onChange={(e) =>
                  updateChild(index, "category", e.target.value)
                }
              >
                <option value="">Select Category</option>
                <option>Banquet Hall</option>
                <option>Resort</option>
                <option>Farmhouse</option>
                <option>Convention Hall</option>
              </select>
            </div>
          </div>

          {/* Uploads */}
          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm font-medium">Thumbnail</label>
              <input type="file" className="w-full border border-gray-200 rounded-md p-2 mt-1"/>
            </div>

            <div>
              <label className="text-sm font-medium">Banner</label>
              <input type="file" className="w-full border border-gray-200 rounded-md p-2 mt-1"/>
            </div>

            <div>
              <label className="text-sm font-medium">Gallery</label>
              <input type="file" multiple className="w-full border border-gray-200 rounded-md p-2 mt-1"/>
            </div>

          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm font-medium">Pricing Type</label>
              <select
                className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
                value={child.pricingType}
                onChange={(e) =>
                  updateChild(index, "pricingType", e.target.value)
                }
              >
                <option value="">Pricing Type</option>
                <option value="venue">Venue</option>
                <option value="pax">Per Pax</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Amount</label>
              <input
                type="number"
                className={`w-full border border-gray-200 rounded-md px-3 py-2 mt-1 ${
                  child.errors.amount ? "border-red-500" : ""
                }`}
                value={child.amount}
                onChange={(e) =>
                  updateChild(index, "amount", e.target.value)
                }
              />
              {child.errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {child.errors.amount}
                </p>
              )}
            </div>

          </div>

          {/* Time Slots */}
           {/* SHIFT SELECT */}
          <div className="flex gap-6">

            {["morning", "afternoon", "evening"].map((shift) => (
              <label
                key={shift}
                className="flex items-center gap-2 font-medium"
              >
                <input
                  type="checkbox"
                  checked={child.shifts[shift].enabled}
                  onChange={() => toggleShift(index, shift)}
                />

                {shift.charAt(0).toUpperCase() + shift.slice(1)}
              </label>
            ))}

          </div>

          {/* SHIFT DATA */}

          {["morning", "afternoon", "evening"].map(
            (shift) =>
              child.shifts[shift].enabled && (
                <div
                  key={shift}
                  className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg"
                >

                  <div>
                    <label className="text-sm font-medium">
                      {shift} From Date
                    </label>

                    <input
                      type="date"
                      min={today}
                      required
                      value={child.shifts[shift].fromDate}
                      onChange={(e) =>
                        updateShift(
                          index,
                          shift,
                          "fromDate",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      {shift} End Date
                    </label>

                    <input
                      type="date"
                      disabled
                      value={child.shifts[shift].endDate}
                      className="w-full border bg-gray-100 rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      {shift} Amount
                    </label>

                    <input
                      type="number"
                      value={child.shifts[shift].amount}
                      onChange={(e) =>
                        updateShift(
                          index,
                          shift,
                          "amount",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />

                    {child.errors[shift + "_amount"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {child.errors[shift + "_amount"]}
                      </p>
                    )}
                  </div>
                </div>
              )
          )}
         

        </div>
      ))}

      <button
        onClick={addChildVenue}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
      >
        + Add Child Venue
      </button>
              </div>
            )}

            {/* ================= billing ================= */}

            {activeStep === "billing" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Billing Plan</h3>

                <div className="grid grid-cols-2 gap-6">
                  <PlanCard
                    title="Monthly"
                    price="₹160"
                    active={plan === "Monthly"}
                    setPlan={setPlan}
                  />

                  <PlanCard
                    title="Annual"
                    price="₹1240"
                    active={plan === "Annual"}
                    setPlan={setPlan}
                  />
                </div>
              </div>
            )}

            {/* ================= summary ================= */}

            {activeStep === "summary" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Summary</h3>

                <div className="border  border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Billing Plan</span>
                    <span className="font-semibold">{plan}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t  border-gray-200 px-8 py-4 flex justify-between">
            <button onClick={onClose} className="bg-gray-200 px-5 py-2 rounded">
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
                disabled={activeStep === "vendor" && !isVendorValid}
                className={`px-5 py-2 rounded text-white

${activeStep === "vendor" && !isVendorValid ? "bg-gray-400" : "bg-blue-600"}

`}
              >
                {activeStep === "summary" ? "Submit " : "Next "}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================= */

function Input({ label, value, onChange, error, maxLength }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border  border-gray-200 px-3 py-2 rounded mt-1

${error ? "border-red-500" : value ? "border-green-500" : "border-gray-200"}

`}
      />

      {maxLength && (
        <p className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border  border-gray-200 px-3 py-2 rounded mt-1"
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, multiple }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        type="file"
        multiple={multiple}
        className="w-full border  border-gray-200 px-3 py-2 rounded mt-1"
      />
    </div>
  );
}

function PlanCard({ title, price, active, setPlan }) {
  return (
    <div
      onClick={() => setPlan(title)}
      className={`border  border-gray-200 rounded-xl p-6 text-center cursor-pointer

${active ? "border-blue-600 shadow-lg" : "border-gray-200"}

`}
    >
      <h4 className="font-semibold text-lg">{title}</h4>

      <p className="text-gray-500 mt-2">{price}</p>
    </div>
  );
}
