"use client";
import { BsInboxes } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useCart } from "@/app/contexts/CartContext";
import Logo from "../../../public/NewLogo.svg"
import Image from "next/image";
import Link from "next/link";

export default function AdminSideBar({ AdminOption }) {
  const [loading, setLoading] = useState(false);
  const [allowedPaths, setAllowedPaths] = useState([]); // State to store allowed paths
  const router = useRouter();
  const { data: session } = useSession();
  const { pendingOrders,ongoingReservations } = useCart();

  const dashboardData = [
    { title: "Dashboard", icon: <BsInboxes />, qty: null, path: "dashboard" },
    { title: "Orders", icon: <BsInboxes />, qty: pendingOrders, path: "orders" },
    { title: "Menus", icon: <BsInboxes />, qty: null, path: "menus" },
    { title: "Reservations", icon: <BsInboxes />, qty: ongoingReservations, path: "reservations" },
    { title: "Customers", icon: <BsInboxes />, qty: null, path: "customers" },
    { title: "Analytics", icon: <BsInboxes />, qty: null, path: "analytics" },
    { title: "Users", icon: <BsInboxes />, qty: null, path: "users" },
    { title: "Finance", icon: <BsInboxes />, qty: null, path: "finance" },
    { title: "Gallery", icon: <BsInboxes />, qty: null, path: "gallery" },

  ];

  const handleRedirect = async (path) => {
    setLoading(true);
    router.push(`/admin/${path}`);
  };

  useEffect(() => {
    async function GetUserPermissionPaths() {
      try {
        const res = await HandleUsers({
          mode: "get",
          item_type: "user_permissions",
          data: { Email: session.user.email },
        });

        const allowedPaths = res?.map((permission) => permission.pathName) || [];

        // Ensure "Dashboard" is always included
        const filteredDashboardData = dashboardData.filter(
          (item) => item.path === "dashboard" || allowedPaths.includes(`/admin/${item.path}`)
        );

        setAllowedPaths(filteredDashboardData);
      } catch (error) {
        console.log("Error fetching user permissions:", error);
      }
    }

    if (session?.user?.email) {
      GetUserPermissionPaths();
    }
  }, [session]);

  return (
    <div className="h-full w-full bg-white shadow-lg py-6 relative">
      {/* Header */}
      <Link href={'/'} className="flex-center overflow-hidden">
           <Image src={Logo} alt="Logo" width={100} height={100} className="xl:w-[180px] lg:w-[150px] w-[70px]" />
      </Link>

      {/* Navigation Items */}
      <div className="mt-4">
        {allowedPaths.map((item, index) => (
          <div
            key={index}
            onClick={() => handleRedirect(item.path)}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[18px] font-medium ${
              AdminOption === item.title.toLowerCase()
                ? "bg-orange-100 text-orange-500 border-l-4 border-orange-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-current={AdminOption === item.title.toLowerCase() ? "page" : undefined}
          >
            <div className="flex items-center space-x-3">
              <span className="text-[20px]">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            {item.qty != null && (
              <span className="text-white bg-orange-500 rounded-full text-[12px] font-semibold px-3 py-2">
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
