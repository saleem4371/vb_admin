"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShieldCheck, Landmark, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";

export default function VerificationDetails({ users }) {
  const [kycEdit, setKycEdit] = useState(false);
  const [bankEdit, setBankEdit] = useState(false);
  const [verifyType, setVerifyType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [docModal, setDocModal] = useState(false);
const [ocrLoading, setOcrLoading] = useState(false);
const [ocrText, setocrText] = useState('');

  console.log(users.user_id);

  const [kyc, setKyc] = useState({
    pan: "",
    gst: "",
    pan_name: "",
    city: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
    verified: false,
  });

  const [bank, setBank] = useState({
    name: "",
    account: "",
    bank: "",
    ifsc: "",
    verified: false,
  });

  const [errors, setErrors] = useState({});

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const accountRegex = /^[0-9]{9,18}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  const validate = (name, value) => {
    let err = "";

    if (name === "pan" && !panRegex.test(value)) err = "Invalid PAN format";

    if (name === "gst" && !gstRegex.test(value)) err = "Invalid GST format";

    if (name === "account" && !accountRegex.test(value))
      err = "Account must be 9-18 digits";

    if (name === "ifsc" && !ifscRegex.test(value)) err = "Invalid IFSC code";

    if (name === "pincode" && !pincodeRegex.test(value))
      err = "Pincode must be 6 digits";

    if (name === "pan_name" && value.length < 3) err = "Legal name required";

    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "kyc") {
      setKyc({ ...kyc, [name]: value.toUpperCase() });
    } else {
      setBank({
        ...bank,
        [name]: name === "ifsc" ? value.toUpperCase() : value,
      });
    }

    validate(name, value);
  };
  const saveKyc = async () => {
    if (Object.values(errors).some((e) => e)) {
      toast.error("Fix validation errors");
      return;
    }

    try {
      setLoading(true);

      const param = {
        user_id: users.user_id,
        kyc: kyc,
      };

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/upload_kyc_upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      toast.success("KYC details updated");
    }

    setKycEdit(false);
  };
  const saveBank = async () => {
    if (Object.values(errors).some((e) => e)) {
      toast.error("Fix validation errors");
      return;
    }
    try {
      setLoading(true);

      const param = {
        user_id: users.user_id,
        verify_bank: bank,
      };

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/upload_bank_upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      toast.success("bank details updated");
    }

    toast.success("Bank details updated");

    setBankEdit(false);
  };
  const handleVerify = async () => {

    
    setLoading(true);

       const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/kyc_update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: users.user_id ,verifyType:verifyType }),
        },
      );

      const data = await res.json();

   // await new Promise((resolve) => setTimeout(resolve, 1200));

    if (verifyType === "kyc") {
     // setKyc({ ...kyc, verified: true });
      toast.success("KYC verified successfully");
    }

    if (verifyType === "bank") {
      //setBank({ ...bank, verified: true });
      toast.success("Bank verified successfully");
    }

    setVerifyType(null);
    setLoading(false);
  };

  useEffect(() => {
    if (!users?.user_id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/kyc_details",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: users.user_id }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch KYC");
        }

        if (data?.kyc?.length > 0) {
          const kycData = data.kyc[0];

          const gstPanDetails = kycData?.gst_pan_details
            ? JSON.parse(kycData.gst_pan_details)
            : {};

          setKyc({
            pan: kycData.pan_no,
            gst: kycData.gst_no,
            pan_image: kycData.pan_image,
            tan_image: kycData.tan_image,
            pan_name: gstPanDetails.legal_name || "",
            address: gstPanDetails.address || "",
            city: gstPanDetails.city || "",
            state: gstPanDetails.state || "",
            country: gstPanDetails.country || "",
            pincode: gstPanDetails.pincode || "",
            verified: kycData.pan_verify,
          });

          setBank({
            name: kycData.account_holder_name || "",
            account: kycData.account_no || "",
            bank: kycData.bank_name || "",
            ifsc: kycData.ifsc_code || "",
            verified: kycData.bank_verify,
          });
        }
      } catch (err) {
        console.error("KYC fetch error:", err);
        toast.error("Failed to load KYC details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [users?.user_id]);

  // const verify_kyc = async() => {

  //   const res = await fetch(
  //       "https://websockettest.venuebook.in:5000/admin/kyc_update",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id: users.user_id }),
  //       },
  //     );

  //     const data = await res.json();
  //     fetchData();
  //     setVerifyType("kyc");
  // }

  const fetchOCR = async () => {
  try {
    setOcrLoading(true);

    const res = await fetch(
      "https://websockettest.venuebook.in:5000/v3/banner/get_vendor_ocr",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: users?.user_id }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const ocr = data.data || data;

    
    setocrText(ocr.ocrText)

setDocModal(false);
    //data

    // 🔥 UPDATE DATABASE (reuse your API)
    // await fetch(
    //   "https://websockettest.venuebook.in:5000/admin/upload_kyc_upload",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       user_id: users?.user_id,
    //       kyc: {
    //         ...kyc,
    //         pan_name: ocr.name || kyc.pan_name,
    //         address: ocr.address || kyc.address,
    //         city: ocr.city || kyc.city,
    //         state: ocr.state || kyc.state,
    //         country: ocr.country || kyc.country,
    //         pincode: ocr.pincode || kyc.pincode,
    //       },
    //     }),
    //   }
    // );

    toast.success("OCR Data Applied 🚀");
    fetchData(); // refresh UI
  } catch (err) {
    console.error(err);
    toast.error("OCR Fetch Failed");
  } finally {
    setOcrLoading(false);
  }
};


  //setVerifyType("kyc")

  return (
    <>
      <div className="grid md:grid-cols-2 gap-2">
        {/* KYC CARD */}

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white  shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-800">KYC Details</h3>
            </div>

            <div className="flex items-center gap-3">
                <button
  onClick={() => setDocModal(true)}
  className="cursor-pointer text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:scale-105 transition"
>
  View Document
</button>
              {kyc.verified == 2 ? (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle size={14} /> Verified
                </span>
              ) : (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  Pending
                </span>
              )}

              <button
                onClick={() => setKycEdit(true)}
                className="cursor-pointer  flex items-center gap-1 text-sm text-blue-600 cursor-pointer"
              >
                <Pencil size={16} /> Edit
              </button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">PAN Number</span>
              <span className="font-medium">{kyc.pan}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">GST Number</span>
              <span className="font-medium">{kyc.gst}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">City</span>
              <span className="font-medium">{kyc.city}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-right max-w-[380px]">
                {kyc.address}
              </span>
            </div>
          </div>
          {/* { ocrText } */}

        

          {kyc.verified == 1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
               onClick={() => setVerifyType("kyc")}
              className="cursor-pointer mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Verify KYC
            </motion.button>
          )}

         
        </motion.div>

        {/* BANK CARD */}

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white  shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Landmark className="text-indigo-600" size={20} />
              <h3 className="font-semibold text-gray-800">Bank Details</h3>
            </div>

            <div className="flex items-center gap-3">
              {bank.verified == 2 ? (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle size={14} /> Verified
                </span>
              ) : (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  Pending
                </span>
              )}

              <button
                onClick={() => setBankEdit(true)}
                className="cursor-pointer  flex items-center gap-1 text-sm text-indigo-600 cursor-pointer"
              >
                <Pencil size={16} /> Edit
              </button>
             
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name</span>
              <span className="font-medium">{bank.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Account Number</span>
              <span className="font-medium">{bank.account}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Bank Name</span>
              <span className="font-medium">{bank.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IFSC</span>
              <span className="font-medium">{bank.ifsc}</span>
            </div>
          </div>

          {bank.verified ==1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setVerifyType("bank")}
              className="cursor-pointer  mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Verify Bank
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* KYC EDIT MODAL */}

      <AnimatePresence>
        {kycEdit && (
          <Modal close={() => setKycEdit(false)} title="Edit KYC Details">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="PAN"
                name="pan"
                value={kyc.pan}
                onChange={(e) => handleChange(e, "kyc")}
                error={errors.pan}
              />

              <Input
                label="GST"
                name="gst"
                value={kyc.gst}
                onChange={(e) => handleChange(e, "kyc")}
                error={errors.gst}
              />

              <Input
                label="Legal Name"
                name="pan_name"
                value={kyc.pan_name}
                onChange={(e) => handleChange(e, "kyc")}
              />

              <Input
                label="City"
                name="city"
                value={kyc.city}
                onChange={(e) => handleChange(e, "kyc")}
              />

              <Input
                label="State"
                name="state"
                value={kyc.state}
                onChange={(e) => handleChange(e, "kyc")}
              />

              <Input
                label="Country"
                name="country"
                value={kyc.country}
                onChange={(e) => handleChange(e, "kyc")}
              />

              <Input
                label="Pincode"
                name="pincode"
                value={kyc.pincode}
                onChange={(e) => handleChange(e, "kyc")}
                error={errors.pincode}
              />

              <Input
                label="Address"
                name="address"
                value={kyc.address}
                onChange={(e) => handleChange(e, "kyc")}
              />
            </div>
            <button
              onClick={saveKyc}
              disabled={loading}
              className="cursor-pointer  mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* BANK EDIT MODAL */}

      <AnimatePresence>
        {bankEdit && (
          <Modal close={() => setBankEdit(false)} title="Edit Bank Details">
            <Input
              label="Account Holder"
              name="name"
              value={bank.name}
              onChange={(e) => handleChange(e, "bank")}
            />

            <Input
              label="Account Number"
              name="account"
              value={bank.account}
              onChange={(e) => handleChange(e, "bank")}
              error={errors.account}
            />

            <Input
              label="Bank Name"
              name="bank"
              value={bank.bank}
              onChange={(e) => handleChange(e, "bank")}
            />
            <Input
              label="IFSC Code"
              name="ifsc"
              value={bank.ifsc}
              onChange={(e) => handleChange(e, "bank")}
            />

            <button
              onClick={saveBank}
              disabled={loading}
              className="cursor-pointer  mt-4 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* VERIFY CONFIRM MODAL */}

      <AnimatePresence>
        {verifyType && (
          <Modal title="Confirm Verification" close={() => setVerifyType(null)}>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to verify this {verifyType} information?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setVerifyType(null)}
                className="cursor-pointer  flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleVerify}
                className="cursor-pointer flex-1 bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}

                {loading ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {docModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative"
      >
        {/* CLOSE */}
        <button
          onClick={() => setDocModal(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4">
          📄 Document Preview
        </h2>

     {/* DOCUMENT PREVIEW */}
<div className="h-52 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">

  {kyc?.pan_image ? (
    kyc.pan_image.endsWith(".pdf") ? (

      // 📄 PDF VIEW
      <iframe
        src={`https://websockettest.venuebook.in:5000/${kyc.pan_image}`}
        className="w-full h-full rounded-xl"
      />

    ) : (

      // 🖼️ IMAGE VIEW
      <img
        src={`https://websockettest.venuebook.in:5000/${kyc.pan_image}`}
        alt="KYC Document"
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
      />

    )
  ) : (

    // ❌ EMPTY STATE
    <div className="text-gray-400 text-sm">
      No Document Uploaded
    </div>

  )}

</div>

        {/* OCR BUTTON */}
        <button
          onClick={fetchOCR}
          disabled={ocrLoading}
          className="cursor-pointer mt-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
        >
          {ocrLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {ocrLoading ? "Fetching OCR..." : "Fetch Data from OCR"}
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}

/* INPUT COMPONENT */

function Input({ label, error, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>

      <input
        {...props}
        className={`w-full border px-3 py-2 rounded-lg outline-none
        ${error ? "border-red-400" : "border-gray-300 focus:ring-2 focus:ring-blue-200"}`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* MODAL */

function Modal({ title, children, close }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative"
      >
        <button
          onClick={close}
          className="cursor-pointer  absolute right-4 top-4 cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {children}
      </motion.div>
    </motion.div>
  );
}
