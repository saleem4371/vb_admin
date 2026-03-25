"use client";

import { useState } from "react";
import IntegrationModal from "@/app/settings/third_party_application/modal/IntegrationModal";
import { CreditCard, MessageSquare, ShieldCheck, Cloud } from "lucide-react";

export default function IntegrationsPage() {

  const [active, setActive] = useState(null);

  const gateways = [
    { title: "Cashfree Gateway", icon: CreditCard, enabled: true },
    { title: "Stripe Gateway", icon: CreditCard, enabled: false },
    { title: "SMS Gateway", icon: MessageSquare, enabled: false },
    { title: "KYC Verification", icon: ShieldCheck, enabled: false },
    { title: "Amazon S3 Storage", icon: Cloud, enabled: false }
  ];

  return (

    <div>

      <h1 className="text-lg font-semibold text-gray-700 mb-6">
        Integrations & Gateways
      </h1>

      <IntegrationModal
        isOpen={!!active}
        onClose={() => setActive(null)}
        title={active}
      />

      <div className="grid md:grid-cols-3 gap-2">

        {gateways.map((g, i) => (

          <Card
            key={i}
            title={g.title}
            icon={g.icon}
            enabled={g.enabled}
            onClick={() => setActive(g.title)}
          />

        ))}

      </div>

    </div>
  );
}

function Card({ title, icon: Icon, enabled, onClick }) {

  return (

    <div
      onClick={onClick}
      className="bg-white border border-gray-200  p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
    >

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Icon size={18} />
          </div>

          <h3 className="font-medium text-gray-800 text-sm">
            {title}
          </h3>

        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            enabled
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>

      </div>

      <div className="flex justify-between items-center border-t border-t-gray-200  pt-3">

        <p className="text-sm text-blue-600 font-medium">
          Configure
        </p>

        <button
          className={`relative w-11 h-6 rounded-full transition ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
              enabled ? "translate-x-5" : ""
            }`}
          />

        </button>

      </div>

    </div>

  );
}