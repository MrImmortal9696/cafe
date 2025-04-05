"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/landing/Header";
import AdminHeader from "../../admin/components/AdminHeader";
import SideBarDashboard from "../../components/dashboard/SideBarDashboard";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import CustomerDashboardHeader from "./components/CustomerDashboardHeader";
import CustomerDetails from "./components/CustomerDetails";
import CustomerOrdersSection from "./components/CustomerOrdersSection";
import CustomerReservationSection from "./components/CustomerReservationSection";

export default function DashboardPage() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [customerData, setCustomerData] = useState([]);
  const [currentSection, setCurrentSection] = useState("account");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthorized users
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "customer") {
      router.push("/");
    }
  }, [session, status, router]);



  useEffect(() => {
    async function GetCustomerDashboardData() {
      if (!session?.user?.email) return;
      const res = await HandleUsers({
        mode: "get",
        item_type: "customer_dashboard",
        data: { CustomerEmail: session.user.email }
      });
      setCustomerData(res[0]?.CustomerData || {});
    }

    if (session?.user) {
      GetCustomerDashboardData();
    }
  }, [session]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  if (status === "loading" ) {
    return (
        <div className="flex justify-center items-center h-screen text-2xl">
            Loading...
        </div>
    );
}

  return (
    <div className="relative w-[100vw] lg:h-[100vh] h-full flex flex-col">
      <div className={`z-10 w-full ${isScrolled ? "top-0" : "top-4"} transition-all duration-300`}>
        <Header isScrolled={isScrolled} />
      </div>

      <div className="flex lg:h-[calc(100vh-100px)] h-full overflow-scroll no-scrollbar">
        {/* Sidebar */}
        <div className={`lg:visible hidden relative lg:flex items-center h-full bg-white transition-all duration-500 ease-in-out ${showSideBar ? "lg:w-[15%] w-[90%]" : "w-0"}`}>
          <div className={`relative h-[90%] flex justify-center transition-all ${showSideBar ? "w-full" : "w-0"}`}>
            <SideBarDashboard CustomerOption="dashboard" currentSection={currentSection} setCurrentSection={setCurrentSection} customerDetails={session?.user} />
            <div className={`absolute transition-all duration-500 ease-in-out top-0 ${!showSideBar ? "-right-[50px]" : "right-[0px] rounded-lg"} w-[50px] h-[50px] flex-center text-[30px] bg-white rounded-r-lg`}>
              <button onClick={() => setShowSideBar((prev) => !prev)}>
                {showSideBar ? <GoSidebarExpand /> : <GoSidebarCollapse />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex items-center flex-col transition-all duration-600 ease-in-out w-[90%] mx-auto">
          <CustomerDashboardHeader 
            loyaltyPoints={customerData?.CustomerDetails?.LoyaltyPoints}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            walletBalance={customerData?.CustomerDetails?.WalletBalance}
          />
          <div className="h-[calc(100vh-100px)] w-full overflow-scroll no-scrollbar bg-zinc-50 p-2 rounded-xl">
            {currentSection === "account" && customerData && (
              <CustomerDetails 
                customer={customerData?.CustomerDetails}
                setCustomerData={setCustomerData}
                recentOrders={customerData?.Orders?.slice(-5).reverse()}
                recentReservations={customerData?.Reservations?.slice(-5).reverse()} 
              />
            )}
            {currentSection === "orders" && customerData && (
              <CustomerOrdersSection orders={customerData?.Orders} />
            )}
            {currentSection === "reservations" && customerData && (
              <CustomerReservationSection reservations={customerData?.Reservations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
