import { useSession, signOut } from "next-auth/react";
import { FaUser, FaBox, FaCalendarAlt, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserBox() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const paths = [
    { title: "My Account", path: `/customer/dashboard`, icon: <FaUser /> },
    { title: "My Orders", path: `/customer/dashboard`, icon: <FaBox /> },
    { title: "My Reservations", path: `/customer/dashboard`, icon: <FaCalendarAlt /> },
  ];

  const login_paths = [
    { title: "My Account", path: `/login`, icon: <FaUser /> },
    { title: "My Orders", path: `/login`, icon: <FaBox /> },
    { title: "My Reservations", path: `/login`, icon: <FaCalendarAlt /> },
  ];

  const admin_paths = [
    { title: "Admin Dashboard", path: `/admin/dashboard`, icon: <FaUser /> },
  ];

  return (
    <div className="lg:absolute top-[60px] mx-auto w-[300px] xl:w-[320px] right-3 
    lg:h-[60vh] xl:h-[500px] bg-white 
    lg:right-0 font-serif overflow-hidden rounded-xl border border-slate-200 shadow-2xl">
      
      {/* Header */}
      <div className="w-full h-[100px] xl:h-[25%] flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100 text-black rounded-t-xl">
        <span className="w-[40px] h-[8px] rounded-lg bg-orange-400 opacity-50"></span>
        {status === "authenticated" ? (
          <>
            <span className="text-[14px] lg:text-[18px] xl:text-[22px] font-semibold">{session.user.name}</span>
            <span className="text-[12px] lg:text-[12px] xl:text-[16px] font-light">{session.user.email}</span>
          </>
        ) : (
          <span className="text-[22px] font-semibold">Welcome</span>
        )}
      </div>

      {/* Menu List */}
      <div className="w-[90%] mx-auto lg:h-[75%] h-[80%] bg-white flex flex-col lg:gap-4 gap-1 text-[12px] lg:text-[16px] xl:text-[18px] font-semibold text-gray-700 overflow-y-scroll no-scrollbar py-4">
        
        {/* Customer Paths */}
        {session?.user?.role === "customer" &&
          paths.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-orange-100 transition duration-200 w-full text-left"
            >
              <div className="flex lg:gap-4 gap-2 items-center">
                <span className="text-orange-500">{item.icon}</span>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
          ))}

        {/* Admin Paths */}
        { session && session?.user?.role !== "customer" &&
          admin_paths.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-orange-100 transition duration-200 w-full text-left"
            >
              <div className="flex lg:gap-4 gap-2 items-center">
                <span className="text-orange-500">{item.icon}</span>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
          ))}

        {/* Login Paths */}
        {!session &&
          login_paths.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-orange-100 transition duration-200 w-full text-left"
            >
              <div className="flex lg:gap-4 gap-2 items-center">
                <span className="text-orange-500">{item.icon}</span>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
          ))}

        {/* Login / Logout Button */}
        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="mt-auto flex justify-between items-center lg:p-3 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 w-full text-left"
          >
            <div className="flex gap-4 items-center">
              <FaSignOutAlt />
              <span>Sign Out</span>
            </div>
            <FaChevronRight />
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="mt-auto flex justify-between items-center p-3 rounded-lg bg-orange-500 text-white hover:bg-orange-400 transition duration-200 w-full text-left"
          >
            <div className="flex gap-4 items-center">
              <FaUser />
              <span>Login</span>
            </div>
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
