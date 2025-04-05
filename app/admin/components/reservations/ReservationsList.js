import ReservationElement from "./components/ReservationElement";
import { useState } from "react";
import ReservationFilters from "./ReservationFilters";
import { FaUser } from "react-icons/fa";

export default function ReservationList({
    reservationData,
    setReservationData,
    setTablesData
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState(""); // Date filter state
    const [hourFilter, setHourFilter] = useState(""); // Hour filter state

    const tableHeaders = ["Name", "Time", "Tables",<FaUser/>, "Actions"];
    const HeaderSpans = [3, 2, 3,1, 3];

    // Filter function
    const filterData = () => {
        return reservationData
            .filter((item) => {
                // Filter by search query (name)
                if (searchQuery && !item.CustomerName.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return false;
                }
                // Filter by status
                if (statusFilter && item.Reservation_Status !== statusFilter) {
                    return false;
                }
                // Filter by date (if provided)
                if (dateFilter) {
                    // Normalize ReservationDate to YYYY-MM-DD format (UTC)
                    const reservationDate = item.ReservationDate.split("T")[0];
                    if (reservationDate !== dateFilter) {
                        return false;
                    }
                }
                // Filter by hour (if provided), compares the hour part of the ReservationTime
                if (hourFilter) {
                    const reservationHour = parseInt(item.ReservationTime.split(":")[0], 10); // Parse hour to integer
                    const parsedHourFilter = parseInt(hourFilter, 10); // Parse hourFilter to integer
                
                    // console.log({ reservationHour, parsedHourFilter });
                
                    if (reservationHour !== parsedHourFilter) {
                        return false;
                    }
                }
                
                return true;
            })
            .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)); // Sort by CreatedAt in descending order
    };
          

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setDateFilter("");
        setHourFilter("");
    };

    return (
        <div className="w-full h-full  overflow-hidden">
            {/* Filters Component */}
            <ReservationFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                hourFilter={hourFilter}
                setHourFilter={setHourFilter}
                resetFilters={resetFilters}
            />

            <div className="grid grid-cols-12 py-2 bg-orange-100 font-semibold text-zinc-800">
                {tableHeaders.map((item, index) => (
                    <span key={index} className={`col-span-${HeaderSpans[index]} flex-center`}>
                        {item}
                    </span>
                ))}
            </div>

            <div className="flex flex-col h-[85%]  overflow-y-scroll no-scrollbar">
                {filterData().map((item, index) => (
                    <ReservationElement
                        data={item}
                        key={index}
                        setReservationData={setReservationData}
                        setTablesData={setTablesData}
                    />
                ))}
            </div>
        </div>
    );
}
