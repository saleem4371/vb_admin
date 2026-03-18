"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

export default function WalletPasswordPage() {

  /* WALLET */

  const [balance, setBalance] = useState(15200);
  const [modal, setModal] = useState(null);
  const [amount, setAmount] = useState("");

  const transactions = [
    { id: 1, type: "credit", amount: 5000, note: "Booking Payment", date: "12 Mar 2026" },
    { id: 2, type: "debit", amount: 1200, note: "Withdraw", date: "10 Mar 2026" },
    { id: 3, type: "credit", amount: 2200, note: "Event Payment", date: "8 Mar 2026" },
  ];

  const handleWallet = () => {

    const value = Number(amount);

    if (!value || value <= 0) return;

    if (modal === "add") setBalance(balance + value);
    if (modal === "withdraw") setBalance(balance - value);

    setModal(null);
    setAmount("");
  };


  /* PASSWORD */

  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {

    let err = "";

    if (name === "new" && value.length < 6) {
      err = "Password must be at least 6 characters";
    }

    if (name === "confirm" && value !== form.new) {
      err = "Passwords do not match";
    }

    setErrors({ ...errors, [name]: err });
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    validate(name, value);
  };

  const togglePassword = (field) => {

    setShow({
      ...show,
      [field]: !show[field],
    });
  };

  const handlePassword = () => {

    if (!form.current || !form.new || !form.confirm) {
      alert("Fill all fields");
      return;
    }

    if (errors.confirm) return;

    alert("Password updated successfully");
  };

  return (

    <div className="mx-auto p-0">

      <div className="grid md:grid-cols-2 gap-2">

        {/* WALLET SECTION */}

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600" />
            <h2 className="text-xl font-semibold">Wallet</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">

            <p className="text-sm opacity-80">Available Balance</p>
            <h1 className="text-3xl font-bold">₹ {balance}</h1>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => setModal("add")}
                className="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                Add Money
              </button>

              <button
                onClick={() => setModal("withdraw")}
                className="cursor-pointer bg-white text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                Withdraw
              </button>

            </div>

          </div>

          {/* TRANSACTIONS */}

          <div className="space-y-3">

            <h3 className="font-semibold text-gray-700">
              Recent Transactions
            </h3>

            {transactions.map((tx) => (

              <div
                key={tx.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
              >

                <div className="flex gap-3 items-center">

                  {tx.type === "credit"
                    ? <ArrowDownLeft className="text-green-600" size={18} />
                    : <ArrowUpRight className="text-red-600" size={18} />
                  }

                  <div>
                    <p className="text-sm font-medium">{tx.note}</p>
                    <span className="text-xs text-gray-500">{tx.date}</span>
                  </div>

                </div>

                <p className={`font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </p>

              </div>

            ))}

          </div>

        </div>


        {/* PASSWORD SECTION */}

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          <div className="flex items-center gap-2">
            <Lock className="text-indigo-600" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>

          <div className="space-y-4">

            {/* CURRENT PASSWORD */}

           


            {/* NEW PASSWORD */}

            <div>

              <label className="text-sm text-gray-600">
                New Password
              </label>

              <div className="relative mt-1">

                <input
                  type={show.new ? "text" : "password"}
                  name="new"
                  value={form.new}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>

              {errors.new && (
                <p className="text-red-500 text-xs mt-1">{errors.new}</p>
              )}

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="text-sm text-gray-600">
                Confirm Password
              </label>

              <div className="relative mt-1">

                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>

              {errors.confirm && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm}
                </p>
              )}

            </div>

            <button
              onClick={handlePassword}
              className="cursor-pointer w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Update Password
            </button>

          </div>

        </div>

      </div>


      {/* WALLET MODAL */}

      <AnimatePresence>

        {modal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white w-96 rounded-xl p-6 shadow-xl"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-semibold">
                  {modal === "add" ? "Add Money" : "Withdraw"}
                </h2>

                <button onClick={() => setModal(null)} className="cursor-pointer">
                  <X size={20} />
                </button>

              </div>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-3 rounded-lg mb-4"
              />

              <button
                onClick={handleWallet}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}
