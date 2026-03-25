"use client";

import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import Billing_filter from "@/components/billing_filter"

export default function OrdersTable() {
  const [activeTab, setActiveTab] = useState("payments");
  const [loading, setLoading] = useState(false);

  const [billingData, setBillingData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [payLaterTransactionData, setPayLaterTransactionData] = useState([]);



  const [filters, setFilters] = useState({
    orderId: "",
    count: 10,
  });

  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");




  // Fetch APIs
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/transaction"
      );

      const data = await res.json();
      setBillingData(data.transaction || []);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/order_transaction"
      );

      const data = await res.json();
      setTransactionData(data.order_transaction || []);
      setPayLaterTransactionData(data.pay_later_transaction || []);
    } catch (err) {
      toast.error("Failed to load order transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchTransactions();
    } else if (activeTab === "payments") {
      fetchOrderTransactions();
    }
    else
    {
       fetchOrderTransactions();
    }
  }, [activeTab]);

  const dataset =
    activeTab === "orders" ? billingData : (activeTab === "payments" ? transactionData:payLaterTransactionData);

  // FILTER
  const filteredData = useMemo(() => {
    return dataset.filter((o) => {
      if (
        filters.orderId &&
        !o.booking_auto_id?.toString().includes(filters.orderId)
      )
        return false;
      return true;
    });
  }, [dataset, filters]);

  // SORT
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortKey === "amount") {
        return sortDir === "asc"
          ? a.convenience_fee - b.convenience_fee
          : b.convenience_fee - a.convenience_fee;
      }

      if (sortKey === "createdAt") {
        return sortDir === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <>
   
<Billing_filter/>

    <div className="bg-white border border-gray-200 rounded-xl shadow-sm"> 
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange("payments")}
          className={`px-6 py-3 font-medium cursor-pointer ${
            activeTab === "payments"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Subscription Amount
        </button>

        <button
          onClick={() => handleTabChange("orders")}
          className={`px-6 py-3 font-medium cursor-pointer ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Transaction Amount
        </button>

        <button
          onClick={() => handleTabChange("pay_later")}
          className={`px-6 py-3 font-medium cursor-pointer ${
            activeTab === "pay_later"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
         Pay Later
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 flex gap-3">
        <input
          value={filters.orderId}
          onChange={(e) =>
            setFilters({ ...filters, orderId: e.target.value })
          }
          placeholder="Booking ID"
          className="border border-gray-200 px-3 py-2 rounded-md text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Booking ID</th>

              <th
                onClick={() => toggleSort("amount")}
                className="px-4 py-3 text-left cursor-pointer"
              >
                Amount
              </th>

              <th
                onClick={() => toggleSort("createdAt")}
                className="px-4 py-3 text-left cursor-pointer"
              >
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="3" className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-blue-600">
                    {row.booking_auto_id}
                  </td>

                  <td className="px-4 py-3">
                    ₹ {row.convenience_fee}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between p-4">
        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border border-gray-200 px-3 py-1 rounded"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border border-gray-200 px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}