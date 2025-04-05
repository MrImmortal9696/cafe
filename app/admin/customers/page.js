"use client"

import { HandleUsers } from "@/libs/apifunctions/handleUsers"
import { useEffect, useState } from "react"
import AdminSideBar from "../components/AdminSideBar"
import AdminHeader from "../components/AdminHeader"
import CustomerListElement from "../components/customers/CustomerListElement"
import { convertJsonToCsv } from "@/libs/jsonTocsv"
import { useSession } from "next-auth/react"
import { SessionChecker } from "@/libs/sessionChecker"
import { useRouter } from "next/navigation"
import { redirect } from "next/navigation";
import { FaFileDownload } from "react-icons/fa";


export default function CustomersPage() {
  const [customersData, setCustomersData] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchItem, setSearchItem] = useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter()
  const [permission, setPermission] = useState(null);
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session?.user?.role === "Customer") {
      redirect("/");
      return;
    }

    async function GetSessionCheck() {
      const hasPermission = await SessionChecker(session, "/admin/customers");
      setPermission(hasPermission);
      if (!hasPermission) {
        redirect("/");
      }
    }

    GetSessionCheck();
  }, [session, status, router]);

  useEffect(() => {
    async function getCustomers() {
      try {
        const res = await HandleUsers({ mode: "get", item_type: "customer", data: { Email: null } });
        setCustomersData(res || []);
        setFilteredCustomers(res || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }
    if (session && permission) {
      getCustomers();
    }
  }, [session, permission]);

  useEffect(() => {
    if (!searchItem) {
      setFilteredCustomers(customersData);
      return;
    }
  
    const filtered = customersData.filter(customer =>
      customer.CustomerName.toLowerCase().includes(searchItem.toLowerCase()) ||
      customer.CustomerEmail.toLowerCase().includes(searchItem.toLowerCase())
    );
  
    setFilteredCustomers(filtered);
  }, [searchItem]);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredCustomers(customersData);
      return;
    }
    
    const filtered = customersData.filter(customer => {
      const joinDate = new Date(customer.JoinDate);
      return joinDate >= new Date(startDate) && joinDate <= new Date(endDate);
    });
    
    setFilteredCustomers(filtered);
  }, [startDate, endDate]);
  
  if (status === "loading" || permission === null) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  if (!session || !permission) {
    return null;
  }

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedData = [...filteredCustomers].sort((a, b) => {
      const aValue = ["LoyaltyPoints", "WalletBalance"].includes(field) ? parseFloat(a[field]) : a[field];
      const bValue = ["LoyaltyPoints", "WalletBalance"].includes(field) ? parseFloat(b[field]) : b[field];

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(sortedData);
  };

    const handleExport = () => {
          if (filteredCustomers.length === 0) {
              alert("No data to export.");
              return;
          }
          convertJsonToCsv(filteredCustomers, "customers.csv");
      };

      const CustomerHeaders = [
        { label: "ID", field: "CustomerID", span: 1 },
        { label: "Name", field: "CustomerName", span: 1 },
        { label: "Email", field: "CustomerEmail", span: 2 },
        { label: "Password", field: "Customer_Password", span: 1 },
        { label: "Phone", field: "Phone", span: 1 },
        { label: "Address", field: "Address", span: 2 },
        { label: "Loyalty Points", field: "LoyaltyPoints", span: 1 },
        { label: "Wallet Balance", field: "WalletBalance", span: 1 },
        { label: "Actions", field: "Actions", span: 1 },
      ];

  return (
    <div>
      <div className="relative w-[100vw] h-[100vh] flex ">
        <div className="w-[15%] h-full flex justify-center">
          <AdminSideBar AdminOption={"customers"} />
        </div>
        <div className="w-[85%] h-full flex flex-col gap-2 ">
          <AdminHeader searchItem={searchItem} setSearchItem={setSearchItem} />

          <div className="p-2 bg-zinv-50 flex gap-4 items-center justify-between">
            <div className="flex gap-4  font-semibold items-center px-2">
                <label>Start Date: </label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded-lg" />
                <label>End Date: </label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded-lg" />
            </div>
            <div className="text-[24px] my-2 px-2 flex justify-end">
                <button onClick={handleExport} className="flex items-center gap-2">
                    <span className="text-[16px]">Export</span>
                    <FaFileDownload />
                </button>
            </div>
          </div>

          <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll no-scrollbar flex flex-col p-4">
          <div className="grid grid-cols-11 text-center font-bold bg-gray-100 p-2">
              {CustomerHeaders.map((header, index) => (
                <span
                  key={index}
                  onClick={() => header.field && handleSort(header.field)}
                  className={`cursor-pointer col-span-${header.span}`}
                >
                  {header.label}
                  {sortField === header.field && (
                    <span> {sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </span>
              ))}
            </div>
                {/* {console.log({filteredCustomers})} */}
            <div className="overflow-y-auto no-scrollbar h-full">
            {
              filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <CustomerListElement customer={customer} key={index} />
                ))
              ) : (
                <div className="text-center py-4">No customers found</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
