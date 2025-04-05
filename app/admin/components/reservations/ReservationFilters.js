import { FaUser } from "react-icons/fa";

export default function ReservationFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    hourFilter,
    setHourFilter,
    resetFilters
}) {
    return (
        <div className="h-[10%] w-full bg-orange-200 p-4">
            <div className="flex gap-4">
                {/* Search by Name */}
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="p-2 rounded-md bg-orange-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search by name"
                    />
                </div>

                {/* Filter by Reservation Status */}
                <div className="flex items-center">
                    <select
                        className="p-2 rounded-md bg-orange-100"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by reservation status"
                    >
                        <option value="">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="ongoing">On-Going</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Filter by Reservation Date */}
                <div className="flex items-center">
                    <input
                        type="date"
                        className="p-2 rounded-md bg-orange-100"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        aria-label="Filter by reservation date"
                    />
                </div>

                {/* Filter by Reservation Hour (without minutes) */}
                <div className="flex items-center">
                    <select
                        className="p-2 rounded-md bg-orange-100"
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

                {/* Button to reset filters */}
                <div className="flex items-center">
                    <button
                        className="px-4 py-1 bg-orange-500 font-semibold text-white rounded-md"
                        onClick={resetFilters}
                        aria-label="Clear all filters"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
