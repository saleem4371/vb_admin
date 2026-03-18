"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Pencil } from "lucide-react";

export default function TermsPrivacy() {

  const [modal, setModal] = useState(null);
  const [content, setContent] = useState({
    terms:
      "These terms govern the use of the venue booking platform. Vendors must ensure accurate information and fair pricing...",
    privacy:
      "We respect user privacy. Personal data collected during booking will only be used for service improvements and communication...",
  });

  const [temp, setTemp] = useState("");

  const openModal = (type) => {
    setTemp(content[type]);
    setModal(type);
  };

  const save = () => {
    setContent({ ...content, [modal]: temp });
    setModal(null);
  };

  return (
    <div className=" p-0 space-y-6">

      {/* TERMS */}

      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white border border-gray-200
  p-6 shadow-sm mb-2"
      >

        <div className="flex justify-between items-center mb-4">

          <div className="flex items-center gap-2 font-semibold">
            <FileText size={18} />
            Terms & Conditions
          </div>

          <button
            onClick={() => openModal("terms")}
            className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded-md"
          >
            <Pencil size={14} /> Edit
          </button>

        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {content.terms}
        </p>

      </motion.div>

      {/* PRIVACY */}

      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white border border-gray-200
  p-6 shadow-sm"
      >

        <div className="flex justify-between items-center mb-4">

          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck size={18} />
            Privacy Policy
          </div>

          <button
            onClick={() => openModal("privacy")}
            className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded-md"
          >
            <Pencil size={14} /> Edit
          </button>

        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-2">
          {content.privacy}
        </p>

      </motion.div>

      {/* MODAL */}

      {modal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">

            <h3 className="font-semibold text-lg">
              Edit {modal === "terms" ? "Terms & Conditions" : "Privacy Policy"}
            </h3>

            <textarea
              rows={8}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full border border-gray-200
 rounded-lg p-3 text-sm"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
