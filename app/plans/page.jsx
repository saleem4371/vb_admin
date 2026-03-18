"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, CreditCard, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";

/* ---------------- INPUT COMPONENT ---------------- */

function Input({ label, value, onChange, error }) {
  return (
    <div className="mt-3">
      <label className="text-sm text-gray-600">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-2 mt-1"
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

/* ---------------- CREATE PLAN MODAL ---------------- */

function CreatePlanModal({ close, refresh }) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    billing_cycle: "Monthly",
    discount: "",
    VenueCount:""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let e = {};

    if (!form.name) e.name = "Plan name required";
    if (!form.price) e.price = "Price required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const submit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

       const res = await fetch("https://websockettest.venuebook.in:5000/admin/plans_create", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Plan created");
        refresh();
        close();
      }

    } catch {
      toast.error("Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 w-96"
      >

        <h3 className="text-lg font-semibold mb-3">
          Create Plan
        </h3>

        <Input
          label="Plan Name"
          value={form.name}
          error={errors.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          label="Price"
          value={form.price}
          error={errors.price}
          onChange={(v) => setForm({ ...form, price: v })}
        />

        <div className="mt-3">
          <label className="text-sm text-gray-600">
            Billing Cycle
          </label>

          <select
            value={form.billing_cycle}
            onChange={(e) =>
              setForm({
                ...form,
                billing_cycle: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="1">Monthly</option>
            <option  value="2">Yearly</option>
          </select>
        </div>

        <Input
          label="Discount (%)"
          value={form.discount}
          onChange={(v) => setForm({ ...form, discount: v })}
        /> 
        
        <Input
          label="venue count"
          value={form.VenueCount}
          onChange={(v) => setForm({ ...form, VenueCount: v })}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4"
        >
          {loading ? "Saving..." : "Save Plan"}
        </button>

      </motion.div>
    </div>
  );
}

/* ---------------- IMPORT EXCEL MODAL ---------------- */

function ImportExcelModal({ close, refresh }) {

  const handleFile = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async (evt) => {

      const data = new Uint8Array(evt.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);

      try {

        await fetch("https://websockettest.venuebook.in:5000/admin/plans_import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });

        toast.success("Plans imported");
        refresh();
        close();

      } catch {

        toast.error("Import failed");

      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 w-96"
      >

        <h3 className="font-semibold mb-4">
          Import Excel
        </h3>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFile}
        />

      </motion.div>

    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function PlansPage() {

  const [plans, setPlans] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [cycle, setCycle] = useState("All");

  const [page, setPage] = useState(1);
  const perPage = 9;

  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const fetchPlans = async () => {

    try {

      const res = await fetch("https://websockettest.venuebook.in:5000/admin/plans",{
        method:'POST'
      });

      const data = await res.json();

      setPlans(data.plans);
      setFiltered(data.plans);

    } catch {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ---------------- FILTER ---------------- */

  useEffect(() => {

    let f = plans;

    if (search) {
      f = f.filter((p) =>
        p.plan_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cycle !== "All") {
      f = f.filter((p) => p.plan_title === cycle);
    }

    setFiltered(f);
    setPage(1);

  }, [search, cycle, plans]);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (

    <div className="p-2 min-h-screen">

      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="flex justify-between mb-6">

        <h2 className="text-2xl font-semibold">
          Plans
        </h2>

        <div className="flex gap-3">

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg"
          >
            <Upload size={16} />
            Import Excel
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Create Plan
          </button>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex gap-4 mb-6">

        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border border-gray-200 py-2"
          />

        </div>

        <select
          value={cycle}
          onChange={(e) => setCycle(e.target.value)}
          className="border border-gray-200 px-3 py-2"
        >
          <option>All</option>
          <option value="1">Monthly</option>
          <option value="2">Yearly</option>
        </select>

      </div>

      {/* PLAN CARDS */}

      <div className="grid md:grid-cols-3 gap-3">

        {paginated.map((plan) => (

          <motion.div
            key={plan.id}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-200  p-6 shadow-sm hover:shadow-md"
          >

            <div className="flex items-center gap-2 mb-3">

              <CreditCard size={18} />

              <h3 className="font-semibold">
                {plan.plan_name}
              </h3>

            </div>

            <p className="text-3xl font-bold">
              ₹{plan.amounts}
            </p>

            <p className="text-gray-500 text-sm">
              {plan.billing_cycle}
            </p>

            {plan.discount > 0 && (
              <p className="text-green-600 text-sm mt-2">
                {plan.discount}% Discount
              </p>
            )}

          </motion.div>

        ))}

      </div>

      {/* PAGINATION */}

      <div className="flex justify-center gap-3 mt-8">

        {Array.from({
          length: Math.ceil(filtered.length / perPage),
        }).map((_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded
            ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "border border-gray-200"
            }`}
          >
            {i + 1}
          </button>

        ))}

      </div>

      {showCreate && (
        <CreatePlanModal
          close={() => setShowCreate(false)}
          refresh={fetchPlans}
        />
      )}

      {showImport && (
        <ImportExcelModal
          close={() => setShowImport(false)}
          refresh={fetchPlans}
        />
      )}

    </div>
  );
}
