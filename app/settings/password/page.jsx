"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";


export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  /* Validation */
  const validate = (data) => {
    const err = {};

    if (!data.currentPassword)
      err.currentPassword = "Current password required";

    if (!data.newPassword)
      err.newPassword = "New password required";
    else if (data.newPassword.length < 8)
      err.newPassword = "Minimum 8 characters";

    if (!data.confirmPassword)
      err.confirmPassword = "Confirm password required";
    else if (data.confirmPassword !== data.newPassword)
      err.confirmPassword = "Passwords do not match";

    return err;
  };

  const handleChange = (e) => {
    const updated = {
      ...form,
      [e.target.name]: e.target.value,
    };

    setForm(updated);
    setErrors(validate(updated));
  };

  /* Password Strength */
  const getStrength = () => {
    const pass = form.newPassword;

    if (!pass) return { label: "", width: 0, color: "" };

    if (pass.length >= 12)
      return { label: "Strong", width: "100%", color: "bg-green-500" };

    if (pass.length >= 8)
      return { label: "Medium", width: "60%", color: "bg-yellow-500" };

    return { label: "Weak", width: "30%", color: "bg-red-500" };
  };

  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate(form);

    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://websockettest.venuebook.in:5000/admin/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully");

        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="p-0 md:p-6">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Change Password
        </h1>

        <p className="text-sm text-gray-500">
          Keep your account secure by updating your password
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Security Tips Panel */}

        <div className="bg-white rounded-2xl border border-gray-200 p-4 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-green-600" size={20} />
            <h3 className="font-semibold">
              Security Checklist
            </h3>
          </div>

          <PasswordRules password={form.newPassword} />
        </div>

        {/* Form */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputPassword
              label="Current Password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              visible={show.current}
              toggle={() =>
                setShow({ ...show, current: !show.current })
              }
              error={errors.currentPassword}
            />

            {/* New Password */}

            <div>
              <InputPassword
                label="New Password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                visible={show.new}
                toggle={() =>
                  setShow({ ...show, new: !show.new })
                }
                error={errors.newPassword}
              />

              {/* Strength bar */}

              {form.newPassword && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div
                      animate={{ width: strength.width }}
                      className={`h-2 rounded-full ${strength.color}`}
                    />
                  </div>

                  <p className="text-xs text-gray-600 mt-1">
                    Strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <InputPassword
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              visible={show.confirm}
              toggle={() =>
                setShow({ ...show, confirm: !show.confirm })
              }
              error={errors.confirmPassword}
            />

            <button
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

/* Password Input */

function InputPassword({
  label,
  name,
  value,
  onChange,
  visible,
  toggle,
  error,
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>

      <div className="relative flex items-center">
        {/* Validation Icon */}

        <div className="absolute left-3">
          {value ? (
            error ? (
              <XCircle size={18} className="text-red-500" />
            ) : (
              <CheckCircle2 size={18} className="text-green-500" />
            )
          ) : null}
        </div>

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-xl px-9 py-2.5 pr-10 outline-none
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:ring-2 focus:ring-black"
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 text-gray-500 cursor-pointer "
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

/* Security Rules */

function PasswordRules({ password }) {
  const rules = [
    {
      label: "Minimum 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "At least one number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "At least one special character",
      valid: /[!@#$%^&*]/.test(password),
    },
  ];

  return (
    <div className="space-y-2 text-sm">
      {rules.map((rule, i) => (
        <div key={i} className="flex items-center gap-2">

          {rule.valid ? (
            <CheckCircle2
              size={16}
              className="text-green-600"
            />
          ) : (
            <XCircle
              size={16}
              className="text-red-500"
            />
          )}

          <span
            className={
              rule.valid
                ? "text-green-600"
                : "text-gray-500"
            }
          >
            {rule.label}
          </span>

        </div>
      ))}
    </div>
  );
}