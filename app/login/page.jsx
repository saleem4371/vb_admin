"use client";

import { useState ,useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import useDataStore from "@/store/useDataStore"; //store
// import { connectSocket } from "@/lib/socket";

export default function LoginPage() {
  const setData = useDataStore((state) => state.setData);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

   const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth === "true") {
      router.replace("/dashboard");
    } else {
      setCheckingAuth(false); // ✅ show login
    }
  }, []);

  // ⏳ Prevent blank flicker
  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

 

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://websockettest.venuebook.in:5000/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }


      setData({
        name:data.user.name,
        email:data.user.email,
        id:data.user.id,
        logo:data.user.logo
      }); //Data store to local

      toast.success("Login successful 🎉");
       localStorage.setItem("token", data.token);
       localStorage.setItem("user_id",data.user.id);
      //  connectSocket(data.user.id);// socket
       localStorage.setItem("auth", "true");
       window.location.href = "/dashboard";


       
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT */}
      <div className="hidden md:block w-2/3 bg-black relative">
        <Image
          src="https://beta.venuebook.in/img/Mangaluru.268c4f41.jpg"
          alt="bg"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <h2 className="text-4xl font-semibold leading-snug">
            Join <span className="text-green-400">8 Million+</span> businesses
          </h2>

          <p className="mt-3 text-gray-300 text-sm">
            Supercharge your payments with powerful tools and seamless integrations.
          </p>

          <div className="flex gap-6 mt-6 text-sm text-gray-200">
            <span>✔ 100+ Methods</span>
            <span>✔ Easy Setup</span>
            <span>✔ Smart Dashboard</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg border">

          {/* LOGO */}
          <Image
            src="https://beta.venuebook.in/img/logo.490f6c58.svg"
            alt="logo"
            width={140}
            height={40}
          />

          <p className="text-gray-500 mt-3 mb-6">
            Login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            {/* EMAIL */}
            <div>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none transition
                  ${errors.email 
                    ? "border-red-500 focus:ring-red-500" 
                    : "focus:ring-2 focus:ring-blue-500"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none transition
                    ${errors.password 
                      ? "border-red-500 focus:ring-red-500" 
                      : "focus:ring-2 focus:ring-blue-500"
                    }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}