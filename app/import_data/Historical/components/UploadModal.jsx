"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export default function UploadModal({ open, onClose , vendor}) {
  const [vendors, setVendors] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState(0);

  if (!open) return null;

  const handleFile = (e) => {
    const f = e.target.files[0];

    if (!f) return;
    setFile(f);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });

      const sheet = wb.Sheets[wb.SheetNames[0]];

      const data = XLSX.utils.sheet_to_json(sheet);

      setPreview(data);
    };

    reader.readAsBinaryString(f);
  };

  const upload = () => {
    if (!vendors) {
      toast.error("Select vendor");
      return;
    }

    if (!file) {
      toast.error("Select excel file");
      return;
    }

    setProgress(10);

    let i = 10;

    const timer = setInterval(() => {
      i += 20;

      setProgress(i);

      if (i >= 100) {
        clearInterval(timer);
        toast.success("Upload Completed");
        onClose();
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Upload Historical Data</h2>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <select
            className="border border-gray-200 p-2 rounded"
            value={vendors}
            onChange={(e) => setVendors(e.target.value)}
          >
            <option value="">Select Vendor</option>

           {vendor?.map((v) => (
    <option key={v.user_id} value={v.user_id}>
      {v.first_name}
    </option>
  ))}
          </select>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            className="border border-gray-200 p-2 rounded"
          />
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-200 h-3 rounded mb-4">
            <div
              className="bg-blue-600 h-3 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {preview.length > 0 && (
          <div className="max-h-60 overflow-auto border border-gray-200 rounded mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>

              <tbody>
                {preview.slice(0, 10).map((r, i) => (
                  <tr key={i} className="border-t border-t-gray-200">
                    <td className="p-2">{r.Customer}</td>
                    <td className="p-2">{r.Amount}</td>
                    <td className="p-2">{r.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className=" cursor-pointer border border-gray-200 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={upload}
            className="cursor-pointer  bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
