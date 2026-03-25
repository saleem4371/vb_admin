"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function VendorVerification({ data }) {

  const [vendors, setVendors] = useState([]);
  const [notification, setNotification] = useState(null);

  // ✅ Fetch latest vendors
  const fetchUnverifiedVendors = async () => {
    try {
      const res = await fetch("https://websockettest.venuebook.in:5000/admin/set_un_verified_data");
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setVendors(result.unrigistered_venues || []);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchUnverifiedVendors();
  }, []);

  // ✅ Handle realtime socket data
  useEffect(() => {
    if (!data) return;

    if (data.notification) {
      setNotification(data);

      fetchUnverifiedVendors(); // refresh list

      toast.success(data.notification);
    }

  }, [data]);

  // send OTP
  const sendOTP = async (vendor) => {


    toast.success(`OTP sent to ${vendor.email} 📩`);
    const url = vendor.email_verified_url;

  window.open(url, "_blank"); // 🔥 opens new tab
  };

  return (
    <div className="">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-semibold mb-6">
        Unverified Vendors
      </h1>

      {/* ✅ Optional: show last notification */}
      {notification && (
        <p className="text-sm text-gray-500 mb-4">
          {notification.notification}
        </p>
      )}

      {/* ✅ Vendor List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
        {Array.isArray(vendors) && vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{vendor.name}</h2>
            <p className="text-gray-500 text-sm">{vendor.email}</p>
          

            {!vendor.email_verified  ? (
              <button
                onClick={() => sendOTP(vendor)}
                className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                Verify Email
                {/* otp
: 
null
otp_expire
: 
null */}
              </button>
            ) : (
              <>
              <div className="mt-4 text-green-600 font-medium">
                Verified ✔  
                { vendor.otp && (

                   <div>
                OTP is :   { vendor.otp }
                </div>

                )}
               
              </div>
               <button
                onClick={() => sendOTP(vendor)}
                className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                Re Verify Email
              </button></>
              
              
            )}
          </div>
        ))}
      </div>
    </div>
  );
}