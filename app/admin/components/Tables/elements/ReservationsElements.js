import { BsPeople } from "react-icons/bs";
import { MdEventNote } from "react-icons/md";
import { FaChair } from "react-icons/fa";

export default function ReservationElement({
  element = {
    ReservationID: 3,
    CustomerID: 103,
    ReservationDate: "2024-12-10",
    ReservationTime: "20:00:00",
    NumberOfGuests: 6,
    TableID: 3,
    Preferences: "Anniversary celebration",
    Status: "Confirmed",
    CreatedAt: "2024-12-03 15:30:00",
  },
}) {
  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Confirmed":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      case "Completed":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-md bg-white border border-gray-200 flex flex-col gap-4">
      {/* Top Section: Reservation Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdEventNote className="text-xl text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">
            {element.ReservationDate} at {element.ReservationTime}
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
            element.Status
          )}`}
        >
          {element.Status}
        </div>
      </div>

      {/* Middle Section: Guests and Table Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-blue-100 px-3 py-2 rounded-lg">
            <BsPeople className="text-xl text-blue-600" />
            <span className="text-blue-700 font-semibold">
              {element.NumberOfGuests} Guests
            </span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg">
            <FaChair className="text-xl text-gray-600" />
            <span className="text-gray-700 font-medium">
              Table {element.TableID}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Preferences */}
      {element.Preferences && (
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Preferences:</span>{" "}
          {element.Preferences}
        </div>
      )}

      {/* Footer Section: CreatedAt */}
      <div className="text-xs text-gray-400">
        Created on {new Date(element.CreatedAt).toLocaleString()}
      </div>
    </div>
  );
}
