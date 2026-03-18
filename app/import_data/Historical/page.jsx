"use client";

import { useEffect, useState } from "react";
import UploadModal from "./components/UploadModal";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function HistoricalPage() {

  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [selectvendor, setSeletedVendor] = useState('');
  const [History, setHistory] = useState([]);

  const [page,setPage] = useState(1);
  const rowsPerPage = 10;


  // Vendor filter
  const filteredData = selectvendor
    ? History.filter((u) => u.vendor_id === selectvendor)
    : History;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const start = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(start, start + rowsPerPage);

  const nextPage = () => {
    if(page < totalPages){
      setPage(page+1);
    }
  };

  const prevPage = () => {
    if(page > 1){
      setPage(page-1);
    }
  };

    const fetchImported = async () => {

    try {

      const res = await fetch("https://websockettest.venuebook.in:5000/admin/fetchImported",{
        method:'POST'
      });

      const data = await res.json();

      setVendor(data.users);
      setHistory(data.history);
      // setFiltered(data.plans);

    } catch {
      toast.error("Failed to load plans");
    }
  };

   useEffect(() => {
    fetchImported();
  }, []);

  return (
    <div className="p-4 bg-white">

      <Toaster position="top-right" />

      {/* Top Section */}

      <div className="flex justify-between mb-6">

       <select
  className="border border-gray-200 rounded-md px-3 py-2"
  value={selectvendor}
  onChange={(e) => {
    setSeletedVendor(e.target.value);
    setPage(1);
    toast.success("Vendor filter applied");
  }}
>
  <option value="">All Vendors</option>

  {vendor?.map((v) => (
    <option key={v.user_id} value={v.user_id}>
      {v.first_name}
    </option>
  ))}
</select>

        <button
          onClick={()=>{
            setOpen(true);
            toast("Opening upload modal");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer "
        >
          Upload Excel
        </button>

      </div>

      {/* Table */}

      <div className="border border-gray-200 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Book Date</th>
              
            </tr>

          </thead>

          <tbody>

            {paginatedData.map((u)=>(
              <tr key={u.id} className="border-t border-gray-200">

                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.invoice_no}</td>
                <td className="p-3">{u.first_name}</td>
                <td className="p-3">{u.cust_name}</td>
                <td className="p-3">{u.total}</td>
                <td className="p-3">{u.book_date}</td>

                


              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-4">

        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">

          <button
            onClick={prevPage}
            disabled={page===1}
            className="border px-3 py-1 rounded disabled:opacity-40 cursor-pointer "
          >
            Prev
          </button>

          <button
            onClick={nextPage}
            disabled={page===totalPages}
            className="border px-3 py-1 rounded disabled:opacity-40 cursor-pointer "
          >
            Next
          </button>

        </div>

      </div>

      <UploadModal open={open} onClose={()=>setOpen(false)} vendor={vendor} />

    </div>
  );
}