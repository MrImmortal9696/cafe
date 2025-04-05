"use client";
import { BsInboxes } from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SideBarDashboard({ 
    currentSection,
    setCurrentSection,
    Option,
    customerDetails={name:"Tanmay",email:"tnmpant02@gmail.com"}
 }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dashboardData = [
    { title: "My Account", icon: <BsInboxes />, qty: null, path: "account" },
    { title: "Orders", icon: <BsInboxes />, qty:null, path: "orders" },
    { title: "Reservations", icon: <BsInboxes />, qty: null, path: "reservations" },
    // { title: "Settings", icon: <BsInboxes />, qty: null, path: "settings" },

  ];

  const handleRedirect = async (path) => {
    setCurrentSection(path)

  };

  return (
    <div className="h-full w-full bg-white  relative overflow-hidden rounded-br-xl">
      {/* Header */}
      <div className="text-[24px] flex-center flex-col font-bold py-6 px-4 text-orange-800">
        <div className="w-[100px] h-[100px] rounded-full bg-orange-100 flex-center">
                <span className="text-[40px] ">{customerDetails.name[0]}</span>
        </div>
        <div className="flex-center p-4 flex-col text-[12px] text-black">
            <span className="text-lg">{customerDetails.name}</span>
            <span>{customerDetails.email}</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="mt-4">
        {dashboardData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleRedirect(item.path)}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[18px] font-medium ${
              Option === item.title.toLowerCase()
                ? "bg-orange-100 text-orange-500 border-l-4 border-orange-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-current={Option === item.title.toLowerCase() ? "page" : undefined}
          >
            <div className="flex items-center space-x-3">
              <span className="text-[20px]">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            {item.qty != null && (
              <span className="text-white bg-orange-500 rounded-full text-[12px] px-2 py-1">
                {item.qty}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
