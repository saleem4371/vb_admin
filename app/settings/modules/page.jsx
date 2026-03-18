"use client";

import { useState } from "react";
import { Search, Trash2, Pencil, X } from "lucide-react";

export default function ModulesPage() {
  const [modules, setModules] = useState([
    { id: 1, name: "Dashboard", slug: "dashboard", route: "/dashboard", status: true },
    { id: 2, name: "Billing", slug: "billing", route: "/billing", status: true },
    { id: 3, name: "Vendors", slug: "vendors", route: "/vendors", status: false },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    route: "",
  });

  const filtered = modules.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addModule = () => {
    if (!form.name) return;

    setModules([
      ...modules,
      { id: Date.now(), ...form, status: true },
    ]);

    setForm({ name: "", slug: "", route: "" });
    setShowModal(false);
  };

  const deleteModule = () => {
    setModules(modules.filter((m) => m.id !== deleteId));
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setModules(
      modules.map((m) =>
        m.id === id ? { ...m, status: !m.status } : m
      )
    );
  };

  return (
    <div className="p-0">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h1 className="text-lg font-semibold">Modules</h1>

        <div className="flex gap-2">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />

            <input
              placeholder="Search module..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer  bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
          >
            Add Module
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200  overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Module</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((m) => (

                <tr
                  key={m.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-3 py-2">{m.id}</td>

                  <td className="px-3 py-2 font-medium">{m.name}</td>

                  <td className="px-3 py-2 text-gray-500">{m.slug}</td>

                  <td className="px-3 py-2 text-gray-500">{m.route}</td>

                  <td className="px-3 py-2">

                    <button
                      onClick={() => toggleStatus(m.id)}
                      className={`cursor-pointer w-10 h-5 flex items-center rounded-full p-1 transition ${
                        m.status ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                          m.status ? "translate-x-5" : ""
                        }`}
                      />
                    </button>

                  </td>

                  <td className="px-3 py-2 flex justify-end gap-3">

                    <button className="cursor-pointer  text-blue-600 hover:text-blue-800">
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteId(m.id)}
                      className="cursor-pointer  text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add Module Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg w-full max-w-md">

            <div className="flex justify-between items-center border-b border-gray-200 p-4">

              <h2 className="font-semibold">Add Module</h2>

              <button onClick={() => setShowModal(false)} className="cursor-pointer ">
                <X size={18} />
              </button>

            </div>

            <div className="p-4 space-y-3">

              <input
                placeholder="Module Name"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Slug"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value })
                }
              />

              <input
                placeholder="Route"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                onChange={(e) =>
                  setForm({ ...form, route: e.target.value })
                }
              />

              <button
                onClick={addModule}
                className="cursor-pointer  w-full bg-blue-600 text-white py-2 rounded-md text-sm"
              >
                Create Module
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Delete Confirmation */}
      {deleteId && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-5 w-full max-w-sm">

            <h2 className="font-semibold mb-2">
              Delete Module
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this module?
            </p>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-200 rounded-md text-sm cursor-pointer "
              >
                Cancel
              </button>

              <button
                onClick={deleteModule}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm cursor-pointer "
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}