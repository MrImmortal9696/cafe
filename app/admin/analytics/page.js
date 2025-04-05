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
import TopCategoryCount from "../components/dashboard/TopCategoryCount"
import OrderModeCount from "../components/dashboard/OrderModesCount"
import { BarChartOrderHourly } from "../components/dashboard/BarChartOrderHourly"
import { SessionChecker } from "@/libs/sessionChecker"
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
// import CustomerListElement from "../components/customers/CustomerListElement"

export default function AdminAnalyticsPage() {
    const [DashboardSummaryMonthly, setDashboardSummaryMonthly] = useState([]);
    const [monthlyOrderOverview, setMonthlyOrderOverview] = useState([]);
    const [ordersTimeTrendsMonthly, setOrderTimeTrendsMonthly] = useState([]);
    const [monthlyCategoryOverview, setMonthlyCategoryOverview] = useState([]);
    const [monthlyTopSellingItems, setMonthlyTopSellingItems] = useState([]);
    const [monthlyOrderModeAnalytics, setMonthlyOrderModeAnalytics] = useState([]);

    const {data:session,status} = useSession()
    const router = useRouter();
    const [permission, setPermission] = useState(null); // Initialize as null for better state tracking
    const [currentFilter,setCurrentFilter] = useState("Total")
    const [dataFetched, setDataFetched] = useState(false);


    const [monthsArray,setMonthsArray] = useState([])
    useEffect(() => {
        if (status === "loading") return; // Wait until session is loaded

        // If session is not available or user is a customer, redirect immediately
        if (!session || session?.user?.role === "Customer" ) {
            redirect("/");
            return;
        }

        async function GetSessionCheck() {
            const hasPermission = await SessionChecker(session, "/admin/orders");
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
            try {
                const responses = await Promise.all([
                    HandleUsers({ mode: "get", item_type: "dashboard_summary_monthly", data: {} }),
                    HandleUsers({ mode: "get", item_type: "order_overview_monthly", data: {} }),
                    HandleUsers({ mode: "get", item_type: "order_trends_time_monthly", data: {} }),
                    HandleUsers({ mode: "get", item_type: "monthly_categories_overview", data: {} }),
                    HandleUsers({ mode: "get", item_type: "top_selling_monthly", data: {} }),
                    HandleUsers({ mode: "get", item_type: "monthly_orderMode_analytics", data: {} })
                ]);
    
                // Correct indexing of responses
                setDashboardSummaryMonthly(responses[0] || []);
                setMonthlyOrderOverview(responses[1] || []);
                setOrderTimeTrendsMonthly(responses[2] || []);
                setMonthlyCategoryOverview(responses[3] || []);
                setMonthlyTopSellingItems(responses[4] || []);
                setMonthlyOrderModeAnalytics(responses[5] || []);
    
                setDataFetched(true); // Mark data as fetched
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        }
    
        if (session && permission && !dataFetched) {
            GetDashboardData();
        }
    }, [session, permission, dataFetched]); // Track dataFetched to prevent repeat calls
    
        useEffect(() => {
            function GetMonths() {
                const data = new Set();
                DashboardSummaryMonthly.forEach((item) => {
                    data.add(item.Month); // ✅ Correct: Adds only the month string
                });
                setMonthsArray(Array.from(data)); // Convert Set to array
            }
        
            if (DashboardSummaryMonthly.length > 0) {
                GetMonths();
            }
        }, [DashboardSummaryMonthly]);
        

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

        const titles = [
            "Total Base Revenue",
            "Total Tax Collected",
            "Total Revenue",
        ];
        

  return (
    <div>
      <div className="relative w-[100vw] h-[100vh] flex ">
        <div className="w-[15%] h-full flex justify-center">
          <AdminSideBar AdminOption={"analytics"} />
        </div>
        <div className="w-[85%] h-full flex flex-col  ">
          <AdminHeader showSearch={false} headlingLabel={"Analytics "} />
          
          
          <div className="mt-4 pt-4 bg-zinc-100  flex justify-end items-center px-8 ">
                {/* <label htmlFor="filterDropdown" className=" font-semibold mr-2 text-lg">Month:</label> */}
                <div className="bg-white flex border rounded-lg items-center  px-2">
                    <span className="text-lg "><IoCalendarOutline/></span>
                    <select
                        id="filterDropdown"
                        className=" focus:outline-none p-3 font-semibold "
                        value={currentFilter}
                        onChange={(e) => setCurrentFilter(e.target.value)}
                    >
                        {monthsArray?.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                {/* <pre>{JSON.stringify(ordersTimeTrendsMonthly,null,2)}</pre> */}
            </div>

          <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll no-scrollbar bg-zinc-100 flex flex-col gap-8 p-4">

          <div className="grid grid-cols-5 gap-8 px-4">
                {DashboardSummaryMonthly
                    .filter((item) => item.Month === currentFilter) // Compare Month with currentFilter
                    .map((filteredItem) => 
                        Object.entries(filteredItem)
                            .filter(([key]) => key !== "Month") // Exclude the Month key
                            .map(([key, value], index) => ( // Get index from Object.entries()
                                <CountItems 
                                    key={key} 
                                    name={key.replace(/([A-Z])/g, " $1").trim()} 
                                    count={value} 
                                    icon={index} // Pass the index here
                                />
                            ))
                    )}
            </div>


            {/* <div></div> */}
           
            <div className="w-full p-4 flex gap-8 ">
                <div className="w-2/5 rounded-xl overflow-hidden bg-white p-4 h-full">
                    <h2 className="text-xl font-semibold py-6 ">Order Status Overview</h2>

                    <div>
                        {monthlyOrderOverview
                            .filter((item) => item.Month === currentFilter) // Filter based on selected month
                            .map((filteredItem) =>
                                Object.entries(filteredItem)
                                    .filter(([key]) => key !== "Month") // Exclude the Month key
                                    .map(([key, value], index) => {
                                        const formattedKey = key.replace(/([A-Z])/g, " $1").trim();
                                        return (
                                            <div key={index} className="grid grid-cols-2 items-center text-lg font-semibold">
                                                <span className="p-2">{formattedKey}</span>
                                                <span className="text-center">
                                                    {titles.includes(formattedKey) ? `£ ${value}` : value}
                                                </span>
                                            </div>
                                        );
                                    })
                            )}
                    </div>
                    </div>

                        {/* <OrdersSummary data={orderOverview} /> */}
                    <div className="w-3/5  p-4 pb-6 bg-white rounded-lg">
                        <h2 className="text-xl font-semibold py-6 ">Order Analytics</h2>
                        <div className="">
                                <div>
                                    {monthlyOrderOverview && (
                                            monthlyOrderOverview
                                                .filter((item) => item.Month === currentFilter) // Filter based on selected month
                                                .map((filteredItem, index) => (
                                                    <OrderStatusPieChart key={index} ordersSummary={filteredItem} />
                                                ))
                                        )}
                                </div>
                        </div>
                    </div>    
            </div>
            <div className="flex flex-wrap gap-8">
            
                <div className="w-full flex flex-col  gap-2 p-4 mx-4 rounded-lg pb-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4 pt-6"> Top Selling Items</h2>
                    <div className="grid grid-cols-5 gap-4">
                        {monthlyTopSellingItems
                            .filter((item) => item.Month === currentFilter) // Filter by selected month
                            .map((item, index) => (
                                <TopSellingItem key={item.ItemID} item={item} index={index + 1} />
                            ))}
                    </div>

                </div>
                <div className="w-full bg-white p-4 mx-4  rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 pt-6"> Hour vs Revenue Graph</h2>
                    <BarChartOrderHourly data={ordersTimeTrendsMonthly.filter((item)=>item.Month===currentFilter)}/>
                </div>
                <div className="w-full flex gap-8 mx-4 ">
                    <div className="rounded-xl bg-white p-6">
                        <h2 className="text-xl font-semibold mb-4"> Top Selling Categories</h2>
                        <TopCategoryCount 
                            categoryOrderCounts={monthlyCategoryOverview.filter((item) => item.Month === currentFilter)} 
                        />

                    </div>
                    <div className="rounded-xl bg-white p-6">
                        <h2 className="text-xl font-semibold mb-4"> Order Modes</h2>
                        <OrderModeCount orderModeAnalytics={monthlyOrderModeAnalytics.filter((item)=>item.Month === currentFilter)} />
                    </div>
                </div>
                
            </div>

                {/* <pre>{JSON.stringify(topSellingItems,null,2)}</pre> */}
          </div>
        </div>
      </div>
    </div>
  )
}
