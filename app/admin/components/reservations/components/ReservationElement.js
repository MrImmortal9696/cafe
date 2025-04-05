import { GetReservations, HandleReservation, HandleTableState } from "@/libs/apifunctions/handleReservation";
import { HandleUsers } from "@/libs/apifunctions/handleUsers";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import ReservationTablesListElement from "./ReservationsTablesListElement";

export default function ReservationElement({ data, setReservationData, setTablesData }) {
    const [statusColor,setStatusColor] = useState("bg-yellow-100")
    // Format date in DD/MM/YYYY
    const formattedDate = data.ReservationDate;
    
    // Format the Reservation Time (ensure it's UTC)
    const formattedTime = (time24 => {
        const [hour, minute] = time24.split(":").map(Number);
        return `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
    })(data.ReservationTime);

    // Define options with {label, value}
 
    const reservation_status = [
        { label: "On-Going", value: "ongoing", table_state: "reserved",color:"bg-yellow-200 " },
        { label: "Completed", value: "Completed", table_state: "available",color:"bg-green-200 " },
        { label: "Cancelled", value: "Cancelled", table_state: "available",color:"bg-red-200 " },
    ];

    // Using useState to manage the selected option and status
    
    const [selectedStatus, setSelectedStatus] = useState(data.Reservation_Status);

    useEffect(() => {
        setSelectedStatus(data.Reservation_Status);
    
        // Find the matching color for initial render
        const matchedStatus = reservation_status.find(item => item.value === data.Reservation_Status);
        const statusColor = matchedStatus ? matchedStatus.color : "No matching color";
        setStatusColor(statusColor)
        // console.log({ initialStatus: data.Reservation_Status, color: statusColor });
    }, [data]);
    

    // Function to track the table state based on selected status
    function handleClick() {
        console.log({ data, selectedStatus });
    }

    // Handle status change and corresponding table state
    async function handleStatusChange(e) {
        try {
            const newStatus = e.target.value;
            setSelectedStatus(newStatus);
    
            // Find the matching color from reservation_status array
            // const matchedStatus = reservation_status.find(item => item.value === newStatus);
            // const statusColor = matchedStatus ? matchedStatus.color : "No matching color";
    
            // console.log({ newStatus, id: data.ReservationID, color: statusColor });
    
            // Update reservation status first
            const updateResponse = await HandleTableState({
                mode: "status-update",
                item_type: "reservations",
                data: {
                    Reservation_Status: newStatus,
                    ReservationID: data.ReservationID
                },
            });
    
            // Ensure the update was successful before proceeding
            if (!updateResponse || updateResponse.error) {
                console.error("Failed to update status:", updateResponse?.error);
                return; // Exit function if the update fails
            }
    
            // Fetch updated reservations
            const reservation_data = await GetReservations();
            setReservationData(reservation_data.reservations);
    
            // Fetch updated tables data
            const tables_res = await HandleUsers({
                mode: "get",
                item_type: "reservedTables",
                data: {
                    ReservationDate: new Date().toISOString().split("T")[0],
                    ReservationTime: new Date().toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                },
            });
    
            setTablesData(tables_res);
    
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }
    
     
    

    return (
        <div className={`${statusColor} px-4 bg-opacity-40 w-full grid grid-cols-12 min-h-min py-2 border-b-2`}>

    <div className="col-span-3 flex-center flex-col font-semibold py-2">
        <span className="font-semibold">{data.CustomerName}</span>
        <span className="text-[12px] opacity-70">{data.CustomerEmail}</span>
        </div>

    <div className="flex-center col-span-2 flex-col py-2">
        <span className="font-bold">{formattedTime}</span>
        <span className="font-semibold">{formattedDate}</span>
    </div>

    <div className="col-span-3 py-2 px-1 flex-center overflow-auto no-scrollbar flex-wrap gap-2">
        {data.TableNames.map((table, index) => (
            <div key={index} className="relative px-4 py-2 border border-zinc-700 rounded-lg">
                <span>{table.name}</span>
                <div className="absolute p-2 bg-orange-300 text-orange-600 flex-center -top-2 -right-2 
                                w-[20px] h-[20px] text-[12px] rounded-full font-bold">
                    {table.floor}
                </div>
            </div>
        ))}
    </div> 
    {/* <ReservationTablesListElement data={data} /> */}

    <div className="flex items-center gap-2 justify-center">
        <span><FaUser /></span>
        <span>{data.NumberOfGuests}</span>
    </div>

    <div className="flex flex-col gap-2 col-span-3 items-center justify-center p-2 rounded-lg">
        <select
            className={`w-full p-4 font-semibold text-md rounded-lg focus:outline-none ${statusColor}`}
            value={selectedStatus}
            onChange={handleStatusChange}
        >
            {reservation_status.map((option, index) => (
                <option key={index} value={option.value} className="text-gray-700">
                    {option.label}
                </option>
            ))}
        </select>
    </div>

    {data.Preferences && (
        <div className={`${statusColor} rounded-lg col-span-12 p-2 w-[98%] mx-auto flex flex-wrap`}>
            <span className="font-semibold">Note - </span>
            <p className="font-semibold break-words w-full">{data.Preferences}</p>
        </div>
    )}
</div>

    );
}
