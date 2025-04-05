"use client"

import { HandleUsers } from "@/libs/apifunctions/handleUsers"
import { useEffect, useState } from "react"
import AdminSideBar from "../components/AdminSideBar"
import AdminHeader from "../components/AdminHeader"
import CountItems from "../components/dashboard/CountsItems"
import OrderStatusPieChart from "../components/dashboard/OrderStatusPieChart"
import TopSellingItem from "../components/dashboard/TopSellingItem"
import FinanceForm from "../components/dashboard/FinanceForm"
import { getLocalDate } from "@/libs/hourFormat"
import OrdersSummary from "../components/dashboard/OrdersSummary"
import { useSession } from "next-auth/react"
import { SessionChecker } from "@/libs/sessionChecker"
import { useRouter} from "next/navigation"
import { redirect } from "next/navigation"
// import CustomerListElement from "../components/customers/CustomerListElement"

export default function AdminDashboardPage() {
    const [countsData,setCountsData] = useState({})
    const [orderOverview,setOrderOverview] = useState({})
    const [topSellingItems,setTopSellingItems] = useState([])
    const router = useRouter();
    const [permission, setPermission] = useState(null); // Initialize as null for better state tracking
    const {data:session,status} = useSession()
    useEffect(() => {
        async function GetDashboardData() {
            const count_res = await HandleUsers({ mode: "get", item_type: "dashboard_summary", data: {} });
            // const orderOverview_res = await HandleUsers({ mode: "get", item_type: "order_overview", data: {} });
            const orderOverview_res = await HandleUsers({ mode: "get", item_type: "today_orders_status", data: {OrderDate:getLocalDate()} });
            const top_selling_res = await HandleUsers({ mode: "get", item_type: "top_selling_item", data: {} });
            setOrderOverview(orderOverview_res[0])
            setCountsData(count_res[0]);  // Set the first object
            setTopSellingItems(top_selling_res)
            
            // console.log({ orderOverview_res });
        }
        GetDashboardData();
    }, []);
       useEffect(() => {
            if (status === "loading") return; // Wait until session is loaded
    
            // If session is not available or user is a customer, redirect immediately
            if (!session || session?.user?.role === "Customer") {
                redirect("/");
                return;
            }
            setPermission(true)
            // async function GetSessionCheck() {
            //     const hasPermission = await SessionChecker(session, "/admin/dashboard");
            //     // console.log({ hasPermission });
            //     setPermission(hasPermission);
            //     if (!hasPermission) {
            //         redirect("/login");
            //     }
            // }
    
            // GetSessionCheck();
        }, [session, status, router]);
 
        if (status === "loading" || permission === null) {
          return (
              <div className="flex justify-center items-center h-screen text-2xl">
                  Loading...
              </div>
          );
      }


  return (
    <div>
      <div className="relative w-[100vw] h-[100vh] flex ">
        <div className="w-[15%] h-full flex justify-center">
          <AdminSideBar AdminOption={"dashboard"} />
        </div>
        <div className="w-[85%] h-full flex flex-col gap-2 ">
          <AdminHeader showSearch={false} headlingLabel={"Admin Dashboard"} />

          <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll bg-gray-100 no-scrollbar flex flex-col p-4">
            
                {/* {Object?.entries(countsData).map(([key, value],index) => (
                    <CountItems key={key} name={key.replace(/([A-Z])/g, " $1").trim()} count={value} icon={index} />
                ))} */}
                <div className="flex justify-between items-center gap-2 p-4 text-zinc-600">
                    <div className="flex flex-col">
                      <span className="text-4xl font-bold">Hello, {session?.user?.name}!</span>
                      <span className="font-semibold">{session?.user?.email}</span>
                  </div>
                  {/* <span className="text-4xl font-bold">You have {session?.user?.role}!</span> */}

                </div>
                

           
            <div className="w-full p-4 flex gap-8 flex-col">
                    <h2 className="text-xl font-semibold mb-4 pb-2 ">Order Status Overview</h2>
                  
                      <div className="w-[95%] ">
                        <OrdersSummary data={orderOverview} />

                      </div>
                    
                        <div className="w-[95%] flex rounded-xl bg-white p-4">
                            <h2 className="text-xl h-full  w-[15%] font-semibold mb-4 pb-2 ">Order Analytics</h2>
                            <div className="w-[85%] py-12">
                                {countsData && <OrderStatusPieChart ordersSummary={orderOverview} />}
                            </div>
                        </div>
                 
            </div>
            <div className="flex ">
            {/* <div className="w-1/3 flex flex-col gap-2 p-4"> */}
            {/* <h2 className="text-xl font-semibold mb-4"> Top Selling Items</h2>

                {topSellingItems.map((item,index)=>(
                    <TopSellingItem key={index} item={item} index={index+1}/>
                ))} */}
            {/* </div> */}

            
            </div>

                {/* <pre>{JSON.stringify(topSellingItems,null,2)}</pre> */}
          </div>
        </div>
      </div>
    </div>
  )
}
