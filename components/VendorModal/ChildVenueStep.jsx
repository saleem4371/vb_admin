"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

import { Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shifts = ["morning", "afternoon", "evening"];

const defaultVenue = {
  name: "",
  category: "",
  pricingType: "",
  thumbnail: null,
  banner: null,
  gallery: [],
  shifts: {
    morning: { enabled: false, fromDate: "", endDate: "", amount: "" },
    afternoon: { enabled: false, fromDate: "", endDate: "", amount: "" },
    evening: { enabled: false, fromDate: "", endDate: "", amount: "" },
  },
  uploadProgress: {
    thumbnail: 0,
    banner: 0,
    gallery: 0,
  },
  errors: {},
};

const ChildVenueStep = forwardRef(
  ({ childVenues, setChildVenues }, ref) => {

    const [childCount, setChildCount] = useState(
      childVenues?.length || 1
    );

    const today = new Date().toISOString().split("T")[0];

    /* ---------- NORMALIZE STRUCTURE ---------- */

    useEffect(() => {
      const normalized = childVenues.map((child) => ({
        ...defaultVenue,
        ...child,
        uploadProgress: {
          ...defaultVenue.uploadProgress,
          ...(child.uploadProgress || {}),
        },
      }));

      setChildVenues(normalized);
    }, []);

    /* ---------- VALIDATION ---------- */

    const validate = () => {
      let valid = true;

      const updated = [...childVenues];

      updated.forEach((child) => {
        child.errors = {};

        if (!child.name) {
          child.errors.name = "Venue name required";
          valid = false;
        }

        if (!child.category) {
          child.errors.category = "Category required";
          valid = false;
        }

        shifts.forEach((shift) => {
          const s = child.shifts[shift];

          if (s.enabled) {
            if (!s.fromDate) {
              child.errors[`${shift}_date`] = "Select date";
              valid = false;
            }

            if (!s.amount) {
              child.errors[`${shift}_amount`] =
                "Enter amount";
              valid = false;
            }
          }
        });
      });

      setChildVenues(updated);

      return valid;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    /* ---------- CHILD COUNT ---------- */

    const changeChildCount = (value) => {
      const count = Number(value);
      if (count < 1) return;

      setChildCount(count);

      let updated = [...childVenues];

      if (count > updated.length) {
        const add = count - updated.length;

        for (let i = 0; i < add; i++) {
          updated.push(
            JSON.parse(JSON.stringify(defaultVenue))
          );
        }
      } else {
        updated = updated.slice(0, count);
      }

      setChildVenues(updated);
    };

    /* ---------- UPDATE BASIC FIELD ---------- */

    const updateField = (index, field, value) => {
      const updated = [...childVenues];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      setChildVenues(updated);
    };

    /* ---------- SHIFT ---------- */

    const toggleShift = (index, shift) => {
      const updated = [...childVenues];

      updated[index].shifts[shift].enabled =
        !updated[index].shifts[shift].enabled;

      setChildVenues(updated);
    };

    const updateShift = (index, shift, field, value) => {
      const updated = [...childVenues];

      updated[index].shifts[shift][field] = value;

      if (field === "fromDate" && value) {
        const start = new Date(value);
        const end = new Date(start);

        end.setMonth(end.getMonth() + 19);

        updated[index].shifts[shift].endDate =
          end.toISOString().split("T")[0];
      }

      setChildVenues(updated);
    };

    /* ---------- IMAGE UPLOAD ---------- */

    const uploadImage = (index, field, files) => {
      const file = files?.[0];
      if (!file) return;

      const updated = [...childVenues];

      let progress = 0;

      const interval = setInterval(() => {
        progress += 20;

        updated[index].uploadProgress[field] = progress;

        setChildVenues([...updated]);

        if (progress >= 100) {
          clearInterval(interval);

          const url = URL.createObjectURL(file);

          if (field === "gallery") {
            updated[index].gallery.push(url);
          } else {
            updated[index][field] = url;
          }

          updated[index].uploadProgress[field] = 0;

          setChildVenues([...updated]);
        }
      }, 200);
    };

    /* ---------- REMOVE GALLERY ---------- */

    const removeGallery = (index, imgIndex) => {
      const updated = [...childVenues];

      updated[index].gallery.splice(imgIndex, 1);

      setChildVenues(updated);
    };

    return (
      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

          <div>
            <h2 className="text-xl font-semibold">
              Child Venues
            </h2>

            <p className="text-sm text-gray-500">
              Configure venue sections
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Count</span>

            <input
              type="number"
              min="1"
              value={childCount}
              onChange={(e) =>
                changeChildCount(e.target.value)
              }
              className="w-20 border border-gray-200  px-3 py-2"
            />
          </div>

        </div>

        {/* Venue Cards */}

        <AnimatePresence>

          {childVenues.map((child, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200  p-4 sm:p-6 space-y-5 shadow-sm"
            >

              {/* Header */}

              <div className="flex justify-between items-center">

                <h3 className="font-semibold">
                  {child.name ||
                    `Child Venue ${index + 1}`}
                </h3>

                {index !== 0 && (
                  <button
                    onClick={() =>
                      changeChildCount(childCount - 1)
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </div>

              {/* Name */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>

                <label className="text-sm font-medium">
                  Venue Name
                </label>

                <input
                  value={child?.name || ""}
                  maxLength={30}
                  onChange={(e) =>
                    updateField(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200  px-3 py-2 mt-1"
                />

                {child?.errors?.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {child.errors.name}
                  </p>
                )}

              </div>

              {/* Category */}

              <div>

                <label className="text-sm font-medium">
                  Category
                </label>

                <select
                  value={child?.category || ""}
                  onChange={(e) =>
                    updateField(
                      index,
                      "category",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200  px-3 py-2 mt-1"
                >

                  <option value="">Select</option>
                  <option>Banquet Hall</option>
                  <option>Resort</option>
                  <option>Farmhouse</option>

                </select>

                {child?.errors?.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {child.errors.category}
                  </p>
                )}

              </div>
              </div>

              {/* Uploads */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {["thumbnail", "banner", "gallery"].map(
                  (field) => (

                    <div key={field}>

                      <label className="text-sm capitalize">
                        {field}
                      </label>

                      <input
                        type="file"
                        onChange={(e) =>
                          uploadImage(
                            index,
                            field,
                            e.target.files
                          )
                        }
                        className="w-full border border-gray-200  p-2 mt-1"
                      />

                      {/* Progress */}

                      {child?.uploadProgress?.[field] >
                        0 && (

                        <div className="w-full bg-gray-200 h-2 rounded mt-2">

                          <div
                            style={{
                              width:
                                child.uploadProgress[
                                  field
                                ] + "%",
                            }}
                            className="bg-blue-500 h-2 rounded"
                          />

                        </div>

                      )}

                      {/* Preview */}

                      {child?.[field] &&
                        field !== "gallery" && (

                          <img
                            src={child[field]}
                            className="h-20 w-full object-cover rounded mt-2"
                          />

                        )}

                    </div>
                  )
                )}

              </div>

              {/* Gallery */}

              {child?.gallery?.length > 0 && (

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

                  {child.gallery.map((img, i) => (

                    <div key={i} className="relative">

                      <img
                        src={img}
                        className="h-20 w-full object-cover rounded"
                      />

                      <button
                        onClick={() =>
                          removeGallery(index, i)
                        }
                        className="absolute top-1 right-1 bg-white rounded p-1"
                      >
                        <X size={12} />
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {/* Shift Buttons */}

              <div className="flex flex-wrap gap-2">

                {shifts.map((shift) => {

                  const active =
                    child?.shifts?.[shift]?.enabled;

                  return (

                    <button
                      key={shift}
                      onClick={() =>
                        toggleShift(index, shift)
                      }
                      className={`px-4 py-1 rounded-full text-sm
                      ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {shift}
                    </button>

                  );

                })}

              </div>

              {/* Shift Inputs */}

              {shifts.map(
                (shift) =>
                  child?.shifts?.[shift]?.enabled && (

                    <div
                      key={shift}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded"
                    >

                      <div>

                        <input
                          type="date"
                          min={today}
                          value={
                            child.shifts[shift].fromDate
                          }
                          onChange={(e) =>
                            updateShift(
                              index,
                              shift,
                              "fromDate",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-200  px-2 py-2"
                        />

                        {child?.errors?.[
                          `${shift}_date`
                        ] && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              child.errors[
                                `${shift}_date`
                              ]
                            }
                          </p>
                        )}

                      </div>

                      <div>

                        <input
                          type="date"
                          disabled
                          value={
                            child.shifts[shift].endDate
                          }
                          className="w-fullborder border-gray-200 px-2 py-2 bg-gray-100"
                        />

                      </div>

                      <div>

                        <input
                          type="number"
                          placeholder="Amount"
                          value={
                            child.shifts[shift].amount
                          }
                          onChange={(e) =>
                            updateShift(
                              index,
                              shift,
                              "amount",
                              e.target.value
                            )
                          }
                          className="w-fullborder border-gray-200  px-2 py-2"
                        />

                        {child?.errors?.[
                          `${shift}_amount`
                        ] && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              child.errors[
                                `${shift}_amount`
                              ]
                            }
                          </p>
                        )}

                      </div>

                    </div>

                  )
              )}

            </motion.div>

          ))}

        </AnimatePresence>

      </div>
    );
  }
);

export default ChildVenueStep;
