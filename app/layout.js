"use client";

import { useState , useEffect} from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import Header from "@/components/Header";
import Login from "@/app/login/page";
import PageTransition from "@/components/PageTransition";

import useDataStore from "@/store/useDataStore"; //data sore
import { Toaster } from "react-hot-toast";
import NotificationProvider from "@/components/notifications/NotificationProvider";

// import { SocketProvider } from "@/context/SocketContext";
// import { useSocket } from "@/context/SocketContext";

import "./globals.css";

// export const metadata = {
//   title: {
//     default: "VenueBook",
//     template: "%s | VenueBook",
//   },
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

export default function RootLayout({ children }) {

  
// const socket = useSocket();

// useEffect(() => {
//   if (!socket) return;

//   socket.on("onlineUsers", (count) => {
//     console.log("🟢 Online:", count);
//   });
// }, [socket]);
  
  const data = useDataStore((state) => state.data);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

   const [country, setCountry] = useState(null);
  const [venues, setVenues] = useState([]);

  //const user = localStorage.getItem("auth");

useEffect(() => {
  const auth = localStorage.getItem("auth");
  setUser(auth === "true");
}, []);

    const handleCountrySelect = async (countryObj) => {
    setCountry(countryObj);

    // API call in layout
    //const res = await api.get(`/venues?country=${countryObj.code}`);
    //setVenues(res.data);

    console.log("Selected country:", countryObj);

   //  alert('----- '+countryObj.symbol)
  };

// ⏳ prevent flicker

  return (
    <html lang="en">
      <body className="bg-[#f4f6f8] overflow-hidden">

        {/* ⏳ loading */}
        {user === null && null}

        {/* ❌ Not Logged In */}
        {user === false && <Login />}

        {/* ✅ Logged In */}
        {user === true && (
       
          <div className="flex h-screen">
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            {/* Mobile Sidebar */}
            <Sidebar mobile open={open} setOpen={setOpen} />

            {/* MAIN CONTENT */}
            <div className="flex flex-col flex-1 overflow-hidden">

              {/* Mobile Header */}
              <div className="md:hidden">
                <MobileHeader setOpen={setOpen} />
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block">
                <Header collapsed={collapsed}   
                onSelectCountry={handleCountrySelect}
                data={data}/>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto">
                <PageTransition>
                  <NotificationProvider>
                  {/* <SocketProvider> */}
                  <div className="p-4 md:p-6">
                    {children}
                  </div>
                 {/* </SocketProvider> */}
                 </NotificationProvider>
                </PageTransition>
              </div>

            </div>
            <Toaster position="top-right" />
          </div>
 )}
      </body>
    </html>
  );
}