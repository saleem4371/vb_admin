"use client";

import { Building2, MapPin, Layers, CreditCard } from "lucide-react";

export default function SummaryStep({
  form = {},
  venue = {},
  childVenues = [],
  plan = "",
  billing
}) {


  console.log(billing.planName)
  const venueCount = childVenues.length;

  const planPrice =
    plan === "Monthly"
      ? 160
      : plan === "Annual"
      ? 1240
      : 0;

  const subtotal = venueCount * planPrice;

  const gst = subtotal * 0.18;

  const total = subtotal + gst;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <h3 className="text-2xl font-semibold">
        Review & Confirm
      </h3>

      {/* Vendor Card */}

      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} />
          <h4 className="font-semibold text-lg">
            Vendor Details
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <Info label="Company" value={form.company} />
          <Info label="Email" value={form.email} />
          <Info label="Phone" value={form.phone} />
          <Info label="State" value={form.state} />
          <Info
            label="Contact Person"
            value={`${form.first} ${form.last}`}
          />
          <Info label="Designation" value={form.designation} />

        </div>

      </div>

      {/* Parent Venue */}

      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} />
          <h4 className="font-semibold text-lg">
            Parent Venue
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <Info label="Venue Name" value={venue.name} />
          <Info label="City" value={venue.city} />
          <Info label="Address" value={venue.address} />

        </div>

      </div>

      {/* Child Venues */}

      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} />
          <h4 className="font-semibold text-lg">
            Child Venues ({venueCount})
          </h4>
        </div>

        <div className="space-y-2">

          {childVenues.map((v, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>{v.name}</span>
              <span className="text-gray-500">
                {v.category}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* Billing */}

      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={18} />
          <h4 className="font-semibold text-lg">
            Billing Summary
          </h4>
        </div>

        <div className="space-y-3 text-sm">

          <Row
            label="Selected Plan"
            value={billing.planName}
          />

          <Row
            label="Plan Price"
            value={`₹${billing.planPrice}`}
          />

          <Row
            label="Child Venues"
            value={venueCount}
          />

          <Row
            label="Subtotal"
            value={`₹${billing.subtotal}`}
          />

          <Row
            label="Discount"
            value={`₹${billing.discount.toFixed(2)}`}
          /> <Row
            label="GST (18%)"
            value={`₹${billing.gst.toFixed(2)}`}
          />

          <div className="border-t pt-3 flex justify-between font-semibold text-base">
            <span>Total Payable</span>
            <span>₹{billing.total.toFixed(2)}</span>
          </div>

        </div>

      </div>

      {/* Confirmation */}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm">

        <p>
          After confirmation, your vendor account will be created.
        </p>

        <p className="mt-2">
          Your <strong>username and password</strong> will be sent to your
          registered <strong>email and mobile number via SMS</strong>.
        </p>

        <p className="mt-2">
          Please login and complete the payment to activate your venue listings.
        </p>

      </div>

    </div>
  );
}

/* ---------- Small Components ---------- */

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
