"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { gatewayFields } from "@/config/gatewayFields";

export default function IntegrationModal({ isOpen, onClose, title }) {

  const fields = gatewayFields[title] || [];
  const [form, setForm] = useState({});

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const saveConfig = () => {
    console.log(title, form);
    onClose();
  };

  return (

    <Dialog open={isOpen} onClose={onClose}>

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <Dialog.Panel className="bg-white rounded-xl p-6 w-[420px]">

          <Dialog.Title className="text-lg font-semibold mb-4">
            {title} Configuration
          </Dialog.Title>

          <div className="space-y-3">

            {fields.map((field) => (

              <div key={field.name}>

                <label className="text-sm text-gray-600">
                  {field.label}
                </label>

                {field.type === "select" ? (

                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
                    onChange={(e) =>
                      handleChange(field.name, e.target.value)
                    }
                  >

                    {field.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}

                  </select>

                ) : (

                  <input
                    type={field.type || "text"}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
                    onChange={(e) =>
                      handleChange(field.name, e.target.value)
                    }
                  />

                )}

              </div>

            ))}

          </div>

          <div className="flex justify-end gap-3 mt-5">

            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={saveConfig}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>

          </div>

        </Dialog.Panel>

      </div>

    </Dialog>

  );
}