"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
// import BackButton from "@/components/BackButton";

export default function VenueDetails() {
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);
  const [publish, setPublish] = useState(true);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    tg: "",
    evnt_tg: "",
  });

  const [gallery, setGallery] = useState([]);
  const [errors, setErrors] = useState({});

  const [imageSelections, setImageSelections] = useState([]);

  const [eventTags, setEventTags] = useState([]);
  const [venueTags, setVenueTags] = useState([]);
  //eventOptions venueOptions
  const [eventOptions, setEventOptions] = useState([]);
  const [venueOptions, setVenueOptions] = useState([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://websockettest.venuebook.in:5000/admin/single_unregister_data",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          },
        );

        const data = await res.json();

        if (data?.results) {
          setForm({
            name: data.results.name || "",
            city: data.results.city || "",
            address: data.results.address || "",
            phone: data.results.phone_number || "",
            tg: data.results.types || "",
            evnt_tg: data.results.event_tags || "",
          });

          setVenueOptions(data.event_tg);
          setEventOptions(data.venue_tg);

          // setEventTags(data.venue_tg);
          // setVenueTags(data.event_tg);

          setEventTags(Array.isArray(data.venue_tg) ? data.venue_tg : []);
          setVenueTags(Array.isArray(data.event_tg) ? data.event_tg : []);

          try {
            const parsedGallery =
              typeof data.results.gallery === "string"
                ? JSON.parse(data.results.gallery)
                : data.results.gallery;

            const safeGallery = Array.isArray(parsedGallery)
              ? parsedGallery
              : [];

            setGallery(safeGallery);


            setImageSelections(safeGallery);

            console.log("Formatted Images:", safeGallery);
          } catch (err) {
            console.error("Gallery parse error:", err);
            setGallery([]);
            setImageSelections([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= LIVE VALIDATION ================= */

  const validateField = (name, value) => {
    let message = "";

    if (!value.trim()) {
      message = "This field is required";
    }

    if (name === "phone" && value) {
      if (!/^[0-9]{10}$/.test(value)) {
        message = "Enter valid 10 digit number";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  /* ================= SAMPLE OPTIONS ================= */
  // const eventOptions = eventTags;

  // const venueOptions = venueTags;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    let newErrors = {};

    Object.keys(form).forEach((key) => {
      if (!form[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const selectedGallery = imageSelections
      .filter((img) => img[1])
      .map((img) => img[0]);

    const param = {
      id,
      form,
      gallery: imageSelections,
      eventTags,
      venueTags,
      publish,
    };

    try {
      setLoadings(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/update_unreg_data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(param),
        },
      );

      await res.json();

      alert("Updated successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadings(false);
    }
  };
  /* ================= IMAGE SELECT ================= */
  /* ================= INIT IMAGE SELECTION ================= */

  useEffect(() => {
    if (gallery.length > 0) {
      const formatted = gallery.map((img) => [img[0], false]);
      setImageSelections(formatted);
    }
  }, [gallery]);

  /* ================= IMAGE SELECT ================= */

  const toggleImage = (url) => {
    const updated = imageSelections.map((img) =>
      img[0] === url ? [img[0], !img[1]] : img,
    );

    setImageSelections(updated);
    // toast.success("Image selection updated");
  };

  const selectAllImages = (e) => {
    const checked = e.target.checked;

    const updated = imageSelections.map((img) => [img[0], checked]);

    setImageSelections(updated);

    //  toast.success(
    //    checked ? "All images selected" : "All images deselected"
    //  );
  };

  const selectedImages = imageSelections.filter((img) => img[1]);
  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen  p-0 space-y-6">
      {/* <BackButton/> */}
      {/* ================= VENUE DETAILS ================= */}
      <div className="bg-white  shadow p-8 space-y-6 mb-2">
        <h2 className="text-2xl font-semibold">Venue Details</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Input
            label="Parent Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
          />

          <Input
            label="Mobile"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <MultiSelect
            label="Event Tags"
            options={eventOptions}
            selected={eventTags}
            setSelected={setEventTags}
          />

          <MultiSelect
            label="Venue Tags"
            options={venueOptions}
            selected={venueTags}
            setSelected={setVenueTags}
          />
        </div>

        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
        />
      </div>

      {/* ================= GALLERY SECTION ================= */}
      <div className="bg-white shadow-sm p-8 space-y-6 mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Gallery</h2>

          {gallery.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={
                  imageSelections.length > 0 &&
                  imageSelections.every((img) => img[1])
                }
                onChange={selectAllImages}
              />
              Select All
            </label>
          )}
        </div>

        {gallery.length === 0 && (
          <div className="flex items-center justify-center py-14 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-400 text-sm">No images available</p>
          </div>
        )}

        {/* GRID */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {gallery.map((img, index) => {
            const imageUrl = img[0];

            const isSelected = imageSelections.find(
              (item) => item[0] === imageUrl,
            )?.[1];

            return (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <img
                  src={imageUrl}
                  alt="gallery"
                  className="w-full h-40 object-cover"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition duration-200" />

                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={isSelected || false}
                    onChange={() => toggleImage(imageUrl)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {errors.gallery && (
          <p className="text-red-500 text-sm">{errors.gallery}</p>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="bg-white  shadow-sm p-6 flex items-center justify-between sticky bottom-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Publish</span>
          <button
            onClick={() => setPublish(!publish)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer  ${
              publish ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                publish ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer "
        >
          {loadings ? "Updating..." : "Update Changes"}
        </button>
      </div>
    </div>
  );
}
/* ================= MULTI SELECT ================= */

function MultiSelect({ label, options, selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleOption = (option) => {
    const exists = selected.find((item) => item.id === option.id);

    if (exists) {
      setSelected(selected.filter((i) => i.id !== option.id));
    } else {
      setSelected([...selected, option]);
    }
  };

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-2 relative" ref={ref}>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-200 rounded-xl p-2 min-h-[48px] flex flex-wrap gap-2 cursor-pointer bg-white"
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Select {label}</span>
        )}

        {selected.map((item) => (
          <span
            key={item.id}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
          >
            {item.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(selected.filter((i) => i.id !== item.id));
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-20">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.map((option) => {
              const checked = selected.some((item) => item.id === option.id);

              return (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{option.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({ label, name, value, onChange, error }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type="text"
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
