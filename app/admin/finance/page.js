"use client"

import { HandleUsers } from "@/libs/apifunctions/handleUsers"
import { useEffect, useState } from "react"
import AdminSideBar from "../components/AdminSideBar"
import AdminHeader from "../components/AdminHeader"
import CountItems from "../components/dashboard/CountsItems"
import OrderStatusPieChart from "../components/dashboard/OrderStatusPieChart"
import TopSellingItem from "../components/dashboard/TopSellingItem"
import FinanceForm from "../components/dashboard/FinanceForm"
import TaxesFinanceForm from "../components/dashboard/TaxesFinanceForm"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { SessionChecker } from "@/libs/sessionChecker"
// import CustomerListElement from "../components/customers/CustomerListElement"

export default function AdminFinancePage() {
    const [countsData,setCountsData] = useState({})
    const [orderOverview,setOrderOverview] = useState({})
    const [topSellingItems,setTopSellingItems] = useState([])
    const{data:session,status} = useSession()
    const router = useRouter()
    const [permission, setPermission] = useState(null); // Initialize as null for better state tracking
    

        useEffect(() => {
            if (status === "loading") return; // Wait until session is loaded
    
            // If session is not available or user is a customer, redirect immediately
            if (!session || session?.user?.role === "Customer") {
                redirect("/");
                return;
            }
    
            async function GetSessionCheck() {
                const hasPermission = await SessionChecker(session, "/admin/finance");
                // console.log({ hasPermission });
                setPermission(hasPermission);
                if (!hasPermission) {
                    redirect("/");
                }
            }
    
            GetSessionCheck();
        }, [session, status, router]);

    useEffect(() => {
        async function GetDashboardData() {
            const count_res = await HandleUsers({ mode: "get", item_type: "dashboard_summary", data: {} });
            const orderOverview_res = await HandleUsers({ mode: "get", item_type: "order_overview", data: {} });
            const top_selling_res = await HandleUsers({ mode: "get", item_type: "top_selling_item", data: {} });
            setOrderOverview(orderOverview_res[0])
            setCountsData(count_res[0]);  // Set the first object
            setTopSellingItems(top_selling_res)
            
            console.log({ count_res });
        }
        if(session && permission){
            GetDashboardData()
        }
    }, [session,permission]);
    
    if (status === "loading" || permission === null) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl">
                Loading...
            </div>
        );
    }

    // Prevent rendering if the user does not have access
    if (!session || !permission) {
        return null; // Render nothing while redirecting
    }
    

  return (
    <div>
      <div className="relative w-[100vw] h-[100vh] flex ">
        <div className="w-[15%] h-full flex justify-center">
          <AdminSideBar AdminOption={"finance"} />
        </div>
        <div className="w-[85%] h-full flex flex-col gap-2 ">
            <AdminHeader showSearch={false} headlingLabel={"Finance"} />
          

          <div className="w-full   h-[calc(100vh-100px)] overflow-y-scroll no-scrollbar bg-zinc-100 flex flex-col justify-start gap-8 p-8">

            <FinanceForm 
            financeData={{
                TaxPercent: 10,
                LoyaltyPointsPercentage: 5,
                LoyaltyRedeemingRequirement: 100,
                TableReservationFee: 50,
                }}/>
      
            <TaxesFinanceForm/>
     
            </div>

                {/* <pre>{JSON.stringify(topSellingItems,null,2)}</pre> */}
          </div>
        </div>
     
    </div>
  )
}
