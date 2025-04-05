import { BsLightningFill } from "react-icons/bs";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { TbSortAscendingLetters } from "react-icons/tb";
import { TbSortDescendingLetters } from "react-icons/tb";

export default function OrderFilters({ filters, setFilters, handleSortChange,setHourFilter,hourFilter }) {
    // Default filter values with sorting by OrderID descending
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            tableMode: "",
            status: "",
            orderedBy: "",
            orderDate: "",
            orderTime: "",
            sortBy: "OrderID", // Default to sorting by OrderID
            sortOrder: "desc"  // Latest orders first (descending order)
        });
        setHourFilter("")
    };

    const filtersStyle = "py-3 px-2 pr-4 bg-orange-200 text-black font-semibold rounded-lg focus:outline-none";

    return (
        <div className="flex w-full justify-between h-[100px] px-4 items-center">
            <div className="flex flex-col">
                <span className="text-[32px] font-semibold">Orders</span>
                <span>Here is your order list data</span>
            </div>

            {/* Table Mode Filters */}
            <div className="flex items-center gap-2 ">
                <button
                    onClick={() => handleFilterChange("tableMode", "")}
                    className={`py-2 px-4 rounded-lg ${!filters.tableMode ? "bg-orange-400 text-white" : "bg-orange-300"}`}
                >
                    All
                </button>
                <button
                    onClick={() => handleFilterChange("tableMode", "Dining")}
                    className={`py-2 px-4 rounded-lg ${filters.tableMode === "Dining" ? "bg-orange-400 text-white" : "bg-orange-300"}`}
                >
                    Dining
                </button>
                <button
                    onClick={() => handleFilterChange("tableMode", "Takeaway")}
                    className={`py-2 px-4 rounded-lg ${filters.tableMode === "Takeaway" ? "bg-orange-400 text-white" : "bg-orange-300"}`}
                >
                    Takeaway
                </button>
            </div>

            {/* Status and Order By Filters */}
            <div className="flex items-center gap-2">
                <select
                    className={filtersStyle}
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                {/* <select
                    className={filtersStyle}
                    value={filters.orderedBy}
                    onChange={(e) => handleFilterChange("orderedBy", e.target.value)}
                >
                    <option value="">Order by</option>
                    <option value="Customer">Customer</option>
                    <option value="Employee">Employee</option>
                </select> */}

                {/* Date Filter */}
                <input
                    type="date"
                    className={filtersStyle}
                    value={filters.orderDate}
                    onChange={(e) => handleFilterChange("orderDate", e.target.value)}
                />


                <div className={filtersStyle}>
                <select
                        className=" rounded-md bg-transparent"
                        value={hourFilter}
                        onChange={(e) => setHourFilter(e.target.value)}
                        aria-label="Filter by reservation hour"
                    >
                        <option value="" disabled>Select hour</option>
                        {Array.from({ length: 24 }, (_, i) => {
                            const hour24 = i; // Use 24-hour format directly
                            const hour12 = (i % 12) || 12; // Convert 0, 12, 24 to 12 (for 12-hour format)
                            const period = i < 12 ? "AM" : "PM"; // Determine AM/PM
                            const nextHour = (i + 1) % 12 || 12; // Next hour (12-hour format)
                            const nextPeriod = i + 1 < 12 ? "AM" : "PM"; // Next period (AM/PM)

                            return (
                                <option key={i} value={hour24}>
                                    {hour12} {period} - {nextHour} {nextPeriod}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Time Filter */}
                {/* <div className={filtersStyle}>
                    <input
                        type="time"
                        className="bg-transparent focus:outline-none cursor-pointer"
                        value={filters.orderTime || ""}
                        onChange={(e) => handleFilterChange("orderTime", e.target.value)}
                    />
                </div> */}

                {/* Reset Filters Button */}
                <div>
                    <button
                        onClick={resetFilters}
                        className="p-4 bg-red-500 text-white font-semibold rounded-lg focus:outline-none"
                    >
                        <FaFilterCircleXmark />
                    </button>
                </div>
            </div>

            {/* Sorting Filters */}
            {/* <div className="flex gap-2">
                <select
                    className={filtersStyle}
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange('sortBy', e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="OrderDate">Date</option>
                    <option value="BasePriceBill">Price</option>
                    <option value="OrderStatus">Status</option>
                    <option value="OrderTime">Time</option>
                </select>

                <button
                    onClick={() => handleSortChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center text-2xl gap-2 py-3 px-4 bg-orange-200 text-black font-semibold rounded-lg focus:outline-none"
                >
                    {filters.sortOrder === 'asc' ? <TbSortAscendingLetters /> : <TbSortDescendingLetters />}
                </button>

            </div> */}
        </div>
    );
}
