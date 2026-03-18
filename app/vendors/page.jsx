"use client";

import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Loader2,
} from "lucide-react";

import VendorCreateModal from "@/components/VendorModal/VendorModal";



import { timeAgo } from "@/utils/timeAgo";

export default function Vendors() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);

  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    count: 10,
  });

  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("updated_at");
  const [sortDir, setSortDir] = useState("desc");
  const [LoadingPath, setLoadingPath] = useState('');

  // FETCH VENDORS
  const fetchVendors = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/load_vendors"
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load vendors");
      }

      setVendors(data.vendors || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // MOUNT
  useEffect(() => {
    fetchVendors();
  }, []);

  const dataset = vendors;

  // FILTER
  const filteredData = useMemo(() => {
    setPage(1);

    return dataset.filter((v) => {
      if (filters.search) {
        const text = filters.search.toLowerCase();

        return (
          v.company_name?.toLowerCase().includes(text) ||
          v.first_name?.toLowerCase().includes(text) ||
          v.last_name?.toLowerCase().includes(text) ||
          v.email?.toLowerCase().includes(text) ||
          v.phone?.toString().includes(text)
        );
      }
      return true;
    });
  }, [dataset, filters]);

  // SORT
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortKey === "payment_transaction") {
        return sortDir === "asc"
          ? a.payment_transaction - b.payment_transaction
          : b.payment_transaction - a.payment_transaction;
      }

      if (sortKey === "updated_at") {
        return sortDir === "asc"
          ? new Date(a.updated_at) - new Date(b.updated_at)
          : new Date(b.updated_at) - new Date(a.updated_at);
      }

      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // PAGINATION
  const start = (page - 1) * filters.count;
  const paginated = sortedData.slice(start, start + filters.count);
  const totalPages = Math.ceil(sortedData.length / filters.count);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Search */}
      <div className="p-4 flex justify-between gap-3">
        <input
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          placeholder="Search vendor..."
          className="border border-gray-200 px-3 py-2 rounded-md text-sm w-64"
        />

          <button
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              + Add Vendor
            </button>
        
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Vendor id</th>
              <th className="px-4 py-3 text-left">Vendor</th>

              <th className="px-4 py-3 text-left">Company</th>

              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Created By</th>

             

              <th
                onClick={() => toggleSort("updated_at")}
                className="px-4 py-3 text-left cursor-pointer"
              >
                Last Login
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="6" className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No vendors found
                </td>
              </tr>
            ) : (
              paginated.map((v, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium">
                     <Link
                  href={`/vendors/${v.vendor_auto_id}`}
                  className="text-blue-600 font-medium hover:underline flex"
                  onClick={() => setLoadingPath(v.vendor_auto_id)}
                >
                   {v.vendor_auto_id}  {LoadingPath===v.vendor_auto_id? <Loader2 size={18} className="animate-spin" /> :''}
                </Link>
                   
                  </td> 
                  <td className="px-4 py-3 font-medium">
                    {v.first_name} {v.last_name}
                  </td>

                  <td className="px-4 py-3">{v.company_name}</td>

                  <td className="px-4 py-3">{v.phone}</td>

                  <td className="px-4 py-3 text-green-600 font-medium">
                     {v.createdby }
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                     {timeAgo(v.updated_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between p-4 text-sm">
        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border border-gray-200 px-3 py-1 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border border-gray-200 px-3 py-1 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

         {/* Modal */}
            {open && (
               <VendorCreateModal open={open} onClose={() => setOpen(false)} />
            )}

    </div>
  );
}