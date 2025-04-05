"use client";
import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSideBar from "../components/AdminSideBar";
import OrderFilters from "../components/orders/orderFilters";
import OrdersList from "../components/orders/OrdersList";
import OrdersPagination from "../components/orders/OrdersPagination";
import { GetOrders } from "@/libs/apifunctions/handleOrders";
import { convertTo24Hour } from "@/libs/hourFormat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { SessionChecker } from "@/libs/sessionChecker";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";

export default function OrdersPage() {
    const [ordersData, setOrdersData] = useState([]);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [permission, setPermission] = useState(null); // Initialize as null for better state tracking
    const [searchItem,setSearchItem] = useState("")
    const [newOrdersData,setNewOrdersData] = useState([])
    const [filters, setFilters] = useState({
        tableMode: "",
        status: "",
        orderedBy: "",
        orderDate: "",
        orderTime: "",
        sortBy: "", // for sorting field
        sortOrder: "asc" // for sorting direction
    });
    const [hourFilter, setHourFilter] = useState(""); // Hour filter state


    useEffect(() => {
        if (status === "loading") return; // Wait until session is loaded

        // If session is not available or user is a customer, redirect immediately
        if (!session || session?.user?.role === "Customer") {
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
        async function GetOrderData() {
            const order_data = await GetOrders();
            // console.log({order_data})
            setOrdersData(order_data.ordersArray);
            const res = await HandleUsers({
                mode:"get",
                item_type:"complete_order_data",
                data:{}
            })
            setNewOrdersData(res[0].OrdersJSON)
            // console.log(res[0].OrdersJSON)
        }

        if (session && permission) {
            GetOrderData();
        }
    }, [session, permission]);

    // Show loading state until session and permission check are done
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

    // function handleFilterChange(e) {
    //     const { name, value } = e.target;
    //     setFilters((prev) => ({ ...prev, [name]: value }));
    // }

    function handleSortChange(key, value) {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

    const filteredData = newOrdersData?.filter((order) => {
        const OrderHour = parseInt(order.OrderTime.split(":")[0], 10);
        const parsedHourFilter = hourFilter ? parseInt(hourFilter, 10) : null;
    
        return (
            (filters.tableMode ? order.TableMode.toLowerCase() === filters.tableMode.toLowerCase() : true) &&
            (filters.status ? order.OrderStatus.toLowerCase() === filters.status.toLowerCase() : true) &&
            (filters.orderedBy ? order.OrderPlacedBy.toLowerCase() === filters.orderedBy.toLowerCase() : true) &&
            (filters.orderDate ? order.OrderDate === filters.orderDate : true) &&
            (parsedHourFilter !== null && !isNaN(parsedHourFilter) ? OrderHour === parsedHourFilter : true)
        );
    });
    
    

    const sortedData = filteredData?.sort((a, b) => {
        const sortBy = filters.sortBy;
        const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
    
        if (!sortBy || a[sortBy] === undefined || b[sortBy] === undefined) return 0;
    
        if (sortBy === "OrderTime") {
            // Extract hour and minute for accurate sorting
            const [hourA, minuteA] = a.TimeOfOrder.split(":").map(Number);
            const [hourB, minuteB] = b.TimeOfOrder.split(":").map(Number);
    
            const timeA = hourA * 60 + minuteA; // Convert to total minutes
            const timeB = hourB * 60 + minuteB;
    
            return sortOrder * (timeA - timeB);
        }
    
        // Normalize string comparison to avoid case-sensitive sorting issues
        const valueA = String(a[sortBy]).toLowerCase();
        const valueB = String(b[sortBy]).toLowerCase();
    
        if (valueA < valueB) return -1 * sortOrder;
        if (valueA > valueB) return 1 * sortOrder;
        return 0;
    });
    

    return (
        <div className="w-[100vw] h-[100vh] flex bg-red-200">
            <div className="w-[20%] h-full bg-green-200 flex justify-center">
                <AdminSideBar AdminOption={"orders"} />
            </div>
            <div className="w-[80%] h-full flex flex-col items-center gap-2 bg-gray-50">
                <AdminHeader setSearchItem={setSearchItem} searchItem={searchItem} />
                <OrderFilters filters={filters} setFilters={setFilters} handleSortChange={handleSortChange} setHourFilter={setHourFilter} hourFilter={hourFilter}/>
                <OrdersList ordersArray={sortedData} searchItem={searchItem}/>
                {/* <OrdersPagination /> */}
            </div>
            {/* <pre>{JSON.stringify(newOrdersData,null,2)}</pre> */}
        </div>
    );
}
